"""Study session model."""

from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class StudySession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    plan_id: int = Field(foreign_key="studyplan.id", index=True)
    subject_id: int = Field(foreign_key="subject.id", index=True)
    date: datetime = Field(index=True)
    planned_hours: float = Field(gt=0)
    completed: bool = Field(default=False)
    completed_hours: float = Field(default=0, ge=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
