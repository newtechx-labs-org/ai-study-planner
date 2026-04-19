"""Study plan orchestration service."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import HTTPException
from sqlmodel import Session, select

from models.availability import Availability, AvailabilityType
from models.study_plan import StudyPlan
from models.study_session import StudySession
from models.subject import Subject
from services.ai_service import generate_ai_schedule, generate_fallback_schedule


def _to_naive_utc(value: datetime) -> datetime:
    """Convert both aware and naive datetimes to naive UTC for safe comparisons/storage."""
    if value.tzinfo is None:
        return value
    return value.astimezone(timezone.utc).replace(tzinfo=None)


def _subject_payload(subjects: list[Subject]) -> list[dict[str, Any]]:
    return [
        {
            "id": s.id,
            "name": s.name,
            "difficulty": s.difficulty.value,
            "total_hours": s.total_hours,
        }
        for s in subjects
    ]


def _availability_payload(availability: Availability) -> dict[str, Any]:
    return {
        "type": availability.type.value,
        "data": availability.data,
    }


def _next_version(session: Session, user_id: int) -> int:
    latest = session.exec(
        select(StudyPlan)
        .where(StudyPlan.user_id == user_id)
        .order_by(StudyPlan.version.desc())
    ).first()
    return (latest.version + 1) if latest else 1


def _map_schedule_to_sessions(
    schedule: list[dict[str, Any]],
    subjects: list[Subject],
) -> list[dict[str, Any]]:
    by_name = {s.name.lower(): s for s in subjects}
    by_id = {s.id: s for s in subjects}
    items: list[dict[str, Any]] = []
    for row in schedule:
        subject = None
        if row.get("subject_id") in by_id:
            subject = by_id[row["subject_id"]]
        elif row.get("subject_name"):
            subject = by_name.get(str(row["subject_name"]).lower())

        if not subject:
            continue

        hours = float(row.get("planned_hours", 0))
        if hours <= 0:
            continue

        date_value = row["date"]
        if isinstance(date_value, str):
            session_date = datetime.fromisoformat(date_value.replace("Z", "+00:00"))
        elif isinstance(date_value, datetime):
            session_date = date_value
        else:
            raise HTTPException(status_code=400, detail="Invalid schedule date format")

        session_date = _to_naive_utc(session_date)

        items.append(
            {
                "date": session_date,
                "subject_id": subject.id,
                "subject_name": subject.name,
                "planned_hours": round(hours, 2),
            }
        )
    return items


def _load_subjects_for_user(
    session: Session,
    user_id: int,
    subject_ids: list[int] | None = None,
) -> list[Subject]:
    query = select(Subject).where(Subject.user_id == user_id)
    if subject_ids is not None:
        if not subject_ids:
            raise HTTPException(status_code=400, detail="At least one subject must be selected")
        unique_ids = list(dict.fromkeys(subject_ids))
        subjects = session.exec(query.where(Subject.id.in_(unique_ids))).all()
        found_ids = {item.id for item in subjects}
        if any(item_id not in found_ids for item_id in unique_ids):
            raise HTTPException(status_code=400, detail="One or more selected subjects are invalid")
    else:
        subjects = session.exec(query).all()

    if not subjects:
        raise HTTPException(status_code=400, detail="At least one subject is required")
    return subjects


def _load_availability_for_user(session: Session, user_id: int) -> Availability:
    availability = session.exec(
        select(Availability).where(Availability.user_id == user_id)
    ).first()
    if not availability:
        # Provision a safe default so first-time users can still generate a plan.
        availability = Availability(
            user_id=user_id,
            type=AvailabilityType.weekly,
            data={"weekly_hours": 14},
        )
        session.add(availability)
        session.commit()
        session.refresh(availability)
    return availability


def generate_plan(
    session: Session,
    user_id: int,
    target_end_date: datetime,
    parent_plan_id: int | None = None,
    start_date: datetime | None = None,
    subject_ids: list[int] | None = None,
) -> tuple[StudyPlan, list[dict[str, Any]], bool]:
    """Generate and persist plan with AI-first strategy and deterministic fallback."""
    normalized_target_end_date = _to_naive_utc(target_end_date)
    if normalized_target_end_date <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="target_end_date must be in the future")

    normalized_start_date = _to_naive_utc(start_date) if start_date else None

    subjects = _load_subjects_for_user(session, user_id, subject_ids=subject_ids)
    availability = _load_availability_for_user(session, user_id)
    subject_payload = _subject_payload(subjects)
    availability_payload = _availability_payload(availability)

    ai_used = True
    try:
        schedule = generate_ai_schedule(
            subject_payload,
            availability_payload,
            normalized_target_end_date,
        )
    except Exception:
        ai_used = False
        schedule = generate_fallback_schedule(
            subject_payload,
            availability_payload,
            normalized_target_end_date,
            start_date=normalized_start_date,
        )

    sessions_payload = _map_schedule_to_sessions(schedule, subjects)
    if not sessions_payload:
        raise HTTPException(status_code=400, detail="Failed to generate any sessions")

    plan = StudyPlan(
        user_id=user_id,
        version=_next_version(session, user_id),
        parent_plan_id=parent_plan_id,
        target_end_date=normalized_target_end_date,
    )
    session.add(plan)
    session.commit()
    session.refresh(plan)

    for row in sessions_payload:
        session.add(
            StudySession(
                plan_id=plan.id,
                subject_id=row["subject_id"],
                date=row["date"],
                planned_hours=row["planned_hours"],
            )
        )

    session.commit()
    return plan, sessions_payload, ai_used


def list_plans(session: Session, user_id: int) -> list[StudyPlan]:
    return session.exec(
        select(StudyPlan)
        .where(StudyPlan.user_id == user_id)
        .order_by(StudyPlan.version.desc())
    ).all()


def get_plan_with_sessions(
    session: Session, user_id: int, plan_id: int
) -> tuple[StudyPlan, list[StudySession], dict[int, Subject]]:
    plan = session.get(StudyPlan, plan_id)
    if not plan or plan.user_id != user_id:
        raise HTTPException(status_code=404, detail="Plan not found")

    sessions = session.exec(
        select(StudySession)
        .where(StudySession.plan_id == plan.id)
        .order_by(StudySession.date.asc())
    ).all()

    subject_ids = {s.subject_id for s in sessions}
    subject_map = {}
    if subject_ids:
        subjects = session.exec(select(Subject).where(Subject.id.in_(subject_ids))).all()
        subject_map = {s.id: s for s in subjects}

    return plan, sessions, subject_map


def adjust_plan_for_missed_sessions(
    session: Session,
    user_id: int,
    plan_id: int,
) -> tuple[StudyPlan, list[dict[str, Any]], bool]:
    """Regenerate remaining work into a new plan version."""
    plan, sessions, _ = get_plan_with_sessions(session, user_id, plan_id)

    now = datetime.utcnow()
    normalized_plan_end_date = _to_naive_utc(plan.target_end_date)
    remaining_by_subject: dict[int, float] = {}
    for study_session in sessions:
        remaining = max(study_session.planned_hours - study_session.completed_hours, 0)
        if remaining <= 0:
            continue
        session_date = _to_naive_utc(study_session.date)
        if session_date <= now or not study_session.completed:
            remaining_by_subject[study_session.subject_id] = (
                remaining_by_subject.get(study_session.subject_id, 0) + remaining
            )

    if not remaining_by_subject:
        raise HTTPException(status_code=400, detail="No remaining sessions to adjust")

    subjects = session.exec(
        select(Subject).where(Subject.id.in_(list(remaining_by_subject.keys())))
    ).all()
    for subject in subjects:
        subject.total_hours = round(remaining_by_subject.get(subject.id, 0), 2)

    availability = _load_availability_for_user(session, user_id)
    subject_payload = _subject_payload(subjects)
    availability_payload = _availability_payload(availability)

    ai_used = True
    try:
        schedule = generate_ai_schedule(
            subject_payload,
            availability_payload,
            normalized_plan_end_date,
        )
    except Exception:
        ai_used = False
        schedule = generate_fallback_schedule(
            subject_payload,
            availability_payload,
            normalized_plan_end_date,
            start_date=now + timedelta(days=1),
        )

    sessions_payload = _map_schedule_to_sessions(schedule, subjects)
    if not sessions_payload:
        raise HTTPException(status_code=400, detail="Unable to generate adjusted sessions")

    new_plan = StudyPlan(
        user_id=user_id,
        version=_next_version(session, user_id),
        parent_plan_id=plan.id,
        target_end_date=normalized_plan_end_date,
    )
    session.add(new_plan)
    session.commit()
    session.refresh(new_plan)

    for row in sessions_payload:
        session.add(
            StudySession(
                plan_id=new_plan.id,
                subject_id=row["subject_id"],
                date=row["date"],
                planned_hours=row["planned_hours"],
            )
        )

    session.commit()
    return new_plan, sessions_payload, ai_used


def delete_plan(session: Session, user_id: int, plan_id: int) -> int:
    """Delete a single plan (and descendant versions) with their sessions."""
    plan = session.get(StudyPlan, plan_id)
    if not plan or plan.user_id != user_id:
        raise HTTPException(status_code=404, detail="Plan not found")

    user_plans = session.exec(select(StudyPlan).where(StudyPlan.user_id == user_id)).all()
    children_by_parent: dict[int, list[int]] = {}
    for user_plan in user_plans:
        if user_plan.parent_plan_id is None or user_plan.id is None:
            continue
        children_by_parent.setdefault(user_plan.parent_plan_id, []).append(user_plan.id)

    plan_ids_to_delete: list[int] = []
    stack = [plan_id]
    seen: set[int] = set()
    while stack:
        current = stack.pop()
        if current in seen:
            continue
        seen.add(current)
        plan_ids_to_delete.append(current)
        stack.extend(children_by_parent.get(current, []))

    sessions = session.exec(
        select(StudySession).where(StudySession.plan_id.in_(plan_ids_to_delete))
    ).all()
    for item in sessions:
        session.delete(item)
    # Flush session deletions first so no plan row is still referenced by StudySession.
    session.flush()

    # Delete leaf plans first so parent_plan_id FK constraints are never violated.
    plan_by_id = {item.id: item for item in user_plans if item.id in seen}
    pending_ids = set(plan_by_id.keys())
    while pending_ids:
        leaves = [
            item_id
            for item_id in pending_ids
            if not any(child_id in pending_ids for child_id in children_by_parent.get(item_id, []))
        ]
        if not leaves:
            raise HTTPException(status_code=400, detail="Unable to resolve plan hierarchy for deletion")
        for item_id in leaves:
            session.delete(plan_by_id[item_id])
            pending_ids.remove(item_id)
        # Force SQL execution per layer to guarantee child rows are deleted before parents.
        session.flush()

    session.commit()
    return len(sessions)


def delete_all_plans(session: Session, user_id: int) -> tuple[int, int]:
    """Delete all plans and related sessions for the current user."""
    plans = session.exec(select(StudyPlan).where(StudyPlan.user_id == user_id)).all()
    if not plans:
        return 0, 0

    plan_ids = [plan.id for plan in plans if plan.id is not None]
    sessions: list[StudySession] = []
    if plan_ids:
        sessions = session.exec(
            select(StudySession).where(StudySession.plan_id.in_(plan_ids))
        ).all()

    for item in sessions:
        session.delete(item)
    # Enforce SQL execution order: sessions must be removed before plan rows.
    session.flush()

    children_by_parent: dict[int, list[int]] = {}
    plan_by_id = {plan.id: plan for plan in plans if plan.id is not None}
    for plan in plans:
        if plan.parent_plan_id is None or plan.id is None:
            continue
        children_by_parent.setdefault(plan.parent_plan_id, []).append(plan.id)

    # Delete all plans in leaf-first order to satisfy self-referencing FK.
    pending_ids = set(plan_by_id.keys())
    while pending_ids:
        leaves = [
            item_id
            for item_id in pending_ids
            if not any(child_id in pending_ids for child_id in children_by_parent.get(item_id, []))
        ]
        if not leaves:
            raise HTTPException(status_code=400, detail="Unable to resolve plan hierarchy for deletion")
        for item_id in leaves:
            session.delete(plan_by_id[item_id])
            pending_ids.remove(item_id)
        # Flush every level so parents are never deleted before their children.
        session.flush()

    session.commit()
    return len(plans), len(sessions)
