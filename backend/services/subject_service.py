"""Business logic for subject CRUD."""

from datetime import datetime

from fastapi import HTTPException
from sqlmodel import Session, select

from models.study_session import StudySession
from models.subject import Subject
from schemas.subject import SubjectCreate, SubjectUpdate


def list_subjects(session: Session, user_id: int) -> list[Subject]:
    return session.exec(select(Subject).where(Subject.user_id == user_id)).all()


def create_subject(session: Session, user_id: int, payload: SubjectCreate) -> Subject:
    subject = Subject(
        user_id=user_id,
        name=payload.name,
        difficulty=payload.difficulty,
        total_hours=payload.total_hours,
    )
    session.add(subject)
    session.commit()
    session.refresh(subject)
    return subject


def get_subject_or_404(session: Session, subject_id: int, user_id: int) -> Subject:
    subject = session.get(Subject, subject_id)
    if not subject or subject.user_id != user_id:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject


def update_subject(
    session: Session, subject_id: int, user_id: int, payload: SubjectUpdate
) -> Subject:
    subject = get_subject_or_404(session, subject_id, user_id)
    updates = payload.model_dump(exclude_none=True)
    for key, value in updates.items():
        setattr(subject, key, value)
    subject.updated_at = datetime.utcnow()
    session.add(subject)
    session.commit()
    session.refresh(subject)
    return subject


def delete_subject(session: Session, subject_id: int, user_id: int) -> None:
    subject = get_subject_or_404(session, subject_id, user_id)

    related_sessions = session.exec(
        select(StudySession).where(StudySession.subject_id == subject_id)
    ).all()
    for study_session in related_sessions:
        session.delete(study_session)

    session.delete(subject)
    session.commit()
