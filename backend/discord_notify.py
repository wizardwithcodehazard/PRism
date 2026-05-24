"""
Discord ChatOps notification helper.
Users can optionally provide their own Discord webhook URL in settings.
"""
import httpx


async def send_discord_notification(
    webhook_url: str,
    review_data: dict,
    pr_title: str,
    pr_url: str,
    repo: str,
) -> bool:
    """
    Send a rich Discord embed with review results.
    Returns True on success, False on failure.
    """
    score = review_data.get("score", 0)
    critical = review_data.get("critical_count", 0)
    warning = review_data.get("warning_count", 0)
    info = review_data.get("info_count", 0)
    summary = review_data.get("ai_summary", "")

    # Pick color based on severity
    if critical > 0:
        color = 0xFF4444  # Red
        status_emoji = "🔴"
        status = "Needs Attention"
    elif warning > 0:
        color = 0xFFAA00  # Amber
        status_emoji = "🟡"
        status = "Warnings Found"
    else:
        color = 0x22CC88  # Green
        status_emoji = "✅"
        status = "Looks Good"

    score_bar = "█" * (score // 10) + "░" * (10 - score // 10)

    embed = {
        "title": f"🔮 PRism Review — {pr_title}",
        "url": pr_url,
        "description": summary[:300] if summary else "AI review complete.",
        "color": color,
        "fields": [
            {
                "name": "Repository",
                "value": f"`{repo}`",
                "inline": True,
            },
            {
                "name": "Status",
                "value": f"{status_emoji} {status}",
                "inline": True,
            },
            {
                "name": "Quality Score",
                "value": f"`{score}/100` `[{score_bar}]`",
                "inline": False,
            },
            {
                "name": "Issues Found",
                "value": f"🔴 {critical} Critical · 🟡 {warning} Warnings · 🔵 {info} Info",
                "inline": False,
            },
        ],
        "footer": {"text": "PRism AI Code Review"},
    }

    payload = {"embeds": [embed]}

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(webhook_url, json=payload, timeout=10)
            return resp.status_code in (200, 204)
    except Exception:
        return False
