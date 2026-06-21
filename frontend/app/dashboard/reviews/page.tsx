"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, GitPullRequest, ArrowRight, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listReviews, type ReviewSummary } from "@/lib/api";

function SeverityBadge({ review }: { review: ReviewSummary }) {
  if (review.status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium badge-info">
        <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
        Pending
      </span>
    );
  }
  if (review.status === "error") return <span className="px-2.5 py-0.5 rounded-full text-xs badge-critical">Error</span>;
  if (review.critical_count > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium badge-critical">
        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
        {review.critical_count} Critical
      </span>
    );
  }
  if (review.warning_count > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium badge-warning">
        <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
        {review.warning_count} Warnings
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium badge-clean">
      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
      Clean
    </span>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewSummary[]>([]);
  const [filtered, setFiltered] = useState<ReviewSummary[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listReviews()
      .then((r) => {
        setReviews(r);
        setFiltered(r);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    const q = value.toLowerCase();
    setFiltered(
      reviews.filter(
        (r) =>
          r.pr_title.toLowerCase().includes(q) ||
          r.repo.toLowerCase().includes(q) ||
          r.pr_author.toLowerCase().includes(q),
      ),
    );
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Review History</h1>
          <p className="text-muted-foreground">All your AI code reviews</p>
        </div>
        <Link href="/dashboard/new-review" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 gap-2 glow-primary">
            <GitPullRequest className="h-4 w-4" />
            New Review
          </Button>
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by PR title, repo, or author..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 bg-muted/30 border-border/50"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="glass border-border/50 p-12 text-center">
          <GitPullRequest className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">
            {search ? "No reviews match your search." : "No reviews yet."}
          </p>
          {!search && (
            <Link href="/dashboard/new-review">
              <Button className="bg-primary hover:bg-primary/90">Start First Review</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <Link key={review.id} href={`/dashboard/review/${review.id}`}>
              <Card className="glass border-border/50 hover:border-primary/30 p-5 cursor-pointer group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {review.pr_title}
                      </h3>
                      <SeverityBadge review={review} />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground min-w-0">
                      <span className="font-mono text-primary/70 truncate max-w-[140px] min-[400px]:max-w-[180px] sm:max-w-none" title={`${review.repo}#${review.pr_number}`}>
                        {review.repo}#{review.pr_number}
                      </span>
                      <span className="text-muted-foreground/50">·</span>
                      <span className="truncate max-w-[100px] sm:max-w-none" title={`by ${review.pr_author}`}>by {review.pr_author}</span>
                      <span className="text-muted-foreground/50">·</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="h-3 w-3" />
                        {timeAgo(review.created_at)}
                      </span>
                    </div>
                    {review.detected_languages?.length > 0 && (
                      <div className="flex gap-1.5 mt-2">
                        {review.detected_languages.slice(0, 5).map((lang) => (
                          <span key={lang} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 ml-4 shrink-0 text-xs text-muted-foreground">
                    <div className="text-right hidden sm:block">
                      <p className="font-semibold text-foreground">{review.issues_count}</p>
                      <p>issues</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="font-semibold text-green-400">+{review.lines_added}</p>
                      <p className="text-red-400">-{review.lines_deleted}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
