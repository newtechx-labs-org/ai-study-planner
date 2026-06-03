from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routes.auth import router as auth_router
from routes.users import router as users_router
from routes.subjects import router as subjects_router
from routes.availability import router as availability_router
from routes.plans import router as plans_router
from routes.progress import router as progress_router
from routes.reminders import router as reminders_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(subjects_router)
app.include_router(availability_router)
app.include_router(plans_router)
app.include_router(progress_router)
app.include_router(reminders_router)