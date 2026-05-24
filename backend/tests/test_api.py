"""
Backend tests — covers health endpoint, auth redirect, and review listing.
Run: pytest tests/ -v
"""
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

import os
os.environ.setdefault("GITHUB_CLIENT_ID", "test_id")
os.environ.setdefault("GITHUB_CLIENT_SECRET", "test_secret")
os.environ.setdefault("GROQ_API_KEY", "test_key")
os.environ.setdefault("SECRET_KEY", "test_secret_key")
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test_prism.db")
os.environ.setdefault("FRONTEND_URL", "http://localhost:3000")

from main import app
from database import init_db, engine, Base


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_auth_login_redirects():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/auth/login", follow_redirects=False)
    assert resp.status_code in (302, 307)
    assert "github.com/login/oauth/authorize" in resp.headers["location"]


@pytest.mark.asyncio
async def test_me_unauthenticated():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/auth/me")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_reviews_unauthenticated():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/reviews/")
    assert resp.status_code == 401
