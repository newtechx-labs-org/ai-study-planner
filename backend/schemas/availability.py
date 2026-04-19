"""Availability schemas."""

from datetime import datetime
from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field, model_validator

from models.availability import AvailabilityType


class DailySlot(BaseModel):
    day: Literal["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    start: str = Field(pattern=r"^([01]\d|2[0-3]):[0-5]\d$")
    end: str = Field(pattern=r"^([01]\d|2[0-3]):[0-5]\d$")


class AvailabilitySet(BaseModel):
    type: AvailabilityType
    data: Dict[str, Any]

    @model_validator(mode="after")
    def validate_payload(self) -> "AvailabilitySet":
        if self.type == AvailabilityType.weekly:
            weekly_hours = self.data.get("weekly_hours")
            if weekly_hours is None or float(weekly_hours) <= 0:
                raise ValueError("weekly_hours must be > 0 for weekly availability")
        if self.type == AvailabilityType.daily:
            slots = self.data.get("slots")
            if not isinstance(slots, list) or not slots:
                raise ValueError("slots must be a non-empty list for daily availability")
            for slot in slots:
                DailySlot(**slot)
        return self


class AvailabilityRead(BaseModel):
    id: int
    type: AvailabilityType
    data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
