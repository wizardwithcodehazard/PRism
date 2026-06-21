"""
Reviews router.
  POST /reviews/trigger          → trigger AI review for a PR
  GET  /reviews/                 → list user's past reviews
  GET  /reviews/{review_id}      → get single review details
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

import github_client as gh
from ai_reviewer import review_diff, build_github_comment
from discord_notify import send_discord_notification
from auth_utils import get_current_user
from database import get_db
from models import User, Review

router = APIRouter(prefix="/reviews", tags=["reviews"])


class TriggerReviewRequest(BaseModel):
    repo: str       # "owner/repo"
    pr_number: int


async def _run_review(
    review_id: int,
    repo: str,
    pr_number: int,
    access_token: str,
    user_settings: dict,
    db_session_maker,
    discord_webhook: str | None,
):
    """Background task: fetch diff → AI review → update DB → notify Discord."""
    from database import AsyncSessionLocal

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Review).where(Review.id == review_id))
        review = result.scalar_one_or_none()
        if not review:
            return

        try:
            # 1. Fetch PR files and diff
            files = await gh.get_pr_files(access_token, repo, pr_number)
            diff = await gh.get_pr_diff(access_token, repo, pr_number)
            languages = gh.detect_languages(files)

            # 2. Run AI review
            ai_result = await review_diff(diff, languages, user_settings)

            comments = ai_result.get("comments", [])
            critical = sum(1 for c in comments if c.get("severity") == "critical")
            warning = sum(1 for c in comments if c.get("severity") == "warning")
            info = sum(1 for c in comments if c.get("severity") == "info")

            # 3. Update review record
            review.status = "reviewed"
            review.issues_count = len(comments)
            review.critical_count = critical
            review.warning_count = warning
            review.info_count = info
            review.ai_summary = ai_result.get("summary", "")
            review.comments = comments
            review.detected_languages = languages

            # 4. Post GitHub comment if enabled
            if user_settings.get("auto_post_comments", True):
                gh_comment = build_github_comment(ai_result, review.pr_title)
                await gh.post_pr_review_comment(access_token, repo, pr_number, gh_comment)

            # 5. Discord notification if webhook configured
            if discord_webhook:
                await send_discord_notification(
                    webhook_url=discord_webhook,
                    review_data={
                        "score": ai_result.get("score", 0),
                        "critical_count": critical,
                        "warning_count": warning,
                        "info_count": info,
                        "ai_summary": ai_result.get("summary", ""),
                    },
                    pr_title=review.pr_title,
                    pr_url=review.pr_url,
                    repo=repo,
                )

        except Exception as e:
            review.status = "error"
            review.ai_summary = f"Review failed: {str(e)}"

        await db.commit()


@router.post("/trigger")
async def trigger_review(
    body: TriggerReviewRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Trigger an AI review for a pull request."""
    # Fetch PR metadata from GitHub
    try:
        pr = await gh.get_pr_details(current_user.access_token, body.repo, body.pr_number)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not fetch PR: {e}")

    # Create pending review record
    review = Review(
        user_id=current_user.id,
        repo_full_name=body.repo,
        pr_number=body.pr_number,
        pr_title=pr["title"],
        pr_author=pr["user"]["login"],
        pr_url=pr["html_url"],
        base_branch=pr["base"]["ref"],
        head_branch=pr["head"]["ref"],
        lines_added=pr.get("additions", 0),
        lines_deleted=pr.get("deletions", 0),
        status="pending",
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)

    user_settings = {
        "auto_post_comments": current_user.auto_post_comments,
        "check_security": current_user.check_security,
        "check_performance": current_user.check_performance,
        "check_code_smells": current_user.check_code_smells,
        "groq_api_key": current_user.groq_api_key,
    }

    background_tasks.add_task(
        _run_review,
        review.id,
        body.repo,
        body.pr_number,
        current_user.access_token,
        user_settings,
        None,  # session maker handled inside
        current_user.discord_webhook_url,
    )

    return {"review_id": review.id, "status": "pending"}


@router.get("/")
async def list_reviews(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all reviews for the current user, newest first."""
    result = await db.execute(
        select(Review)
        .where(Review.user_id == current_user.id)
        .order_by(desc(Review.created_at))
        .limit(50)
    )
    reviews = result.scalars().all()
    return [
        {
            "id": r.id,
            "repo": r.repo_full_name,
            "pr_number": r.pr_number,
            "pr_title": r.pr_title,
            "pr_author": r.pr_author,
            "pr_url": r.pr_url,
            "status": r.status,
            "issues_count": r.issues_count,
            "critical_count": r.critical_count,
            "warning_count": r.warning_count,
            "info_count": r.info_count,
            "lines_added": r.lines_added,
            "lines_deleted": r.lines_deleted,
            "detected_languages": r.detected_languages or [],
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in reviews
    ]


@router.get("/{review_id}")
async def get_review(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get full details of a single review including AI comments."""
    result = await db.execute(
        select(Review).where(Review.id == review_id, Review.user_id == current_user.id)
    )
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    return {
        "id": review.id,
        "repo": review.repo_full_name,
        "pr_number": review.pr_number,
        "pr_title": review.pr_title,
        "pr_author": review.pr_author,
        "pr_url": review.pr_url,
        "base_branch": review.base_branch,
        "head_branch": review.head_branch,
        "status": review.status,
        "issues_count": review.issues_count,
        "critical_count": review.critical_count,
        "warning_count": review.warning_count,
        "info_count": review.info_count,
        "lines_added": review.lines_added,
        "lines_deleted": review.lines_deleted,
        "ai_summary": review.ai_summary,
        "comments": review.comments or [],
        "detected_languages": review.detected_languages or [],
        "created_at": review.created_at.isoformat() if review.created_at else None,
    }
