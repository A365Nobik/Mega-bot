from typing import Optional

from fastapi import HTTPException, Header, status


async def get_user_agent(user_agent: Optional[str] = Header[None]) -> str:
    return user_agent or "Unknown"


async def validate_content_type(content_type: Optional[str] = Header[None]) -> str:
    if content_type and not content_type.startswith("application/json"):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Content-Type must be application/json",
        )
    return content_type or "application/json"
