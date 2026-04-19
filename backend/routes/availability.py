"""Availability routes."""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from core.dependencies import get_current_user
from database import get_session
from models.user import User
from schemas.availability import AvailabilityRead, AvailabilitySet
from services.availability_service import get_availability, set_availability

router = APIRouter(prefix="/availability", tags=["availability"])


@router.post("", response_model=AvailabilityRead)
def set_availability_route(
    payload: AvailabilitySet,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return set_availability(session, current_user.id, payload)


@router.get("", response_model=AvailabilityRead)
def get_availability_route(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    availability = get_availability(session, current_user.id)
    if not availability:
        raise HTTPException(status_code=404, detail="Availability not set")
    return availability
