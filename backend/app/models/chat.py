from datetime import datetime
from enum import Enum
from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class ResponseType(str, Enum):
    REQUEST_TO_MODEL = "request_to_model"
    USER_QUESTION = "user_question"
    FINAL_ANSWER = "final_answer"


class StreamEventType(str, Enum):
    START = "start"
    PROCESSING = "processing"
    MODEL_RESPONSE = "model_response"
    REDIRECT = "redirect"
    FINAL = "final"
    ERROR = "error"
    TIMEOUT = "timeout"


class ChatMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None
    starting_model: Optional[str] = "Gemini"


class ModelResponse(BaseModel):
    response_type: ResponseType
    body: str
    target_model: Optional[str] = None


class ConversationEntry(BaseModel):
    model: str
    response: str
    response_type: ResponseType
    timestamp: datetime = Field(default_factory=datetime.now)


class ChatResponse(BaseModel):
    response: str
    session_id: str
    status: Literal["completed", "processing", "error"]
    conversation_history: List[ConversationEntry] = []
    processing_time: Optional[float] = None


class StreamEvent(BaseModel):
    type: StreamEventType
    message: Optional[str] = None
    model: Optional[str] = None
    response: Optional[str] = None
    response_type: Optional[ResponseType] = None
    iteration: Optional[int] = None
    from_model: Optional[str] = None
    to_model: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)
    history: Optional[List[ConversationEntry]] = None


class SessionInfo(BaseModel):
    session_id: str
    created_at: datetime
    last_activity: datetime
    message_count: int
    total_iterations: int


class ModelInfo(BaseModel):
    name: str
    display_name: str
    description: Optional[str]
    status: Literal["active", "inactive", "error"]
    last_response_time: Optional[float] = None
