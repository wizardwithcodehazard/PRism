"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  GitPullRequest,
  Loader2,
  ShieldCheck,
  Bug,
  Zap,
  MessageSquareCode,
  Palette,
  AlertCircle,
  RefreshCw,
  FileCode,
  Lightbulb,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getReview, type ReviewDetail, type ReviewComment } from "@/lib/api";

const categoryIcons: Record<string, React.ElementType> = {
  bug: Bug,
  security: ShieldCheck,
  performance: Zap,
  code_smell: MessageSquareCode,
  style: Palette,
};

const categoryLabels: Record<string, string> = {
  bug: "Bug",
  security: "Security",
  performance: "Performance",
  code_smell: "Code Smell",
  style: "Style",
};

function CommentCard({ comment }: { comment: ReviewComment }) {
  const Icon = categoryIcons[comment.category] ?? AlertCircle;
  const severityClass =
    comment.severity === "critical"
      ? "badge-critical"
      : comment.severity === "warning"
      ? "badge-warning"
      : "badge-info";

  const borderClass =
    comment.severity === "critical"
      ? "border-red-500/25 bg-red-500/5"
      : comment.severity === "warning"
      ? "border-yellow-500/25 bg-yellow-500/5"
      : "border-blue-500/25 bg-blue-500/5";

  return (
    <Card className={`p-5 border ${borderClass}`}>
      <div className="flex items-start gap-4">
        <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-foreground text-sm leading-tight">{comment.message}</h4>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${severityClass}`}>
                {comment.severity}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                {categoryLabels[comment.category] ?? comment.category}
              </span>
            </div>
          </div>

          {comment.file && (
            <p className="text-xs font-mono text-primary/70 mb-2 flex items-center gap-1.5">
              <FileCode className="h-3.5 w-3.5" />
              <span>{comment.file}{comment.line && `:${comment.line}`}</span>
            </p>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{comment.description}</p>

          {comment.suggestion && (
            <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
              <p className="text-xs font-medium text-green-400 mb-1 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" />
                <span>Suggestion</span>
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{comment.suggestion}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#22cc88" : score >= 60 ? "#ffaa00" : "#ff4444";
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference * (1 - score / 100);

  return (
    <div className="relative h-24 w-24">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" fill="none" stroke="oklch(0.22 0 0)" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

export default function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const fetchReview = async () => {
    setLoading(true);
    try {
      const data = await getReview(Number(id));
      setReview(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getReview(Number(id));
        if (!cancelled) setReview(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const interval = setInterval(() => {
      getReview(Number(id))
        .then((data) => { if (!cancelled) setReview(data); })
        .catch(console.error);
    }, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const filteredComments =
    review?.comments?.filter((c) => activeFilter === "all" || c.severity === activeFilter) ?? [];

  if (loading && !review) {
    return (
      <div className="p-8 flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading review...
      </div>
    );
  }

  if (!review) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Review not found.</p>
        <Link href="/dashboard">
          <Button variant="ghost" className="mt-4">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isPending = review.status === "pending";

  return (
    <div className="p-4 sm:p-8">
      {/* Back */}
      <Link href="/dashboard/reviews" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to reviews
      </Link>

      {/* PR Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono text-primary/70">{review.repo}#{review.pr_number}</span>
              {isPending && (
                <span className="inline-flex items-center gap-1.5 text-xs badge-info px-2 py-0.5 rounded-full">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Reviewing...
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{review.pr_title}</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-muted-foreground mt-1">
              <span>by <strong>{review.pr_author}</strong></span>
              <span>·</span>
              <span className="font-mono">{review.head_branch} → {review.base_branch}</span>
              <span>·</span>
              <span className="text-green-400">+{review.lines_added}</span>
              <span className="text-red-400">-{review.lines_deleted}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto md:justify-end">
            <a href={review.pr_url} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-initial">
              <Button variant="outline" size="sm" className="w-full gap-2 border-border/50">
                <ExternalLink className="h-3.5 w-3.5" />
                View on GitHub
              </Button>
            </a>
            <Button variant="ghost" size="sm" onClick={fetchReview} className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {review.detected_languages?.length > 0 && (
          <div className="flex gap-1.5">
            {review.detected_languages.map((lang) => (
              <span key={lang} className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                {lang}
              </span>
            ))}
          </div>
        )}
      </div>

      {isPending ? (
        <Card className="glass border-primary/20 p-12 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground mb-1">AI is reviewing your PR</p>
          <p className="text-sm text-muted-foreground">
            Analyzing the diff for bugs, security issues, and more. This usually takes 15–30 seconds.
          </p>
        </Card>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="glass border-border/50 p-5 flex items-center gap-4">
              <ScoreRing score={0} /> {/* Score not in summary type, defaulting */}
              <div>
                <p className="text-xs text-muted-foreground">Quality Score</p>
                <p className="text-sm font-semibold text-foreground">See ring</p>
              </div>
            </Card>
            <Card className="glass border-red-500/20 p-5">
              <p className="text-xs text-muted-foreground mb-1">Critical</p>
              <p className="text-3xl font-bold text-red-400">{review.critical_count}</p>
            </Card>
            <Card className="glass border-yellow-500/20 p-5">
              <p className="text-xs text-muted-foreground mb-1">Warnings</p>
              <p className="text-3xl font-bold text-yellow-400">{review.warning_count}</p>
            </Card>
            <Card className="glass border-blue-500/20 p-5">
              <p className="text-xs text-muted-foreground mb-1">Info</p>
              <p className="text-3xl font-bold text-blue-400">{review.info_count}</p>
            </Card>
          </div>

          {/* AI Summary */}
          {review.ai_summary && (
            <Card className="glass border-primary/20 p-5 mb-6">
              <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">
                AI Summary
              </p>
              <p className="text-sm text-foreground leading-relaxed">{review.ai_summary}</p>
            </Card>
          )}

          {/* Filter tabs */}
          {review.comments?.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Issues ({review.issues_count})
                </h2>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["all", "critical", "warning", "info"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      activeFilter === f
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground border border-border/50 hover:border-border"
                    }`}
                  >
                    {f === "critical" && <div className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                    {f === "warning" && <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />}
                    {f === "info" && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                    {f === "all" ? `All (${review.issues_count})` : 
                     f === "critical" ? `Critical (${review.critical_count})` :
                     f === "warning" ? `Warnings (${review.warning_count})` :
                     `Info (${review.info_count})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          {review.comments?.length === 0 ? (
            <Card className="glass border-green-500/20 p-10 text-center">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-lg font-semibold text-foreground mb-1">No issues found!</p>
              <p className="text-sm text-muted-foreground">This PR looks clean. Great work!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredComments.map((comment, i) => (
                <CommentCard key={i} comment={comment} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
