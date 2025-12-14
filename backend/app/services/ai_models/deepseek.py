import json
from .base import BaseAIModel
from app.core.config import settings
from app.models.chat import ResponseType


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
                {"role": "system", "content": "You are DeepSeek AI assistant."},
                {"role": "user", "content": prompt},
            ],
            "stream": False,
            "temperature": 0.3,
            "max_tokens": 2000,
        }

    async def _parse_response(self, response_data: dict) -> str:
        from .helpers import extract_json_from_markdown

        try:
            response_text = response_data["choices"][0]["message"]["content"]
        except (KeyError, IndexError):
            response_text = str(response_data)

        extracted_json = extract_json_from_markdown(response_text)

        if extracted_json:
            return json.dumps(extracted_json, ensure_ascii=False)

        return json.dumps(
            {
                "response_type": ResponseType.FINAL_ANSWER.value,
                "body": f"DeepSeek: {response_text}",
            },
            ensure_ascii=False,
        )

    def _get_specialization(self) -> str:
        return "Глубокий технический анализ, алгоритмы, архитектура"
