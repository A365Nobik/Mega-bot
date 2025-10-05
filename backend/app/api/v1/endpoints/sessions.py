from fastapi import APIRouter, Depends, HTTPException, Query, status
from ....core.dependencies import get_session_service
from ....models.session import SessionListResponse, SessionResponse
from ....services.session_service import SessionService

router = APIRouter()


@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(
    session_id: str, session_service: SessionService = Depends(get_session_service)
):
    if not session_id or len(session_id) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный session_id"
        )

    session = await session_service.get_session(session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Сессия не найдена"
        )

    return SessionResponse(
        session_id=session.session_id,
        created_at=session.created_at,
        last_activity=session.last_activity,
        message_count=session.message_count,
        total_iterations=session.total_iterations,
        is_active=session.is_active,
        conversation_history=session.conversation_history,
    )


@router.get("/{session_id}/history")
async def get_session_history(
    session_id: str, session_service: SessionService = Depends(get_session_service)
):
    if not session_id or len(session_id) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный session_id"
        )

    history = await session_service.get_session_history(session_id)
    return {"session_id": session_id, "history": history, "count": len(history)}


@router.delete("/{session_id}/history")
async def clear_session_history(
    session_id: str, session_service: SessionService = Depends(get_session_service)
):
    if not session_id or len(session_id) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный session_id"
        )

    success = await session_service.clear_session_history(session_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Сессия не найдена"
        )

    return {"message": f"История сессии {session_id} очищена"}


@router.get("/", response_model=SessionListResponse)
async def get_sessions(
    skip: int = Query(0, ge=0, description="Количество сессий для пропуска"),
    limit: int = Query(
        100, ge=1, le=1000, description="Максимальное количество сессий"
    ),
    active_only: bool = Query(True, description="Только активные сессии"),
    session_service: SessionService = Depends(get_session_service),
):
    sessions = await session_service.get_all_sessions(
        skip=skip, limit=limit, active_only=active_only
    )

    active_count = len([s for s in sessions if s.is_active])

    return SessionListResponse(
        sessions=sessions, total=len(sessions), active_count=active_count
    )


@router.get("/stats/summary")
async def get_session_stats(
    session_service: SessionService = Depends(get_session_service),
):
    stats = await session_service.get_session_stats()
    return {"stats": stats}
