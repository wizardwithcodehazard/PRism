"""
AI Reviewer Service — uses Groq (Llama 3.3 70B) to analyze PR diffs.

Returns structured review comments with:
  - severity: critical | warning | info
  - category: bug | security | performance | code_smell | style
  - file: filename
  - line: line number (if determinable from diff)
  - message: short title
  - description: detailed explanation
  - suggestion: concrete fix recommendation
"""
import json
import re
from groq import AsyncGroq
from config import settings

client = AsyncGroq(api_key=settings.GROQ_API_KEY)

SYSTEM_PROMPT = """You are PRism, an expert AI code reviewer for engineering teams.
Your job is to analyze pull request diffs and identify:
1. **Bugs** — Logic errors, null pointer risks, off-by-one errors, incorrect API usage
2. **Security Vulnerabilities** — SQL injection, XSS, hardcoded secrets, insecure deserialization, SSRF, path traversal, etc.
3. **Performance Bottlenecks** — N+1 queries, inefficient algorithms, memory leaks, blocking calls in async code
4. **Code Smells** — Long functions, duplicate code, dead code, poor naming, missing error handling
5. **Style Issues** — Naming convention violations, missing type hints/JSDoc, poor code organization

You MUST respond with ONLY a valid JSON object in this exact format:
{
  "summary": "2-3 sentence overall assessment of the PR",
  "score": <integer 0-100, 100=perfect>,
  "comments": [
    {
      "severity": "critical|warning|info",
      "category": "bug|security|performance|code_smell|style",
      "file": "path/to/file.ext or null if general",
      "line": <integer line number in diff or null>,
      "message": "Short title (max 80 chars)",
      "description": "Detailed explanation of the issue",
      "suggestion": "Concrete fix or improvement recommendation"
    }
  ]
}

Rules:
- Only report REAL issues — do not be pedantic or flag style in otherwise clean code
- Always prioritize security and bugs over style
- If the diff is clean, return an empty comments array with a positive summary
- Keep descriptions concise but actionable
- Maximum 20 comments per review
"""


def _truncate_diff(diff: str, max_chars: int = 12000) -> str:
    """Truncate very large diffs to stay within token limits."""
    if len(diff) <= max_chars:
        return diff
    half = max_chars // 2
    return diff[:half] + "\n\n... [diff truncated for length] ...\n\n" + diff[-half:]


def _build_user_prompt(diff: str, languages: list[str], settings_ctx: dict) -> str:
    lang_str = ", ".join(languages) if languages else "unknown"
    checks = []
    if settings_ctx.get("check_security", True):
        checks.append("security vulnerabilities")
    if settings_ctx.get("check_performance", True):
        checks.append("performance issues")
    if settings_ctx.get("check_code_smells", True):
        checks.append("code smells and style issues")
    checks.append("bugs")  # always check for bugs

    return f"""Review this pull request diff. Detected languages: {lang_str}.
Focus on: {", ".join(checks)}.

<diff>
{_truncate_diff(diff)}
</diff>

Respond with ONLY the JSON object, no markdown fences or extra text."""


async def review_diff(
    diff: str,
    languages: list[str],
    user_settings: dict,
) -> dict:
    """
    Call Groq to review a PR diff.
    Returns parsed dict: { summary, score, comments }.
    """
    prompt = _build_user_prompt(diff, languages, user_settings)

    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.1,
        max_tokens=4096,
    )

    raw = response.choices[0].message.content.strip()

    # Strip markdown code fences if model added them anyway
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        # Fallback: return a safe structure
        result = {
            "summary": "AI review completed but response could not be parsed.",
            "score": 50,
            "comments": [],
        }

    return result


def build_github_comment(review: dict, pr_title: str) -> str:
    """Format the AI review as a GitHub PR comment (Markdown)."""
    severity_emoji = {"critical": "🔴", "warning": "🟡", "info": "🔵"}
    category_emoji = {
        "bug": "🐛",
        "security": "🔒",
        "performance": "⚡",
        "code_smell": "🌿",
        "style": "✨",
    }

    score = review.get("score", 0)
    score_bar = "█" * (score // 10) + "░" * (10 - score // 10)
    summary = review.get("summary", "")
    comments = review.get("comments", [])

    lines = [
        f"## 🔮 PRism AI Review — `{pr_title}`",
        "",
        f"**Quality Score:** `{score}/100` `[{score_bar}]`",
        "",
        f"> {summary}",
        "",
    ]

    if not comments:
        lines.append("✅ **No significant issues found. Great work!**")
    else:
        criticals = [c for c in comments if c.get("severity") == "critical"]
        warnings = [c for c in comments if c.get("severity") == "warning"]
        infos = [c for c in comments if c.get("severity") == "info"]

        lines.append(
            f"**Found:** 🔴 {len(criticals)} Critical · 🟡 {len(warnings)} Warnings · 🔵 {len(infos)} Info"
        )
        lines.append("")
        lines.append("---")
        lines.append("")

        for comment in comments:
            sev = comment.get("severity", "info")
            cat = comment.get("category", "style")
            file_ = comment.get("file")
            line_ = comment.get("line")
            msg = comment.get("message", "")
            desc = comment.get("description", "")
            suggestion = comment.get("suggestion", "")

            loc = f"`{file_}`" if file_ else ""
            if line_:
                loc += f" line {line_}"

            lines.append(
                f"### {severity_emoji.get(sev, '⚪')} {category_emoji.get(cat, '📌')} {msg}"
            )
            if loc:
                lines.append(f"**Location:** {loc}")
            lines.append("")
            lines.append(desc)
            if suggestion:
                lines.append("")
                lines.append(f"**💡 Suggestion:** {suggestion}")
            lines.append("")
            lines.append("---")
            lines.append("")

    lines.append("")
    lines.append("*Powered by [PRism](https://github.com/prism-ai) · AI Code Review*")

    return "\n".join(lines)
