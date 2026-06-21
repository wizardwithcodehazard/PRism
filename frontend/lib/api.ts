/**
 * Typed API client for PRism backend.
 * All requests include credentials (cookies) for session auth.
 */

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("prism_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, {
    credentials: "omit", // We now use Bearer tokens
    headers,
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "API Error");
  }
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────
export const getLoginUrl = () => `${API}/auth/login`;

export const getMe = () => apiFetch<User>("/auth/me");

export const logout = () =>
  apiFetch<{ ok: boolean }>("/auth/logout", { method: "POST" });

// ─── GitHub ──────────────────────────────────────────────
export const listRepos = () => apiFetch<Repo[]>("/github/repos");

export const listOpenPRs = (owner: string, repo: string) =>
  apiFetch<PullRequest[]>(`/github/repos/${owner}/${repo}/pulls`);

// ─── Reviews ─────────────────────────────────────────────
export const triggerReview = (repo: string, pr_number: number) =>
  apiFetch<{ review_id: number; status: string }>("/reviews/trigger", {
    method: "POST",
    body: JSON.stringify({ repo, pr_number }),
  });

export const listReviews = () => apiFetch<ReviewSummary[]>("/reviews/");

export const getReview = (id: number) =>
  apiFetch<ReviewDetail>(`/reviews/${id}`);

// ─── Settings ────────────────────────────────────────────
export const getSettings = () => apiFetch<UserSettings>("/users/settings");

export const updateSettings = (data: Partial<UserSettings>) =>
  apiFetch<{ ok: boolean }>("/users/settings", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

// ─── Types ───────────────────────────────────────────────
export interface User {
  id: number;
  github_id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export interface Repo {
  full_name: string;
  name: string;
  owner: string;
  private: boolean;
  description: string | null;
  language: string | null;
  open_issues_count: number;
  html_url: string;
  updated_at: string;
}

export interface PullRequest {
  number: number;
  title: string;
  author: string;
  html_url: string;
  base: string;
  head: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewSummary {
  id: number;
  repo: string;
  pr_number: number;
  pr_title: string;
  pr_author: string;
  pr_url: string;
  status: "pending" | "reviewed" | "error";
  issues_count: number;
  critical_count: number;
  warning_count: number;
  info_count: number;
  lines_added: number;
  lines_deleted: number;
  detected_languages: string[];
  created_at: string;
}

export interface ReviewComment {
  severity: "critical" | "warning" | "info";
  category: "bug" | "security" | "performance" | "code_smell" | "style";
  file: string | null;
  line: number | null;
  message: string;
  description: string;
  suggestion: string;
}

export interface ReviewDetail extends ReviewSummary {
  base_branch: string;
  head_branch: string;
  ai_summary: string;
  comments: ReviewComment[];
}

export interface UserSettings {
  discord_webhook_url: string | null;
  groq_api_key?: string | null;
  groq_api_key_set?: boolean;
  auto_post_comments: boolean;
  check_security: boolean;
  check_performance: boolean;
  check_code_smells: boolean;
  block_on_critical: number;
  block_on_warnings: number;
}
