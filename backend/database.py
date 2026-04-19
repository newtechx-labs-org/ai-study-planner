from sqlmodel import SQLModel, create_engine, Session

from core.config import DATABASE_URL

# Import model registry so SQLModel metadata includes all tables.
from models import Availability, StudyPlan, StudySession, Subject, User  # noqa: F401

engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session

def init_db():
    SQLModel.metadata.create_all(engine)