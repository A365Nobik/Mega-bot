import json
from app.core.config import settings
from app.models.chat import ResponseType
from .base import BaseAIModel
from google import genai


class GeminiModel(BaseAIModel):
    def __init__(self):
        super().__init__(
            name="Gemini",
            api_url=settings.GEMINI_API_URL,
            api_key=settings.GEMINI_API_KEY,
        )
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
            self.model_name = "gemini-2.0-flash-exp"
        else:
            self.client = None
            self.model_name = None

    async def _prepare_request_payload(self, prompt: str) -> dict:
        return {
            "contents": [{"parts": [{"text": prompt}]}],
            "generation_config": {
                "temperature": 0.7,
                "top_k": 40,
                "top_p": 0.95,
                "max_output_tokens": 2048,
            },
        }

    async def send_request(self, prompt: str) -> str:
        import time

        start_time = time.time()

        try:
            if not self.client or not self.model_name:
                self._status = "error"
                return await self._get_fallback_response("API key not configured")

            response = self.client.models.generate_content(
                model=self.model_name, contents=prompt
            )

            if not response or not response.text:
                self._status = "error"
                return await self._get_fallback_response("Empty response from Gemini")

            self._last_response_time = time.time() - start_time
            self._status = "active"

            return await self._parse_response(response.text)

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
                "body": f"Gemini: {response_text}",
            },
            ensure_ascii=False,
        )

    def _get_specialization(self) -> str:
        return "Мультимодальный анализ, рассуждения, математика, код, общие знания"
