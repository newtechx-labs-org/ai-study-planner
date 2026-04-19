# AI Study Planner Backend

## Folder Structure

```txt
backend/
  core/
    __init__.py
    config.py
    dependencies.py
    security.py
    token_blacklist.py
  models/
    __init__.py
    user.py
    subject.py
    availability.py
    study_plan.py
    study_session.py
  schemas/
    __init__.py
    user.py
    subject.py
    availability.py
    plan.py
    progress.py
  services/
    __init__.py
    subject_service.py
    availability_service.py
    ai_service.py
    plan_service.py
    progress_service.py
  routes/
    __init__.py
    auth.py
    users.py
    subjects.py
    availability.py
    plans.py
    progress.py
  main.py
  database.py
  requirements.txt
```

## API Examples

### 1) Create Subject

`POST /subjects`

Request:

```json
{
  "name": "Math",
  "difficulty": "hard",
  "total_hours": 40
}
```

Response:

```json
{
  "id": 1,
  "name": "Math",
  "difficulty": "hard",
  "total_hours": 40,
  "created_at": "2026-04-19T09:15:21.000000",
  "updated_at": "2026-04-19T09:15:21.000000"
}
```

### 2) Set Availability (Daily)

`POST /availability`

Request:

```json
{
  "type": "daily",
  "data": {
    "slots": [
      { "day": "Mon", "start": "18:00", "end": "21:00" },
      { "day": "Tue", "start": "18:00", "end": "20:00" }
    ]
  }
}
```

Response:

```json
{
  "id": 1,
  "type": "daily",
  "data": {
    "slots": [
      { "day": "Mon", "start": "18:00", "end": "21:00" },
      { "day": "Tue", "start": "18:00", "end": "20:00" }
    ]
  },
  "created_at": "2026-04-19T09:20:21.000000",
  "updated_at": "2026-04-19T09:20:21.000000"
}
```

### 3) Generate Plan

`POST /generate-plan`

Request:

```json
{
  "target_end_date": "2026-06-30T23:59:59"
}
```

Response:

```json
{
  "plan_id": 9,
  "version": 3,
  "ai_used": true,
  "sessions": [
    {
      "date": "2026-04-20T18:00:00",
      "subject_id": 1,
      "subject_name": "Math",
      "planned_hours": 2
    },
    {
      "date": "2026-04-21T18:00:00",
      "subject_id": 2,
      "subject_name": "Physics",
      "planned_hours": 2
    }
  ]
}
```

### 4) List Plans

`GET /plans`

Response:

```json
[
  {
    "id": 9,
    "user_id": 1,
    "version": 3,
    "parent_plan_id": 7,
    "target_end_date": "2026-06-30T23:59:59",
    "created_at": "2026-04-19T09:25:00"
  }
]
```

### 5) Mark Complete (Partial)

`POST /mark-complete`

Request:

```json
{
  "session_id": 101,
  "completed_hours": 1.5
}
```

Response:

```json
{
  "message": "Session updated",
  "session_id": 101,
  "completed": false,
  "completed_hours": 1.5
}
```

### 6) Get Progress

`GET /progress?plan_id=9`

Response:

```json
{
  "plan_id": 9,
  "completed_hours": 18.5,
  "remaining_hours": 31.5,
  "completion_percentage": 37.0
}
```

### 7) Adjust Plan for Missed Sessions

`POST /plans/9/adjust`

Request:

```json
{
  "reason": "missed_sessions"
}
```

Response:

```json
{
  "plan_id": 10,
  "version": 4,
  "ai_used": false,
  "sessions": [
    {
      "date": "2026-04-22T18:00:00",
      "subject_id": 1,
      "subject_name": "Math",
      "planned_hours": 2
    }
  ]
}
```
