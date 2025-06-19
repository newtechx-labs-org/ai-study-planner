### Follow this instructions to run the application

# 1. Run Backend

#### After downloading/cloning this branch:

`cd main`

`cd backend`

# initialize venv

`python -m venv venv`

# activate venv

`source venv/bin/activate` or `venv\Scripts\activate`

`pip install -r requirements.txt`

#### DB setup

- install postgres and create database with username and password

- update `DATABASE_URL` in `/backend/.env` file

Example: `DATABASE_URL=postgresql://root:root@localhost/appdb`

### Finally run the project

`uvicorn main:app --reload`

### Check if it is working

This should load swagger api's
`http://localhost:8000/docs`

# 2. Run Frontend

- change dir to frontend

`cd frontend`

`npm install`

`npm run dev` or for windows `npx next dev`

### Check if it is working

This should load signin page
`http://localhost:3000`
