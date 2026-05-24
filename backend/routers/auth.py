"""
GitHub OAuth router.
  GET /auth/login   → redirect to GitHub
  GET /auth/callback → exchange code, upsert user, set session cookie, redirect to dashboard
  GET /auth/me      → return current user
  POST /auth/logout → clear session
"""
from fastapi import APIRouter, Depends, HTTPException, Response, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

import github_client as gh
from database import get_db
from models import User
from config import settings
from auth_utils import create_session_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/login")
async def github_login():
    """Redirect the user to GitHub OAuth."""
    return RedirectResponse(gh.build_oauth_redirect_url())


@router.get("/callback")
async def github_callback(
    code: str,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """
    Handle GitHub OAuth callback.
    Exchange code → token → user profile → upsert DB → set JWT cookie → redirect frontend.
    """
    try:
        access_token = await gh.exchange_code_for_token(code)
        github_user = await gh.get_github_user(access_token)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Upsert user
    result = await db.execute(
        select(User).where(User.github_id == github_user["id"])
    )
    user = result.scalar_one_or_none()

    if user:
        user.access_token = access_token
        user.login = github_user["login"]
        user.name = github_user.get("name")
        user.email = github_user.get("email")
        user.avatar_url = github_user.get("avatar_url")
    else:
        user = User(
            github_id=github_user["id"],
            login=github_user["login"],
            name=github_user.get("name"),
            email=github_user.get("email"),
            avatar_url=github_user.get("avatar_url"),
            access_token=access_token,
        )
        db.add(user)

    await db.commit()
    await db.refresh(user)

    # Issue JWT session token
    session_token = create_session_token(user.id)

    redirect = RedirectResponse(url=f"{settings.FRONTEND_URL}/dashboard")
    redirect.set_cookie(
        key="prism_session",
        value=session_token,
        httponly=True,
        secure=True,       # Required for cross-domain (HTTPS)
        samesite="none",   # Required for Vercel -> Render cross-domain API calls
        max_age=60 * 60 * 24 * 7,  # 7 days
    )
    return redirect


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Return the current authenticated user."""
    return {
        "id": current_user.id,
        "github_id": current_user.github_id,
        "login": current_user.login,
        "name": current_user.name,
        "email": current_user.email,
        "avatar_url": current_user.avatar_url,
    }


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("prism_session")
    return {"ok": True}
