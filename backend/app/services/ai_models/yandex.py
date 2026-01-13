import json
from .base import BaseAIModel
from app.core.config import settings
from app.models.chat import ResponseType


class YandexModel(BaseAIModel):
    def __init__(self):
        api_url = settings.YANDEX_API_URL
        
        if not settings.YANDEX_API_KEY:
            raise ValueError(
                "YANDEX_API_KEY is required. Please set it in your .env file."
            )
        
        if not settings.YANDEX_FOLDER_ID:
            raise ValueError(
                "YANDEX_FOLDER_ID is required. Please set it in your .env file."
            )
        
        self.folder_id = settings.YANDEX_FOLDER_ID
        
        super().__init__(
            name="YandexGPT",
            api_url=api_url,
            api_key=settings.YANDEX_API_KEY,
        )
    
    def _get_headers(self) -> dict:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Api-Key {self.api_key.strip()}"
        else:
            print(f"WARNING: No API key provided for {self.name}")
        return headers

    async def _prepare_request_payload(self, prompt: str) -> dict:
        model_uri = f"gpt://{self.folder_id.strip()}/yandexgpt/latest"
        return {
            "modelUri": model_uri,
            "completionOptions": {
                "stream": False,
                "temperature": 0.3,
                "maxTokens": "2000"
            },
            "messages": [
                {
                    "role": "system",
                    "text": "You are YandexGPT AI assistant."
                },
                {
                    "role": "user",
                    "text": prompt
                }
            ]
        }

    async def _parse_response(self, response_data: dict) -> str:
        from .helpers import extract_json_from_markdown

        try:
            response_text = response_data["result"]["alternatives"][0]["message"]["text"]
        except (KeyError, IndexError) as e:
            response_text = str(response_data)
            print(f"Ошибка парсинга ответа YandexGPT: {e}, response_data: {response_data}")

        extracted_json = extract_json_from_markdown(response_text)

        if extracted_json:
            return json.dumps(extracted_json, ensure_ascii=False)

        return json.dumps(
            {
                "response_type": ResponseType.FINAL_ANSWER.value,
                "body": f"YandexGPT: {response_text}",
            },
            ensure_ascii=False,
        )

    def _get_specialization(self) -> str:
        return "Глубокий технический анализ, алгоритмы, архитектура"
