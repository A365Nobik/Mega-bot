import random
from app.core.config import settings
from app.models.chat import ResponseType
from .base import BaseAIModel
import json


class DeepSeekModel(BaseAIModel):
    def __init__(self):
        super().__init__(
            name="DeepSeek",
            api_url=settings.DEEPSEEK_API_URL,
            api_key=settings.DEEPSEEK_API_KEY,
        )

    async def _prepare_request_payload(self, prompt: str) -> dict:
        return {
            "model": "deepseek-chat",
            "messages": [
                {
                    "role": "system",
                    "content": "You are DeepSeek, a helpful AI assistant specialized in deep technical analysis",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            "stream": False,
            "temperature": 0.3,
        }

    async def _parse_response(self, response_data: dict) -> str:
        responses = [
            {
                "response_type": ResponseType.FINAL_ANSWER.value,
                "body": "DeepSeek: Провел технический анализ. Предоставляю готовое детальное решение с пошаговым разбором и рекомендациями",
            },
            {
                "response_type": ResponseType.REQUEST_TO_MODEL.value,
                "body": "Требуется получить дополнительный анализ от GigaChat для финального решения",
                "target_model": "GigaChat",
            },
        ]
        return json.dumps(random.choice(responses), ensure_ascii=False)

    def _get_specialization(self) -> str:
        return "Глубокий технический анализ, алгоритмы, системная архитектура"
