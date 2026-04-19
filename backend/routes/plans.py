"""Study plan generation and retrieval routes."""

from fastapi import APIRouter, Depends
from sqlmodel import Session

from core.dependencies import get_current_user
from database import get_session
from models.user import User
from schemas.plan import (
    AdjustPlanRequest,
    GeneratePlanRequest,
    GeneratePlanResponse,
    PlanWithSessions,
    SessionItem,
    StudyPlanRead,
)
from services.plan_service import (
    adjust_plan_for_missed_sessions,
    delete_all_plans,
    delete_plan,
    generate_plan,
    get_plan_with_sessions,
    list_plans,
)

router = APIRouter(tags=["plans"])


@router.post("/generate-plan", response_model=GeneratePlanResponse)
def generate_plan_route(
    payload: GeneratePlanRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    plan, sessions_payload, ai_used = generate_plan(
        session=session,
        user_id=current_user.id,
        target_end_date=payload.target_end_date,
        subject_ids=payload.subject_ids,
    )
    sessions = [SessionItem(**row) for row in sessions_payload]
    return GeneratePlanResponse(
        plan_id=plan.id,
        version=plan.version,
        ai_used=ai_used,
        sessions=sessions,
    )


@router.get("/plans", response_model=list[StudyPlanRead])
def list_plans_route(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return list_plans(session, current_user.id)


@router.get("/plans/{plan_id}", response_model=PlanWithSessions)
def get_plan_route(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    plan, sessions, subject_map = get_plan_with_sessions(session, current_user.id, plan_id)
    payload = [
        SessionItem(
            id=item.id,
            date=item.date,
            subject_id=item.subject_id,
            subject_name=subject_map[item.subject_id].name,
            planned_hours=item.planned_hours,
            completed=item.completed,
            completed_hours=item.completed_hours,
        )
        for item in sessions
        if item.subject_id in subject_map
    ]
    return PlanWithSessions(plan=StudyPlanRead.model_validate(plan), sessions=payload)


@router.post("/plans/{plan_id}/adjust", response_model=GeneratePlanResponse)
def adjust_plan_route(
    plan_id: int,
    _: AdjustPlanRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    plan, sessions_payload, ai_used = adjust_plan_for_missed_sessions(
        session=session,
        user_id=current_user.id,
        plan_id=plan_id,
    )
    sessions = [SessionItem(**row) for row in sessions_payload]
    return GeneratePlanResponse(
        plan_id=plan.id,
        version=plan.version,
        ai_used=ai_used,
        sessions=sessions,
    )


@router.delete("/plans/{plan_id}")
def delete_plan_route(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    deleted_sessions = delete_plan(session, current_user.id, plan_id)
    return {
        "message": "Plan deleted",
        "deleted_sessions": deleted_sessions,
    }


@router.delete("/plans")
def delete_all_plans_route(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    deleted_plans, deleted_sessions = delete_all_plans(session, current_user.id)
    return {
        "message": "Plans deleted",
        "deleted_plans": deleted_plans,
        "deleted_sessions": deleted_sessions,
    }
