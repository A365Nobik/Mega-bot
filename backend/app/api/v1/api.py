from fastapi import APIRouter

from .endpoints import chat, sessions


api_router = APIRouter()

api_router.include_router(chat.router, prefix="/chat", tags=["chat"])

api_router.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
