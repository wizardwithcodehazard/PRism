# 🔮 PRism — AI-Powered Code Review Assistant

> Detects bugs, security vulnerabilities, performance bottlenecks, and code smells in pull requests automatically using AI.

[![CI](https://github.com/your-org/prism/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/prism/actions/workflows/ci.yml)

---

## 🏗️ Architecture

```
prism/
├── frontend/          ← Next.js 15 + shadcn/ui + Tailwind
├── backend/           ← FastAPI + SQLite + Groq AI
└── .github/workflows/ ← GitHub Actions CI/CD
```

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 20+
- A GitHub OAuth App (see below)
- A Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Create a GitHub OAuth App

1. Go to **GitHub Settings → Developer Settings → OAuth Apps → New OAuth App**
2. Set **Homepage URL**: `http://localhost:3000`
3. Set **Authorization callback URL**: `http://localhost:3000/auth/callback`
4. Copy your **Client ID** and **Client Secret**

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`  
API docs: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## 🔐 How GitHub OAuth Works

1. User clicks **"Connect GitHub"** on the landing page
2. Redirected to `github.com/login/oauth/authorize`
3. After approval, GitHub redirects to `GET /auth/callback?code=...`
4. Backend exchanges code for an access token and stores it (encrypted in DB)
5. A JWT session cookie (`prism_session`) is set — user lands on `/dashboard`

---

## 🤖 AI Review Flow

1. User selects a repo and open PR on the **New Review** page
2. Backend fetches the PR diff via GitHub API
3. File extensions are analyzed to detect programming languages
4. Diff is sent to **Groq (Llama 3.3 70B)** with a structured prompt
5. AI returns JSON: `{ summary, score, comments[] }`
6. Each comment has: `severity`, `category`, `file`, `line`, `message`, `description`, `suggestion`
7. Results are stored in SQLite and displayed on the **Review Detail** page
8. If enabled: AI review comment is posted to the GitHub PR
9. If configured: Discord webhook notification is sent

---

## ⚙️ GitHub Actions

| Workflow | Trigger | Jobs |
|---|---|---|
| `ci.yml` | Push / PR | Backend tests, Frontend build/lint, Dynamic language linting |
| `deploy.yml` | Push to `main` | Deploy frontend (Vercel), Trigger backend redeploy (Render) |

### Dynamic Language Detection (CI)
On PRs, the `detect-and-lint` job analyzes changed file extensions and runs language-specific linters:
- `.py` → **ruff** + **mypy**
- `.js/.ts` → **ESLint**
- `.go` → **golangci-lint**
- `Dockerfile` → **hadolint**
- `.tf` → **tflint**

---

## 🔧 Required GitHub Secrets (for CI/CD)

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Vercel deploy token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `RENDER_DEPLOY_HOOK_URL` | Render service deploy hook URL |

---

## 🌐 Deployment

### Frontend → Vercel
1. Import `frontend/` folder as a Vercel project
2. Set env var: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

### Backend → Render
1. Create a new **Web Service** pointing to `backend/`
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Set all env vars from `backend/.env.example`

---

## 💬 Discord ChatOps

Users can optionally configure a Discord webhook URL in **Settings**. After each review, PRism sends a rich embed with:
- Quality score bar
- Critical / Warning / Info counts
- AI summary excerpt
- Link to the PR

---

## 📚 API Reference

Run the backend and visit `http://localhost:8000/docs` for the interactive Swagger UI.

Key endpoints:
- `GET /auth/login` — GitHub OAuth redirect
- `GET /auth/me` — Current user
- `GET /github/repos` — List user repos
- `GET /github/repos/{owner}/{repo}/pulls` — Open PRs
- `POST /reviews/trigger` — Trigger AI review
- `GET /reviews/` — Review history
- `GET /reviews/{id}` — Review detail
- `GET /users/settings` — Get settings
- `PATCH /users/settings` — Update settings
