"""AI planning service backed by Cohere with deterministic fallback."""

from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from typing import Any

from core.config import COHERE_API_KEY, COHERE_MODEL

try:
    import cohere
except ImportError:  # pragma: no cover
    cohere = None


def _to_naive_utc(value: datetime) -> datetime:
    """Convert both aware and naive datetimes to naive UTC for scheduler math."""
    if value.tzinfo is None:
        return value
    return value.astimezone(timezone.utc).replace(tzinfo=None)


def _daily_hours_from_slots(slots: list[dict[str, str]]) -> dict[int, float]:
    day_index = {"Mon": 0, "Tue": 1, "Wed": 2, "Thu": 3, "Fri": 4, "Sat": 5, "Sun": 6}
    by_day: dict[int, float] = {}

    for slot in slots:
        start = datetime.strptime(slot["start"], "%H:%M")
        end = datetime.strptime(slot["end"], "%H:%M")
        hours = max((end - start).seconds / 3600, 0)
        idx = day_index[slot["day"]]
        by_day[idx] = by_day.get(idx, 0) + hours

    return by_day


def generate_fallback_schedule(
    subjects: list[dict[str, Any]],
    availability: dict[str, Any],
    target_end_date: datetime,
    start_date: datetime | None = None,
) -> list[dict[str, Any]]:
    """Round-robin scheduler used whenever AI path is unavailable."""
    normalized_end_date = _to_naive_utc(target_end_date)
    normalized_start_date = _to_naive_utc(start_date) if start_date else datetime.utcnow()

    current_date = normalized_start_date.replace(hour=8, minute=0, second=0, microsecond=0)
    end_date = normalized_end_date.replace(hour=23, minute=59, second=59, microsecond=0)
    remaining = {
        s["id"]: {
            "subject_id": s["id"],
            "subject_name": s["name"],
            "difficulty": s["difficulty"],
            "hours": float(s["total_hours"]),
        }
        for s in subjects
    }

    schedule: list[dict[str, Any]] = []
    subject_ids = list(remaining.keys())
    if not subject_ids:
        return schedule

    if availability["type"] == "weekly":
        weekly_hours = float(availability["data"]["weekly_hours"])
        per_day = {i: weekly_hours / 7 for i in range(7)}
    else:
        per_day = _daily_hours_from_slots(availability["data"]["slots"])

    cursor = 0
    while current_date <= end_date and any(s["hours"] > 0 for s in remaining.values()):
        available_today = per_day.get(current_date.weekday(), 0)
        if available_today <= 0:
            current_date += timedelta(days=1)
            continue

        guard = 0
        while available_today > 0 and guard < len(subject_ids) * 2:
            sid = subject_ids[cursor % len(subject_ids)]
            cursor += 1
            guard += 1
            item = remaining[sid]
            if item["hours"] <= 0:
                continue
            allocation = min(available_today, item["hours"], 2.0)
            if allocation <= 0:
                continue
            schedule.append(
                {
                    "date": current_date.isoformat(),
                    "subject_id": item["subject_id"],
                    "subject_name": item["subject_name"],
                    "planned_hours": round(allocation, 2),
                }
            )
            item["hours"] -= allocation
            available_today -= allocation

        current_date += timedelta(days=1)

    return schedule


def _parse_cohere_json(text: str) -> list[dict[str, Any]]:
    try:
        payload = json.loads(text)
    except json.JSONDecodeError:
        start = text.find("[")
        end = text.rfind("]")
        if start == -1 or end == -1:
            raise ValueError("Cohere output is not valid JSON")
        payload = json.loads(text[start : end + 1])

    if not isinstance(payload, list):
        raise ValueError("Cohere output must be a JSON array")
    for row in payload:
        if not isinstance(row, dict):
            raise ValueError("Each schedule item must be an object")
        if "date" not in row or "subject_name" not in row or "planned_hours" not in row:
            raise ValueError("Schedule item missing required keys")
    return payload


def generate_ai_schedule(
    subjects: list[dict[str, Any]], availability: dict[str, Any], target_end_date: datetime
) -> list[dict[str, Any]]:
    """Generate study schedule using Cohere and strict JSON contract."""
    if not COHERE_API_KEY or cohere is None:
        raise RuntimeError("Cohere is unavailable")

    prompt = (
        "Generate a realistic study schedule in strict JSON array format. "
        "Each item must have date (ISO datetime), subject_name, and planned_hours. "
        "Distribute workload by difficulty and availability. "
        f"Target end date: {target_end_date.isoformat()}. "
        f"Subjects: {json.dumps(subjects)}. "
        f"Availability: {json.dumps(availability)}."
    )

    client = cohere.ClientV2(api_key=COHERE_API_KEY)
    response = client.chat(
        model=COHERE_MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0.2,
    )

    content = response.message.content
    if not content:
        raise RuntimeError("Empty Cohere response")

    text = ""
    for part in content:
        text += getattr(part, "text", "")

    return _parse_cohere_json(text)
