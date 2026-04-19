"""Progress routes."""

from fastapi import APIRouter, Depends
from sqlmodel import Session

from core.dependencies import get_current_user
from database import get_session
from models.user import User
from schemas.progress import MarkCompleteRequest, ProgressRead
from services.progress_service import get_progress, mark_complete

router = APIRouter(tags=["progress"])


@router.post("/mark-complete")
def mark_complete_route(
    payload: MarkCompleteRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    study_session = mark_complete(
        session=session,
        user_id=current_user.id,
        session_id=payload.session_id,
        completed_hours=payload.completed_hours,
    )
    return {
        "message": "Session updated",
        "session_id": study_session.id,
        "completed": study_session.completed,
        "completed_hours": study_session.completed_hours,
    }


@router.get("/progress", response_model=ProgressRead)
def get_progress_route(
    plan_id: int | None = None,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    payload = get_progress(session=session, user_id=current_user.id, plan_id=plan_id)
    return ProgressRead(**payload)
