from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True, nullable=False)
    login = Column(String, nullable=False)
    name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    access_token = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Settings
    discord_webhook_url = Column(String, nullable=True)
    groq_api_key = Column(String, nullable=True)
    auto_post_comments = Column(Boolean, default=True)
    check_security = Column(Boolean, default=True)
    check_performance = Column(Boolean, default=True)
    check_code_smells = Column(Boolean, default=True)
    block_on_critical = Column(Integer, default=1)   # block if >= N criticals
    block_on_warnings = Column(Integer, default=10)

    reviews = relationship("Review", back_populates="user", cascade="all, delete")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # PR metadata
    repo_full_name = Column(String, nullable=False)   # e.g. "owner/repo"
    pr_number = Column(Integer, nullable=False)
    pr_title = Column(String, nullable=False)
    pr_author = Column(String, nullable=False)
    pr_url = Column(String, nullable=False)
    base_branch = Column(String, nullable=False)
    head_branch = Column(String, nullable=False)
    lines_added = Column(Integer, default=0)
    lines_deleted = Column(Integer, default=0)

    # Review results
    status = Column(String, default="pending")       # pending | reviewed | error
    issues_count = Column(Integer, default=0)
    critical_count = Column(Integer, default=0)
    warning_count = Column(Integer, default=0)
    info_count = Column(Integer, default=0)
    ai_summary = Column(Text, nullable=True)
    comments = Column(JSON, nullable=True)           # list of comment dicts
    detected_languages = Column(JSON, nullable=True) # list of language strings

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="reviews")
