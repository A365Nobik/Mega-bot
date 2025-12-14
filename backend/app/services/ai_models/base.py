from abc import ABC, abstractmethod
import json
import time
from typing import Optional
import aiohttp

from app.models.chat import ResponseType


class BaseAIModel(ABC):
    def __init__(self, name: str, api_url: str, api_key: Optional[str] = None):
        self.name = name
        self.api_url = api_url
        self.api_key = api_key
        self._last_response_time = None
        self._status = "active"

    @property
    def status(self) -> str:
        return self._status

    @property
    def last_response_time(self) -> Optional[float]:
        return self._last_response_time

    @abstractmethod
    async def _prepare_request_payload(self, prompt: str) -> dict:
        pass

    @abstractmethod
    async def _parse_response(self, response_data: dict) -> str:
        pass

    async def send_request(self, prompt: str) -> str:
        start_time = time.time()

        try:
            payload = await self._prepare_request_payload(prompt)
            headers = self._get_headers()

            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.api_url,
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=30),
                ) as response:
                    if response.status != 200:
                        self._status = "error"
                        raise Exception(
                            f"API request failed with status {response.status}"
                        )

                    response_data = await response.json()
                    parsed_response = await self._parse_response(response_data)

                    self._last_response_time = time.time() - start_time
                    self._status = "active"

                    return parsed_response

        except Exception as e:
            self._status = "error"
            self._last_response_time = time.time() - start_time
            return await self._get_fallback_response(str(e))

    def _get_headers(self) -> dict:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    async def _get_fallback_response(self, error_msg: str) -> str:
        return json.dumps(
            {
                "response_type": ResponseType.FINAL_ANSWER,
                "body": f"Извините, {self.name} временно недоступен. Ошибка: {error_msg}",
            },
            ensure_ascii=False,
        )

    def create_system_prompt(
        self, user_prompt: str, other_models: list, conversation_history: str
    ) -> str:
        return f"""
Ты модель {self.name}. Кроме тебя в системе работают модели: {", ".join(other_models)}.


Вопрос: {user_prompt}

Уже обсудили:
{conversation_history if conversation_history != "Сообщений пока нет" else "Пока никто не ответил"}

Правила обсуждения:
1. Для любого сложного вопроса - всегда советуйся и спрашивай мнение у других моделей
2. Отдавай final_answer только в том случае если:
    - Вопрос слишком простой ("Привет", "Как дела?")
    - Или вопрос был уже обсужден с другими моделями
3. Прочитай ответы моделей до тебя
4. Нельзя называть себя в target_model
5. Дай свое видение вопроса
6. В том случае, если 2 модели уже дали результат - дай final_answer с учетом всех рассуждений

Твой ответ должен быть строго в таком формате JSON:
```json
{{
    "response_type": "request_to_model" | "final_answer",
    "body": "Твой ответ",
    "target_model": "Имя модели от которой нужна дополнительная консультация"
}}
```

Твоя роль: {self._get_specialization()}

ВАЖНО: Если вопрос сложный, а также в истории отсутствует мнение других моделей - используй request_to_model!
"""

    @abstractmethod
    def _get_specialization(self) -> str:
        pass
