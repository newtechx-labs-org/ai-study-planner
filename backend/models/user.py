"""User model."""

from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    encrypted_password: str
    is_active: bool = True
    is_admin: bool = False
    role: str = "user"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None
    last_login: Optional[datetime] = None
    phone_number: Optional[str] = Field(default=None, index=True, unique=True)
