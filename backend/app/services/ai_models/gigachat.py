import json
import time
from .base import BaseAIModel
from app.core.config import settings
from app.models.chat import ResponseType


class GigaChatModel(BaseAIModel):
    def __init__(self):
        super().__init__(
            name="GigaChat",
            api_url=settings.GIGACHAT_API_URL,
            api_key=settings.GIGACHAT_API_KEY,
        )
        self.client = None
        self._gigachat_module = None
        self._Chat = None
        self._Messages = None
        self._MessagesRole = None
        
    def _lazy_import_gigachat(self):
        """Отложенный импорт для избежания конфликтов с Pydantic v2"""
        if self._gigachat_module is None:
            try:
                from gigachat import GigaChat
                from gigachat.models import Chat, Messages, MessagesRole
                self._gigachat_module = GigaChat
                self._Chat = Chat
                self._Messages = Messages
                self._MessagesRole = MessagesRole
            except ImportError as e:
                raise ImportError(f"Failed to import gigachat: {e}")
        
        if self.api_key and self.client is None:
            self.client = self._gigachat_module(
                credentials=self.api_key,
                verify_ssl_certs=False,
                scope="GIGACHAT_API_PERS",
            )

    async def _prepare_request_payload(self, prompt: str) -> dict:
        return {
            "model": "GigaChat",
            "messages": [
                {"role": "system", "content": "Ты GigaChat - AI ассистент."},
                {"role": "user", "content": prompt},
            ],
            "stream": False,
            "temperature": 0.7,
            "max_tokens": 2000,
        }

    async def send_request(self, prompt: str) -> str:
        start_time = time.time()

        system_instr = (
            "Ты — участник консилиума ИИ. Твой ответ ОБЯЗАТЕЛЬНО должен быть "
        "валидным JSON объектом. Не пиши лишнего текста до или после JSON."
    )

        try:
            if not self.api_key:
                self._status = "error"
                return await self._get_fallback_response("API key not configured")
            
            self._lazy_import_gigachat()
            
            if not self.client:
                self._status = "error"
                return await self._get_fallback_response("Failed to initialize GigaChat client")

            payload = self._Chat(
                messages=[
                    self._Messages(
                        role=self._MessagesRole.SYSTEM,
                        content=system_instr,
                    ),
                    self._Messages(role=self._MessagesRole.USER, content=prompt),
                ],
                temperature=0.2,
                max_tokens=2000,
            )

            response = self.client.chat(payload)

            if not response or not response.choices:
                self._status = "error"
                return await self._get_fallback_response("Empty response from GigaChat")

            response_text = response.choices[0].message.content

            self._last_response_time = time.time() - start_time
            self._status = "active"

            return await self._parse_response(response_text)

        except Exception as e:
            self._status = "error"
            self._last_response_time = time.time() - start_time
            return await self._get_fallback_response(str(e))

    async def _parse_response(self, response_text: str) -> str:
        from .helpers import extract_json_from_markdown

        extracted_json = extract_json_from_markdown(response_text)

        if extracted_json:
            return json.dumps(extracted_json, ensure_ascii=False)

        return json.dumps(
            {
                "response_type": ResponseType.FINAL_ANSWER.value,
                "body": f"GigaChat: {response_text}",
            },
            ensure_ascii=False,
        )

    def _get_specialization(self) -> str:
        return "Креативные задачи, генерация контента, синтез решений"