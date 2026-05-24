from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    GROQ_API_KEY: str
    SECRET_KEY: str = "changeme-use-a-real-secret"
    FRONTEND_URL: str = "http://localhost:3000"
    DATABASE_URL: str = "sqlite+aiosqlite:///./prism.db"

    class Config:
        env_file = ".env"


settings = Settings()
