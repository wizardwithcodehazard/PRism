"""
GitHub OAuth helper + GitHub API client utilities.
"""
import httpx
from config import settings


GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_API_BASE = "https://api.github.com"


def build_oauth_redirect_url() -> str:
    params = (
        f"client_id={settings.GITHUB_CLIENT_ID}"
        f"&scope=repo,read:user,user:email"
        f"&redirect_uri={settings.FRONTEND_URL.rstrip('/')}/auth/callback"
    )
    return f"{GITHUB_OAUTH_URL}?{params}"


async def exchange_code_for_token(code: str) -> str:
    """Exchange OAuth code for a GitHub access token."""
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            GITHUB_TOKEN_URL,
            headers={"Accept": "application/json"},
            json={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
            },
        )
        data = resp.json()
        if "access_token" not in data:
            raise ValueError(f"GitHub OAuth error: {data}")
        return data["access_token"]


async def get_github_user(access_token: str) -> dict:
    """Fetch the authenticated GitHub user's profile."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API_BASE}/user",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        resp.raise_for_status()
        return resp.json()


async def get_pr_diff(access_token: str, repo: str, pr_number: int) -> str:
    """Fetch the unified diff for a pull request."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API_BASE}/repos/{repo}/pulls/{pr_number}",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3.diff",
            },
            follow_redirects=True,
        )
        resp.raise_for_status()
        return resp.text


async def get_pr_files(access_token: str, repo: str, pr_number: int) -> list[dict]:
    """List files changed in the PR (for language detection)."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API_BASE}/repos/{repo}/pulls/{pr_number}/files",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        resp.raise_for_status()
        return resp.json()


async def get_user_repos(access_token: str) -> list[dict]:
    """List repos the user has access to (up to 100)."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API_BASE}/user/repos",
            headers={"Authorization": f"Bearer {access_token}"},
            params={"sort": "updated", "per_page": 100, "affiliation": "owner,collaborator"},
        )
        resp.raise_for_status()
        return resp.json()


async def get_repo_open_prs(access_token: str, repo: str) -> list[dict]:
    """List open pull requests for a repo."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API_BASE}/repos/{repo}/pulls",
            headers={"Authorization": f"Bearer {access_token}"},
            params={"state": "open", "per_page": 50},
        )
        resp.raise_for_status()
        return resp.json()


async def get_pr_details(access_token: str, repo: str, pr_number: int) -> dict:
    """Get PR metadata."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API_BASE}/repos/{repo}/pulls/{pr_number}",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        resp.raise_for_status()
        return resp.json()


async def post_pr_review_comment(
    access_token: str,
    repo: str,
    pr_number: int,
    body: str,
) -> None:
    """Post a general review comment on a PR."""
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{GITHUB_API_BASE}/repos/{repo}/issues/{pr_number}/comments",
            headers={"Authorization": f"Bearer {access_token}"},
            json={"body": body},
        )


def detect_languages(files: list[dict]) -> list[str]:
    """Detect programming languages from file extensions."""
    ext_map = {
        ".py": "Python",
        ".js": "JavaScript",
        ".ts": "TypeScript",
        ".tsx": "TypeScript/React",
        ".jsx": "JavaScript/React",
        ".go": "Go",
        ".java": "Java",
        ".cs": "C#",
        ".cpp": "C++",
        ".c": "C",
        ".rb": "Ruby",
        ".rs": "Rust",
        ".php": "PHP",
        ".swift": "Swift",
        ".kt": "Kotlin",
        ".scala": "Scala",
        ".sh": "Shell",
        ".yaml": "YAML",
        ".yml": "YAML",
        ".json": "JSON",
        ".tf": "Terraform",
        ".dockerfile": "Docker",
    }
    seen = set()
    for f in files:
        filename = f.get("filename", "")
        for ext, lang in ext_map.items():
            if filename.endswith(ext) or filename.lower() == "dockerfile":
                seen.add("Docker" if filename.lower() == "dockerfile" else lang)
    return sorted(seen)
