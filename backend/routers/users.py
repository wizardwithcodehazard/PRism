"""
User settings router.
  GET  /users/settings        → get current user settings
  PATCH /users/settings       → update settings
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel, HttpUrl
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from auth_utils import get_current_user
from database import get_db
from models import User

router = APIRouter(prefix="/users", tags=["users"])


class UpdateSettingsRequest(BaseModel):
    discord_webhook_url: Optional[str] = None
    auto_post_comments: Optional[bool] = None
    check_security: Optional[bool] = None
    check_performance: Optional[bool] = None
    check_code_smells: Optional[bool] = None
    block_on_critical: Optional[int] = None
    block_on_warnings: Optional[int] = None


@router.get("/settings")
async def get_settings(current_user: User = Depends(get_current_user)):
    return {
        "discord_webhook_url": current_user.discord_webhook_url,
        "auto_post_comments": current_user.auto_post_comments,
        "check_security": current_user.check_security,
        "check_performance": current_user.check_performance,
        "check_code_smells": current_user.check_code_smells,
        "block_on_critical": current_user.block_on_critical,
        "block_on_warnings": current_user.block_on_warnings,
    }


@router.patch("/settings")
async def update_settings(
    body: UpdateSettingsRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(current_user, field, value)
    await db.commit()
    return {"ok": True}
