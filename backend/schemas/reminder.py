"""Reminder schemas."""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, model_validator

from models.reminder import ReminderType


class ReminderCreate(BaseModel):
    type: ReminderType
    data: Dict[str, Any]

    @model_validator(mode="after")
    def validate_payload(self) -> "ReminderCreate":
        t = self.type
        d = self.data
        if t == ReminderType.daily:
            times = d.get("times")
            if not isinstance(times, list) or not times:
                raise ValueError("daily reminders require a non-empty list of `times` (HH:MM)")
        if t == ReminderType.one_day:
            at = d.get("at")
            if at is None:
                raise ValueError("one_day reminders require `at` datetime")
        if t == ReminderType.weekdays:
            days = d.get("days")
            time = d.get("time")
            if not isinstance(days, list) or not days:
                raise ValueError("weekdays reminders require `days` list")
            if time is None:
                raise ValueError("weekdays reminders require `time` (HH:MM)")
        if t == ReminderType.custom:
            slots = d.get("slots")
            if not isinstance(slots, list) or not slots:
                raise ValueError("custom reminders require `slots` list of datetimes")
        return self


class ReminderRead(BaseModel):
    id: int
    user_id: int
    type: ReminderType
    data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
