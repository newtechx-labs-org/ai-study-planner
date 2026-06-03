"""Reminder model."""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, Optional

from sqlalchemy import Column
from sqlalchemy import JSON
from sqlmodel import Field, SQLModel


class ReminderType(str, Enum):
    daily = "daily"
    one_day = "one_day"
    weekdays = "weekdays"
    custom = "custom"


class Reminder(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    type: ReminderType
    data: Dict[str, Any] = Field(sa_column=Column(JSON, nullable=False))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
