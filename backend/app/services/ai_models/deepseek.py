import json
from .base import BaseAIModel
from app.core.config import settings
from app.models.chat import ResponseType


class DeepSeekModel(BaseAIModel):
    def __init__(self):
        api_url = settings.DEEPSEEK_API_URL
        use_openrouter = "openrouter.ai" in api_url
        
        if use_openrouter and not api_url.endswith("/chat/completions"):
            if not api_url.endswith("/"):
                api_url += "/"
            api_url += "chat/completions"
        
        self.use_openrouter = use_openrouter
        
        if not settings.DEEPSEEK_API_KEY:
            raise ValueError(
                "DEEPSEEK_API_KEY is required. Please set it in your .env file."
            )
        
        super().__init__(
            name="DeepSeek",
            api_url=api_url,
            api_key=settings.DEEPSEEK_API_KEY,
        )
    
    def _get_headers(self) -> dict:
        headers = super()._get_headers()
        if self.use_openrouter:
            if not self.api_key:
                raise ValueError("API key is required for OpenRouter")
            headers["HTTP-Referer"] = "https://github.com"
            headers["X-Title"] = "MegaBot"
        return headers

    async def _prepare_request_payload(self, prompt: str) -> dict:
        if self.use_openrouter:
            model_name = "deepseek/deepseek-chat"
        else:
            model_name = "deepseek-chat"
        return {
            "model": model_name,
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
