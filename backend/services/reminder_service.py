"""Reminder service utilities."""

from datetime import datetime, timedelta, time
from typing import Any, Dict, List, Optional

from sqlmodel import Session, select

from models.reminder import Reminder, ReminderType
from models.subject import Subject


def get_reminder_for_user(session: Session, user_id: int) -> Optional[Reminder]:
    return session.exec(select(Reminder).where(Reminder.user_id == user_id)).first()


def create_or_update_reminder(session: Session, user_id: int, payload: Dict[str, Any]) -> Reminder:
    existing = get_reminder_for_user(session, user_id)
    if existing:
        existing.type = ReminderType(payload["type"]) if isinstance(payload.get("type"), str) else payload["type"]
        existing.data = payload["data"]
        existing.updated_at = datetime.utcnow()
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing

    new = Reminder(user_id=user_id, type=ReminderType(payload["type"]), data=payload["data"])
    session.add(new)
    session.commit()
    session.refresh(new)
    return new


def delete_reminder(session: Session, user_id: int) -> bool:
    existing = get_reminder_for_user(session, user_id)
    if not existing:
        return False
    session.delete(existing)
    session.commit()
    return True


def _parse_time_str(tstr: str) -> time:
    h, m = tstr.split(":")
    return time(int(h), int(m))


def compute_next_occurrence(reminder: Reminder, now: Optional[datetime] = None) -> Optional[datetime]:
    now = now or datetime.utcnow()
    rtype = reminder.type
    data = reminder.data
    if rtype == ReminderType.daily:
        times: List[str] = data.get("times", [])
        candidates: List[datetime] = []
        for t in times:
            tt = _parse_time_str(t)
            candidate = datetime.combine(now.date(), tt)
            if candidate <= now:
                candidate = candidate + timedelta(days=1)
            candidates.append(candidate)
        return min(candidates) if candidates else None

    if rtype == ReminderType.one_day:
        at = data.get("at")
        if not at:
            return None
        at_dt = datetime.fromisoformat(at) if isinstance(at, str) else at
        return at_dt if at_dt > now else None

    if rtype == ReminderType.weekdays:
        days: List[str] = data.get("days", [])
        tstr: str = data.get("time")
        if not days or not tstr:
            return None
        weekday_map = {"Mon": 0, "Tue": 1, "Wed": 2, "Thu": 3, "Fri": 4, "Sat": 5, "Sun": 6}
        target_weekdays = [weekday_map[d] for d in days if d in weekday_map]
        if not target_weekdays:
            return None
        tt = _parse_time_str(tstr)
        for offset in range(0, 14):
            candidate_date = now.date() + timedelta(days=offset)
            if candidate_date.weekday() in target_weekdays:
                candidate = datetime.combine(candidate_date, tt)
                if candidate > now:
                    return candidate
        return None

    if rtype == ReminderType.custom:
        slots: List[str] = data.get("slots", [])
        future = []
        for s in slots:
            try:
                dt = datetime.fromisoformat(s) if isinstance(s, str) else s
            except Exception:
                continue
            if dt > now:
                future.append(dt)
        return min(future) if future else None

    return None


def get_next_reminder_with_subjects(session: Session, user_id: int) -> Optional[Dict[str, Any]]:
    reminder = get_reminder_for_user(session, user_id)
    if not reminder:
        return None
    next_dt = compute_next_occurrence(reminder)
    subjects = session.exec(select(Subject).where(Subject.user_id == user_id)).all()
    subject_list = [{"id": s.id, "name": s.name} for s in subjects]
    return {
        "reminder": reminder,
        "next_run": next_dt,
        "subjects": subject_list,
    }
