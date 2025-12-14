from typing import Optional
from app.services.chat_service import ChatService
from app.services.session_service import SessionService

_chat_service: Optional[ChatService] = None
_session_service: Optional[SessionService] = None


def get_session_service() -> SessionService:
    global _session_service
    if _session_service is None:
        _session_service = SessionService()
    return _session_service


def get_chat_service() -> ChatService:
    global _chat_service
    if _chat_service is None:
        _chat_service = ChatService()
        _chat_service.session_service = get_session_service()
    return _chat_service
