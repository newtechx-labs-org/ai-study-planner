"""User profile routes."""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from core.dependencies import get_current_user, oauth2_scheme, require_role
from core.security import decode_token
from database import get_session
from models.user import User
from schemas.user import PasswordChange, UserNameOut, UserRead, UserUpdate
from utils import hash_password, update_model, verify_password

router = APIRouter(tags=["users"])


@router.patch("/me", response_model=UserRead)
def update_me(
    payload: UserUpdate,
    current: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    current = session.exec(select(User).where(User.username == current.username)).first()
    if not current:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.username and payload.username != current.username:
        exists = session.exec(select(User).where(User.username == payload.username)).first()
        if exists:
            raise HTTPException(status_code=400, detail="Username already taken")

    update_model(current, payload.model_dump())
    session.add(current)
    session.commit()
    session.refresh(current)
    return current


@router.post("/me/change-password", status_code=204)
def change_password(
    data: PasswordChange,
    current: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if not verify_password(data.current_password, current.encrypted_password):
        raise HTTPException(status_code=401, detail="Current password incorrect")

    current.encrypted_password = hash_password(data.new_password)
    session.add(current)
    session.commit()


@router.get("/users/{user_id}/name", response_model=UserNameOut)
def get_user_display_name(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.first_name or user.last_name:
        display_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
    elif user.username:
        display_name = user.username
    else:
        display_name = user.email

    return UserNameOut(id=user.id, display_name=display_name)


@router.get("/me", response_model=UserRead)
def get_me(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = session.exec(select(User).where(User.username == payload["username"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/profile")
def get_profile(
    access_token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    payload = decode_token(access_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    username = payload.get("username")
    role = payload.get("role")
    email = payload.get("email")
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "user": {
            "username": username,
            "role": role,
            "email": email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
    }


@router.get("/all-users")
def admin_only(current_user: User = Depends(require_role("user"))):
    return {"message": f"Welcome Admin {current_user.username}!"}
