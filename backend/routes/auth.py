"""Authentication routes."""

from fastapi import APIRouter, Cookie, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlmodel import Session, select

from core.config import ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_MINUTES
from core.security import create_access_token, create_refresh_token, decode_token
from core.token_blacklist import blacklisted_tokens
from database import get_session
from models.user import User
from schemas.user import LoginResponse, Token, UserCreate, UserLogin, UserRead
from utils import hash_password, verify_password

router = APIRouter(tags=["auth"])


@router.post("/register", response_model=UserRead)
def register(user: UserCreate, session: Session = Depends(get_session)):
    if session.exec(select(User).where(User.username == user.username)).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if session.exec(select(User).where(User.email == user.email)).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        encrypted_password=hash_password(user.password),
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


@router.post("/login", response_model=LoginResponse)
def login(user: UserLogin, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(User.email == user.email)).first()
    if not db_user or not verify_password(user.password, db_user.encrypted_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={
            "email": db_user.email,
            "role": db_user.role,
            "username": db_user.username,
        }
    )
    refresh_token = create_refresh_token(
        data={
            "email": db_user.email,
            "role": db_user.role,
            "username": db_user.username,
        }
    )

    user_data = {
        "username": db_user.username,
        "email": db_user.email,
        "role": db_user.role,
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
    }
    response = JSONResponse(
        content={
            "message": "Login successful",
            "user": user_data,
            "access_token": access_token,
        },
        status_code=status.HTTP_200_OK,
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        expires=REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

    return response


@router.post("/logout")
def logout(refresh_token: str = Cookie(default=None)):
    if refresh_token:
        blacklisted_tokens.add(refresh_token)
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("refresh_token")
    return response


@router.post("/refresh")
def refresh_token_handler(refresh_token: str = Cookie(default=None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    if refresh_token in blacklisted_tokens:
        raise HTTPException(status_code=401, detail="Refresh token is blacklisted")

    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    username = payload.get("username")
    email = payload.get("email")
    role = payload.get("role")
    if not username:
        raise HTTPException(status_code=401, detail="Invalid refresh token payload")

    new_access_token = create_access_token(
        data={"email": email, "username": username, "role": role}
    )
    new_refresh_token = create_refresh_token(
        data={"email": email, "username": username, "role": role}
    )

    response = JSONResponse(
        content={"message": "Token refreshed", "access_token": new_access_token},
        status_code=status.HTTP_200_OK,
    )
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        expires=REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    return response
