"""Study plan schemas."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class GeneratePlanRequest(BaseModel):
    target_end_date: datetime
    subject_ids: List[int] | None = None


class SessionItem(BaseModel):
    id: int | None = None
    date: datetime
    subject_id: int
    subject_name: str
    planned_hours: float = Field(gt=0)
    completed: bool = False
    completed_hours: float = Field(default=0, ge=0)


class GeneratePlanResponse(BaseModel):
    plan_id: int
    version: int
    ai_used: bool
    sessions: List[SessionItem]


class StudyPlanRead(BaseModel):
    id: int
    user_id: int
    version: int
    parent_plan_id: Optional[int] = None
    target_end_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class PlanWithSessions(BaseModel):
    plan: StudyPlanRead
    sessions: List[SessionItem]


class AdjustPlanRequest(BaseModel):
    reason: str = Field(default="missed_sessions", min_length=3, max_length=200)
