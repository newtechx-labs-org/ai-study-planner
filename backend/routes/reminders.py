"""Reminder routes."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from core.dependencies import get_current_user
from database import get_session
from models.user import User
from schemas.reminder import ReminderCreate, ReminderRead
from services.reminder_service import (
    create_or_update_reminder,
    delete_reminder,
    get_next_reminder_with_subjects,
    get_reminder_for_user,
)

router = APIRouter(prefix="/reminders", tags=["reminders"])


@router.post("", response_model=ReminderRead)
def set_reminder_route(
    payload: ReminderCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return create_or_update_reminder(session, current_user.id, payload.model_dump())


@router.get("", response_model=ReminderRead)
def get_reminder_route(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    reminder = get_reminder_for_user(session, current_user.id)
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not set")
    return reminder


@router.get("/next")
def get_next_reminder_route(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    result = get_next_reminder_with_subjects(session, current_user.id)
    if not result:
        raise HTTPException(status_code=404, detail="Reminder not set")
    reminder = result["reminder"]
    next_run: datetime | None = result["next_run"]
    subjects = result["subjects"]
    # return next_run as UTC-marked ISO string so clients parse consistently
    return {
        "reminder_id": reminder.id,
        "reminder": {"id": reminder.id, "type": reminder.type.value, "data": reminder.data},
        "next_run": (next_run.isoformat() + "Z") if next_run else None,
        "subjects": subjects,
    }


@router.delete("")
def delete_reminder_route(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    ok = delete_reminder(session, current_user.id)
    if not ok:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return {"message": "deleted"}
