from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

from app.models.chat import ConversationEntry


class Session(BaseModel):
    session_id: str
    created_at: datetime = Field(default_factory=datetime.now)
    last_activity: datetime = Field(default_factory=datetime.now)
    conversation_history: List[ConversationEntry] = Field(default_factory=list)
    message_count: int = 0
    total_iterations: int = 0
    is_active: bool = True

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}


class SessionCreate(BaseModel):
    session_id: Optional[str] = None


class SessionUpdate(BaseModel):
    last_activity: Optional[datetime] = None
    is_active: Optional[bool] = None


class SessionResponse(BaseModel):
    session_id: str
    created_at: datetime
    last_activity: datetime
    message_count: int
    total_iterations: int
    is_active: bool
    conversation_history: List[ConversationEntry] = []


class SessionListResponse(BaseModel):
    sessions: List[SessionResponse]
    total: int
    active_count: int
