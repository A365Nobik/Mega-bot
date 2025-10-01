import json
from typing import Any
import uuid


def generate_session_id() -> str:
    return str(uuid.uuid4())


def safe_json_loads(json_str: str, default: Any = None) -> Any:
    try:
        return json.loads(json_str)
    except (json.JSONDecodeError, TypeError):
        return default


def truncate_text(text: str, max_length: int = 100) -> str:
    if len(text) <= max_length:
        return text
    return text[: max_length - 3] + "..."


def sanitize_model_name(model_name: str) -> str:
    return model_name.strip().capitalize()
