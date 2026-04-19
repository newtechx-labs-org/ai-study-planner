"""Subject schemas."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from models.subject import DifficultyLevel


class SubjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    difficulty: DifficultyLevel
    total_hours: float = Field(gt=0)


class SubjectUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    difficulty: Optional[DifficultyLevel] = None
    total_hours: Optional[float] = Field(default=None, gt=0)


class SubjectRead(BaseModel):
    id: int
    name: str
    difficulty: DifficultyLevel
    total_hours: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
