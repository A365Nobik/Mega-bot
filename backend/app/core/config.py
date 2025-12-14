from pydantic_settings import BaseSettings
from typing import ClassVar, List, Optional
from pydantic import field_validator, ConfigDict
import json


class Settings(BaseSettings):
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    PROJECT_NAME: str = "MegaBot Chat API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    HOST: str = "0.0.0.0"
    PORT: int = 8080
    DEBUG: bool = True

    CORS_ORIGINS: Optional[List[str]] = None

    DEEPSEEK_API_KEY: Optional[str] = None
    DEEPSEEK_API_URL: str = "https://api.deepseek.com/v1/chat/completions"

    GIGACHAT_API_KEY: Optional[str] = None
    GIGACHAT_API_URL: str = (
        "https://gigachat.devices.sberbank.ru/api/v1/chat/completions"
    )

    GEMINI_API_KEY: Optional[str] = None
    GEMINI_API_URL: ClassVar[str] = (
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    )

    MAX_ITERATIONS: int = 10
    SESSION_TIMEOUT: int = 3600
    MAX_HISTORY_LENGTH: int = 50

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def _assemble_cors_origins(cls, v):
        if v is None:
            return []
        if isinstance(v, str):
            vs = v.strip()
            if vs.startswith("["):
                try:
                    parsed = json.loads(vs)
                    if isinstance(parsed, list):
                        return [str(x).strip() for x in parsed if str(x).strip()]
                except Exception:
                    pass
            return [part.strip() for part in vs.split(",") if part.strip()]

        if isinstance(v, (list, tuple)):
            return [str(x).strip() for x in v if str(x).strip()]

        raise ValueError(
            "CORS_ORIGINS must be a list, tuple, JSON string or comma-separated string"
        )


settings = Settings()
