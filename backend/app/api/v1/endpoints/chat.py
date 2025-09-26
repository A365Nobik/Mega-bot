import json
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from app.models.chat import ChatMessageRequest, ChatResponse
from app.core.dependencies import get_chat_service
from app.services.chat_service import ChatService

router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def chat_endpoint(
    message_request: ChatMessageRequest,
    chat_service: ChatService = Depends(get_chat_service),
):
    try:
        result = await chat_service.process_message(
            message=message_request.message,
            session_id=message_request.session_id,
            starting_model=message_request.starting_model or "Yandex",
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка обработки сообщения: {str(e)}",
        )


@router.get("/stream/{session_id}")
async def chat_stream_endpoint(
    session_id: str,
    prompt: str,
    starting_model: str = "Yandex",
    chat_service: ChatService = Depends(get_chat_service),
):
    valid_models = ["Yandex", "DeepSeek", "GigaChat"]
    if starting_model not in valid_models:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Неправильное название модели. Должна быть одной из: {', '.join(valid_models)}",
        )

    async def generate_stream():
        try:
            async for event in chat_service.process_message_stream(
                message=prompt, session_id=session_id, starting_model=starting_model
            ):
                event_data = event.model_dump()
                yield f"data: {json.dumps(event_data, default=str, ensure_ascii=False)}\n\n"
        except Exception as e:
            error_event = {"type": "error", "message": f"Ошибка стриминга: {str(e)}"}
            yield f"data: {json.dumps(error_event, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream",
        },
    )


@router.get("/models")
async def get_available_models(chat_service: ChatService = Depends(get_chat_service)):
    models_info = chat_service.get_model_info()
    return {
        "models": models_info,
        "total": len(models_info),
        "available": [
            name for name, info in models_info.items() if info["status"] == "active"
        ],
    }
