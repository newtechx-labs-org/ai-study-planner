"""Business logic for study availability."""

from datetime import datetime

from sqlmodel import Session, select

from models.availability import Availability
from schemas.availability import AvailabilitySet


def set_availability(session: Session, user_id: int, payload: AvailabilitySet) -> Availability:
    availability = session.exec(
        select(Availability).where(Availability.user_id == user_id)
    ).first()

    if not availability:
        availability = Availability(user_id=user_id, type=payload.type, data=payload.data)
    else:
        availability.type = payload.type
        availability.data = payload.data
        availability.updated_at = datetime.utcnow()

    session.add(availability)
    session.commit()
    session.refresh(availability)
    return availability


def get_availability(session: Session, user_id: int) -> Availability | None:
    return session.exec(select(Availability).where(Availability.user_id == user_id)).first()
