from datetime import datetime
import json
from typing import AsyncGenerator, Dict, Optional
from uuid import uuid4
from .ai_models import DeepSeekModel, YandexGPTModel, GigaChatModel
from .session_service import SessionService
from ..models.chat import (
    ChatResponse,
    ConversationEntry,
    ModelResponse,
    ResponseType,
    StreamEvent,
    StreamEventType,
)
from ..core.config import settings


class ChatService:
    def __init__(self):
        self.models = {
            "Yandex": YandexGPTModel(),
            "DeepSeek": DeepSeekModel(),
            "GigaChat": GigaChatModel(),
        }
        self.session_service = SessionService()

    async def process_message(
        self,
        message: str,
        session_id: Optional[str] = None,
        starting_model: str = "Yandex",
    ) -> ChatResponse:
        if not session_id:
            session_id = str(uuid4())

        session = await self.session_service.get_or_create_session(session_id)

        try:
            current_model = starting_model
            iterations = 0

            while iterations < settings.MAX_ITERATIONS:
                iterations += 1

                prompt = self._create_system_prompt(current_model, message, session_id)

                raw_response = await self.models[current_model].send_request(prompt)
                parsed_response = self._parse_model_response(raw_response)

                if not parsed_response:
                    raise Exception(f"Не удалось обработать ответ от {current_model}")

                conversation_entry = ConversationEntry(
                    model=current_model,
                    response=parsed_response.body,
                    response_type=parsed_response.response_type,
                    timestamp=datetime.now(),
                )

                await self.session_service.add_conversation_entry(
                    session_id, conversation_entry
                )

                if parsed_response.response_type == ResponseType.FINAL_ANSWER:
                    return ChatResponse(
                        response=parsed_response.body,
                        session_id=session_id,
                        status="completed",
                        conversation_history=session.conversation_history,
                    )

                elif parsed_response.respone_type == ResponseType.USER_QUESTION:
                    return ChatResponse(
                        response=f"Дополнительный вопрос от {current_model}: {parsed_response.body}",
                        session_id=session_id,
                        status="processing",
                        conversation_history=session.conversation_history,
                    )

                elif parsed_response.response_type == ResponseType.REQUEST_TO_MODEL:
                    if parsed_response.target_model in self.models:
                        current_model = parsed_response.target_model
                    else:
                        raise Exception(
                            f"Неизвестная модель: {parsed_response.target_model}"
                        )

            return ChatResponse(
                response="Достигнуто максимальное количество итераций без получения окончательного ответа",
                session_id=session_id,
                status="error",
                conversation_history=session.conversation_history,
            )

        except Exception as e:
            return ChatResponse(
                response=f"Ошибка обработки: {str(e)}",
                session_id=session_id,
                status="error",
                conversation_history=session.conversation_history if session else [],
            )

    async def process_message_stream(
        self, message: str, session_id: str, starting_model: str = "Yandex"
    ) -> AsyncGenerator[StreamEvent, None]:
        session = await self.session_service.get_or_create_session(session_id)

        yield StreamEvent(
            type=StreamEventType.START,
            model=starting_model,
            message=f"Начинаю обработку с модели {starting_model}",
        )

        current_model = starting_model
        iterations = 0

        try:
            while iterations < settings.MAX_ITERATIONS:
                iterations += 1

                yield StreamEvent(
                    type=StreamEventType.PROCESSING,
                    model=current_model,
                    iteration=iterations,
                )

                prompt = self._create_system_prompt(current_model, message, session_id)
                raw_response = await self.models[current_model].send_request(prompt)
                parsed_response = self._parse_model_response(raw_response)

                if not parsed_response:
                    yield StreamEvent(
                        type=StreamEventType.ERROR,
                        message=f"Ошибка обработки ответа от {current_model}",
                    )
                    return

                conversation_entry = ConversationEntry(
                    model=current_model,
                    response=parsed_response.body,
                    response_type=parsed_response.response_type,
                )

                await self.session_service.add_conversation_entry(
                    session_id, conversation_entry
                )

                yield StreamEvent(
                    type=StreamEventType.MODEL_RESPONSE,
                    model=current_model,
                    response=parsed_response.body,
                    response_type=parsed_response.response_type,
                )

                if parsed_response.response_type == ResponseType.FINAL_ANSWER:
                    session = await self.session_service.get_session(session_id)

                    yield StreamEvent(
                        type=StreamEventType.FINAL,
                        response=parsed_response.body,
                        history=session.conversation_history,
                    )
                    return

                elif parsed_response.response_type == ResponseType.USER_QUESTION:
                    yield StreamEvent(
                        type=StreamEventType.FINAL,
                        response=f"Дополнительный вопрос от {current_model}: {parsed_response.body}",
                    )
                    return

                elif parsed_response.response_type == ResponseType.REQUEST_TO_MODEL:
                    if parsed_response.target_model in self.models:
                        yield StreamEvent(
                            type=StreamEventType.REDIRECT,
                            from_model=current_model,
                            to_model=parsed_response.target_model,
                        )
                        current_model = parsed_response.target_model
                    else:
                        yield StreamEvent(
                            type=StreamEventType.ERROR,
                            message=f"Неизвестная модель: {parsed_response.target_model}",
                        )
                        return

            yield StreamEvent(
                type=StreamEventType.TIMEOUT,
                message="Превышено максимальное количество итераций",
            )

        except Exception as e:
            yield StreamEvent(
                type=StreamEventType.ERROR, message=f"Ошибка обработки: {str(e)}"
            )

    def _create_system_prompt(
        self, current_model: str, user_prompt: str, session_id: str
    ) -> str:
        other_models = [name for name in self.models.keys() if name != current_model]
        history = self._format_conversation_history(session_id)

        return self.models[current_model].create_system_prompt(
            user_prompt=user_prompt,
            other_models=other_models,
            conversation_history=history,
        )

    def _format_conversation_history(self, session_id: str) -> str:
        session = self.session_service.sessions.get(session_id)
        if not session or not session.conversation_history:
            return "Сообщений пока нет"

        history = session.conversation_history[-5:]
        return "\n".join([f"{entry.model}: {entry.response}" for entry in history])

    def _parse_model_response(self, response_text: str) -> Optional[ModelResponse]:
        try:
            data = json.loads(response_text)
            return ModelResponse(
                response_type=ResponseType(data.get("response_type")),
                body=data.get("body", ""),
                target_model=data.get("target_model"),
            )
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"Ошибка парсинга ответа: {e}")
            return None

    def get_model_info(self) -> Dict[str, Dict]:
        return {
            name: {
                "name": model.name,
                "status": model.status,
                "last_response_time": model.last_response_time,
                "specialization": model._get_specialization(),
            }
            for name, model in self.models.items()
        }
