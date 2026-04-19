"""Study plan model."""

from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class StudyPlan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    version: int = Field(default=1, index=True)
    parent_plan_id: Optional[int] = Field(default=None, foreign_key="studyplan.id")
    target_end_date: datetime = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
