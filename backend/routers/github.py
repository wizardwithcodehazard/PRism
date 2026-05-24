"""
GitHub data router.
  GET /github/repos          → list user repos
  GET /github/repos/{owner}/{repo}/pulls → list open PRs
"""
from fastapi import APIRouter, Depends
import github_client as gh
from auth_utils import get_current_user
from models import User

router = APIRouter(prefix="/github", tags=["github"])


@router.get("/repos")
async def list_repos(current_user: User = Depends(get_current_user)):
    """Return all repos the user has access to."""
    repos = await gh.get_user_repos(current_user.access_token)
    return [
        {
            "full_name": r["full_name"],
            "name": r["name"],
            "owner": r["owner"]["login"],
            "private": r["private"],
            "description": r.get("description"),
            "language": r.get("language"),
            "open_issues_count": r.get("open_issues_count", 0),
            "html_url": r["html_url"],
            "updated_at": r.get("updated_at"),
        }
        for r in repos
    ]


@router.get("/repos/{owner}/{repo}/pulls")
async def list_open_prs(
    owner: str,
    repo: str,
    current_user: User = Depends(get_current_user),
):
    """Return open PRs for a specific repo."""
    full_name = f"{owner}/{repo}"
    prs = await gh.get_repo_open_prs(current_user.access_token, full_name)
    return [
        {
            "number": pr["number"],
            "title": pr["title"],
            "author": pr["user"]["login"],
            "html_url": pr["html_url"],
            "base": pr["base"]["ref"],
            "head": pr["head"]["ref"],
            "created_at": pr["created_at"],
            "updated_at": pr["updated_at"],
        }
        for pr in prs
    ]
