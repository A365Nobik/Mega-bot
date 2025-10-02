import json
from ...core.config import settings
from ...models.chat import ResponseType
from .base import BaseAIModel


class GigaChatModel(BaseAIModel):
    def __init__(self):
        super().__init__(
            name="GigaChat",
            api_url=settings.GIGACHAT_API_URL,
            api_key=settings.GIGACHAT_API_KEY,
        )

    async def _prepare_request_payload(self, prompt: str) -> dict:
        return {
            "model": "GigaChat",
            "messages": [
                {
                    "role": "system",
                    "content": "Ты GigaChat - AI ассистент, специализирующийся на творческих задачах",
                },
                {"role": "user", "content": prompt},
            ],
            "stream": False,
            "temperature": 0.8,
        }

    async def _parse_response(self, response_data: dict) -> str:
        return json.dumps(
            {
                "response_type": ResponseType.FINAL_ANSWER,
                "body": "GigaChat: Сгенерировал итоговое решение на основе коллективного обсуждения. Вот креативный и практичный ответ с учетом мнения всех предыдущих ассистентов",
            },
            ensure_ascii=False,
        )

    def _get_specialization(self) -> str:
        return "Креативные задачи, генерация контента, синтез решений"
