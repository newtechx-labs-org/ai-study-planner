"""User schemas."""

from typing import Optional

from pydantic import BaseModel, EmailStr, constr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: str
    last_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool
    is_admin: bool
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserDetails(BaseModel):
    email: EmailStr
    role: str


class UserUpdate(BaseModel):
    first_name: Optional[constr(strip_whitespace=True, max_length=50)] = None
    last_name: Optional[constr(strip_whitespace=True, max_length=50)] = None
    username: Optional[constr(strip_whitespace=True, min_length=3, max_length=30)] = None


class PasswordChange(BaseModel):
    current_password: constr(min_length=8)
    new_password: constr(min_length=8)


class LoginResponse(BaseModel):
    message: str
    user: dict
    access_token: str


class UserNameOut(BaseModel):
    id: int
    display_name: str

    class Config:
        from_attributes = True
