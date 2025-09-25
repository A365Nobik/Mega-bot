import asyncio
from datetime import datetime
from typing import List, Dict, Optional
from uuid import uuid4

from app.models.chat import ConversationEntry
from app.models.session import Session, SessionResponse
from app.core.config import settings


class SessionService:
    def __init__(self):
        self.sessions: Dict[str, Session] = {}
        self._cleanup_task = None

    async def start(self):
        if self._cleanup_task is None:
            self._cleanup_task = asyncio.create_task(self._cleanup_old_sessions())

    async def stop(self):
        if self._cleanup_task is None:
            self._cleanup_task.cancel()
        try:
            await self._cleanup_task
        except asyncio.CancelledError:
            pass
        self._cleanup_task = None

    async def _cleanup_old_sessions(self):
        while True:
            try:
                await asyncio.sleep(300)
                current_time = datetime.now()
                expired_sessions = []

                for session_id, session in self.sessions.items():
                    time_since_activity = current_time - session.last_activity
                    if time_since_activity.total_seconds() > settings.SESSION_TIMEOUT:
                        expired_sessions.append(session_id)

                for session_id in expired_sessions:
                    del self.sessions[session_id]
                    print(f"Удалена неактивная сессия: {session_id}")

            except Exception as e:
                print(f"Ошибка в cleanup task: {e}")
                await asyncio.sleep(60)

    async def create_session(self, session_id: Optional[str] = None) -> Session:
        if session_id is None:
            session_id = str(uuid4())

        if session_id in self.sessions:
            raise ValueError(f"Сессия {session_id} уже существует")

        session = Session(
            session_id=session_id,
            created_at=datetime.now(),
            last_activity=datetime.now(),
        )

        self.sessions[session_id] = session
        return session

    async def get_session(self, session_id: str) -> Optional[Session]:
        session = self.sessions.get(session_id)
        if session:
            session.last_activity = datetime.now()
        return session

    async def get_or_create_session(self, session_id: str) -> Session:
        session = await self.get_session(session_id)
        if session is None:
            session = await self.create_session(session_id)
        return session

    async def update_session_activity(self, session_id: str) -> bool:
        session = self.sessions.get(session_id)
        if session:
            session.last_activity = datetime.now()
            return True
        return False

    async def add_conversation_entry(
        self, session_id: str, entry: ConversationEntry
    ) -> bool:
        session = self.sessions.get(session_id)
        if session:
            session.conversation_history.append(entry)
            session.message_count += 1
            session.total_iterations += 1
            session.last_activity = datetime.now()

            if len(session.conversation_history) > settings.MAX_HISTORY_LENGTH:
                session.conversation_history = session.conversation_history[
                    -settings.MAX_HISTORY_LENGTH :
                ]

            return True
        return False

    async def get_session_history(self, session_id: str) -> List[ConversationEntry]:
        session = self.sessions.get(session_id)
        if session:
            await self.update_session_activity(session_id)
            return session.conversation_history
        return []

    async def clear_session_history(self, session_id: str) -> bool:
        if session_id in self.sessions:
            del self.sessions[session_id]
            return True
        return False

    async def get_all_sessions(
        self, skip: int = 0, limit: int = 100, active_only: bool = True
    ) -> List[SessionResponse]:
        sessions = list(self.sessions.values())

        if active_only:
            current_time = datetime.now()
            sessions = [
                s
                for s in sessions
                if (current_time - s.last_activity).total_seconds()
                < settings.SESSION_TIMEOUT
            ]

        sessions.sort(key=lambda x: x.last_activity, reverse=True)

        sessions = sessions[skip : skip + limit]

        return [
            SessionResponse(
                session_id=s.session_id,
                created_at=s.created_at,
                last_activity=s.last_activity,
                message_count=s.message_count,
                total_iterations=s.total_iterations,
                is_active=s.is_active,
                conversation_history=s.conversation_history,
            )
            for s in sessions
        ]

    async def get_session_stats(self) -> Dict:
        total_sessions = len(self.sessions)
        current_time = datetime.now()

        active_sessions = sum(
            1
            for session in self.sessions.values()
            if (current_time - session.last_activity).total_seconds()
            < settings.SESSION_TIMEOUT
        )

        total_messages = sum(
            session.message_count for session in self.sessions.values()
        )
        total_iterations = sum(
            session.total_iterations for session in self.sessions.values()
        )

        return {
            "total_sessions": total_sessions,
            "active_sessions": active_sessions,
            "inactive_sessions": total_sessions - active_sessions,
            "total_messages": total_messages,
            "total_iterations": total_iterations,
            "avg_messages_per_session": total_messages / max(total_sessions, 1),
            "avg_iterations_per_session": total_iterations / max(total_sessions, 1),
        }
