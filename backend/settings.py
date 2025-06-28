from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3

app = FastAPI()

# Database setup
conn = sqlite3.connect("users.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        currency TEXT
    )
""")
conn.commit()

class UserProfile(BaseModel):
    name: str
    email: str
    password: str
    currency: str

@app.post("/profile")
def update_profile(profile: UserProfile):
    try:
        cursor.execute("""
            INSERT INTO users (name, email, password, currency)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
                name=excluded.name,
                password=excluded.password,
                currency=excluded.currency
        """, (profile.name, profile.email, profile.password, profile.currency))
        conn.commit()
        return {"status": "Profile updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/profile/{email}")
def get_profile(email: str):
    cursor.execute("SELECT name, email, password, currency FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    if row:
        return {"name": row[0], "email": row[1], "password": row[2], "currency": row[3]}
    raise HTTPException(status_code=404, detail="Profile not found")
