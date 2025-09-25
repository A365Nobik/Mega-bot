import datetime
import hashlib
import json
from typing import Any
import uuid


def generate_session_id() -> str:
    return str(uuid.uuid4())


def hash_message(message: str) -> str:
    return hashlib.md5(message.encode("utf-8")).hexdigest()


def format_timestamp(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d %H:%M:%S")


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
