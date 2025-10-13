import random
from app.models.chat import ResponseType
from .base import BaseAIModel
from app.core.config import settings
import json


class YandexGPTModel(BaseAIModel):
    def __init__(self):
        super().__init__(
            name="YandexGPT",
            api_url=settings.YANDEX_API_URL,
            api_key=settings.YANDEX_API_KEY,
        )

    async def _prepare_request_payload(self, prompt: str) -> dict:
        return {
            "modelUri": f"gpt://{settings.YANDEX_FOLDER_ID}/yandexgpt-lite",
            "completionOptions": {
                "stream": False,
                "temperature": 0.8,
                "maxTokens": "2000",
            },
            "messages": [
                {"role": "system", "text": "Ты AI ассистент YandexGPT"},
                {"role": "user", "text": prompt},
            ],
        }

    async def _parse_response(self, response_data: dict) -> str:
        responses = [
            {
                "response_type": ResponseType.FINAL_ANSWER.value,
                "body": "YandexGPT: Проанализировал ваш запрос с учетом особенностей и контекста. Готов предоставить финальный вариант с учетом ваших предпочтений",
            },
            {
                "response_type": ResponseType.REQUEST_TO_MODEL.value,
                "body": "Направляю ответ к DeepSeek для более глубокого анализа",
                "target_model": "DeepSeek",
            },
            {
                "response_type": ResponseType.REQUEST_TO_MODEL.value,
                "body": "Направляю новые данные к GigaChat для финализации ответа",
                "target_model": "GigaChat",
            },
        ]
        return json.dumps(random.choice(responses), ensure_ascii=False)

    def _get_specialization(self) -> str:
        return "Общие вопросы, анализ текста, перевод, математика, анализ данных"

    def _get_headers(self) -> dict:
        """Переопределяем метод для спецефичных заголовков YandexGPT"""

        return {
            "Content-Type": "application/json",
            "Authorization": f"Api-key {self.api_key}",
            "x-folder-id": settings.YANDEX_FOLDER_ID,
        }
