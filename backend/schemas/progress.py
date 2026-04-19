"""Progress schemas."""

from pydantic import BaseModel, Field


class MarkCompleteRequest(BaseModel):
    session_id: int
    completed_hours: float = Field(ge=0)


class ProgressRead(BaseModel):
    plan_id: int
    completed_hours: float
    remaining_hours: float
    completion_percentage: float
