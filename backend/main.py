from fastapi import FastAPI, Depends, HTTPException, status, Cookie
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from models import User
from schemas import UserCreate, UserRead, Token, UserLogin, LoginResponse, UserNameOut, UserUpdate, PasswordChange
from utils import hash_password, verify_password, update_model
from auth import create_access_token, create_refresh_token, decode_token
from database import get_session, init_db
import os
from dotenv import load_dotenv

load_dotenv()
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)) * 60 # 30 minutes
REFRESH_TOKEN_EXPIRE_MINUTES = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", 1440)) * 60 * 7 # 7 days

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

blacklisted_tokens = set()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

@app.on_event("startup")
def on_startup():
    init_db()

# Auth dependencies
def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    username = payload.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def require_role(role: str):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != role:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker

@app.post("/register", response_model=UserRead)
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
        encrypted_password=hash_password(user.password)
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

@app.post("/login", response_model=LoginResponse)
def login(user: UserLogin, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(User.email == user.email)).first()
    if not db_user or not verify_password(user.password, db_user.encrypted_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # Create token
    access_token = create_access_token(data={"email": db_user.email, 'role': db_user.role, "username": db_user.username})
    refresh_token = create_refresh_token(data={"email": db_user.email, 'role': db_user.role, "username": db_user.username})
    
    # Prepare response
    user_data = {
        "username": db_user.username,
        "email": db_user.email,
        "role": db_user.role,
        "first_name": db_user.first_name,
        "last_name": db_user.last_name
    }
    response = JSONResponse(
        content={"message": "Login successful", "user": user_data, "access_token": access_token },
        status_code=status.HTTP_200_OK
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES,
        expires=REFRESH_TOKEN_EXPIRE_MINUTES,
        path="/"
    )

    return response

@app.post("/logout")
def logout(refresh_token: str = Cookie(None)):
    if refresh_token:
        blacklisted_tokens.add(refresh_token)  # Add to blacklist
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("refresh_token")
    return response

@app.patch("/me", response_model=UserRead)
def update_me(
    payload: UserUpdate,
    current: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    current = session.exec(select(User).where(User.username == current.username)).first()
    if not current:
        raise HTTPException(status_code=404, detail="User not found")
    # Validate unique username if it’s being changed
    if payload.username and payload.username != current.username:
        exists = session.exec(
            select(User).where(User.username == payload.username)
        ).first()
        if exists:
            raise HTTPException(400, "Username already taken")

    # Apply partial update
    update_model(current, payload.model_dump())
    session.add(current)
    session.commit()
    session.refresh(current)

    # OPTIONAL: prompt the client to refresh its JWT if “sub” (username)
    # is part of the token claims.
    return current


@app.post("/me/change-password", status_code=204)
def change_password(
    data: PasswordChange,
    current: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if not verify_password(data.current_password, current.encrypted_password):
        raise HTTPException(401, "Current password incorrect")
    

    current.encrypted_password = hash_password(data.new_password)
    session.add(current)
    session.commit()

@app.post("/refresh", response_model=Token)
def refresh_token(refresh_token: str = Cookie(None)):
    print("refresh_token", refresh_token)

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
    new_access_token = create_access_token(data={"email": email, "username": username, 'role': role})
    new_refresh_token = create_refresh_token(data={"email": email, "username": username, 'role': role})

    # Refresh token rotation: overwrite the old one
    response = JSONResponse(
        content={"message": "Login successful", "access_token": new_access_token},
        status_code=status.HTTP_200_OK
    )

    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES,
        expires=REFRESH_TOKEN_EXPIRE_MINUTES,
        path="/"
    )
    return response


@app.get("/users/{user_id}/name", response_model=UserNameOut)
def get_user_display_name(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Build “display_name”
    if user.first_name or user.last_name:
        disp = f"{user.first_name or ''} {user.last_name or ''}".strip()
    elif user.username:
        disp = user.username
    else:
        disp = user.email                     # last fallback

    return UserNameOut(id=user.id, display_name=disp)

@app.get("/me", response_model=UserRead)
def get_me(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = session.exec(select(User).where(User.username == payload["username"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/profile")
def get_profile(access_token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    payload = decode_token(access_token)
    username = payload.get("username")
    role = payload.get("role")
    email = payload.get("email")

    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    user = session.exec(select(User).where(User.username == payload["username"])).first()

    return {"user": {"username": username, "role": role, "email": email, "first_name": user.first_name, "last_name": user.last_name}}

@app.get("/all-users")
def admin_only(current_user: User = Depends(require_role("user"))):
    return {"message": f"Welcome Admin {current_user.username}!"}