"""Subject management routes."""

from fastapi import APIRouter, Depends
from sqlmodel import Session

from core.dependencies import get_current_user
from database import get_session
from models.user import User
from schemas.subject import SubjectCreate, SubjectRead, SubjectUpdate
from services.subject_service import (
    create_subject,
    delete_subject,
    get_subject_or_404,
    list_subjects,
    update_subject,
)

router = APIRouter(prefix="/subjects", tags=["subjects"])


@router.get("", response_model=list[SubjectRead])
def get_subjects(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return list_subjects(session, current_user.id)


@router.post("", response_model=SubjectRead)
def create_subject_route(
    payload: SubjectCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return create_subject(session, current_user.id, payload)


@router.get("/{subject_id}", response_model=SubjectRead)
def get_subject_route(
    subject_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return get_subject_or_404(session, subject_id, current_user.id)


@router.put("/{subject_id}", response_model=SubjectRead)
def update_subject_route(
    subject_id: int,
    payload: SubjectUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return update_subject(session, subject_id, current_user.id, payload)


@router.delete("/{subject_id}", status_code=204)
def delete_subject_route(
    subject_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    delete_subject(session, subject_id, current_user.id)
