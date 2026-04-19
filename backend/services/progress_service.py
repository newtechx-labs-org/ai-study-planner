"""Progress tracking services."""

from fastapi import HTTPException
from sqlmodel import Session, select

from models.study_plan import StudyPlan
from models.study_session import StudySession


def mark_complete(
    session: Session,
    user_id: int,
    session_id: int,
    completed_hours: float,
) -> StudySession:
    """Mark session complete (fully or partially)."""
    study_session = session.get(StudySession, session_id)
    if not study_session:
        raise HTTPException(status_code=404, detail="Study session not found")

    plan = session.get(StudyPlan, study_session.plan_id)
    if not plan or plan.user_id != user_id:
        raise HTTPException(status_code=404, detail="Study session not found")

    if completed_hours > study_session.planned_hours:
        raise HTTPException(
            status_code=400,
            detail="completed_hours cannot exceed planned_hours",
        )

    study_session.completed_hours = completed_hours
    study_session.completed = completed_hours >= study_session.planned_hours
    session.add(study_session)
    session.commit()
    session.refresh(study_session)
    return study_session


def get_progress(session: Session, user_id: int, plan_id: int | None = None) -> dict:
    """Aggregate completion metrics for a plan."""
    if plan_id is None:
        plan = session.exec(
            select(StudyPlan)
            .where(StudyPlan.user_id == user_id)
            .order_by(StudyPlan.version.desc())
        ).first()
    else:
        plan = session.get(StudyPlan, plan_id)
        if plan and plan.user_id != user_id:
            plan = None

    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    sessions = session.exec(select(StudySession).where(StudySession.plan_id == plan.id)).all()

    total_planned = sum(s.planned_hours for s in sessions)
    total_completed = sum(min(s.completed_hours, s.planned_hours) for s in sessions)
    remaining = max(total_planned - total_completed, 0)
    percent = round((total_completed / total_planned) * 100, 2) if total_planned else 0.0

    return {
        "plan_id": plan.id,
        "completed_hours": round(total_completed, 2),
        "remaining_hours": round(remaining, 2),
        "completion_percentage": percent,
    }
