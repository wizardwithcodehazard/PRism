"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GitPullRequest, Loader2, ArrowRight, Search, Lock, Key } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listRepos, listOpenPRs, triggerReview, getSettings, type Repo, type PullRequest, type UserSettings } from "@/lib/api";


function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NewReviewPage() {
  const router = useRouter();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [repoSearch, setRepoSearch] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [prs, setPRs] = useState<PullRequest[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingPRs, setLoadingPRs] = useState(false);
  const [triggering, setTriggering] = useState<number | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error);
    listRepos()
      .then((r) => {
        setRepos(r);
        setFilteredRepos(r);
      })
      .catch(console.error)
      .finally(() => setLoadingRepos(false));
  }, []);

  const handleRepoSearch = (value: string) => {
    setRepoSearch(value);
    const q = value.toLowerCase();
    setFilteredRepos(repos.filter((r) => r.full_name.toLowerCase().includes(q)));
  };

  const selectRepo = async (repo: Repo) => {
    setSelectedRepo(repo);
    setPRs([]);
    setLoadingPRs(true);
    try {
      const openPRs = await listOpenPRs(repo.owner, repo.name);
      setPRs(openPRs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPRs(false);
    }
  };

  const handleTrigger = async (pr: PullRequest) => {
    if (!selectedRepo) return;
    setTriggering(pr.number);
    try {
      const result = await triggerReview(selectedRepo.full_name, pr.number);
      router.push(`/dashboard/review/${result.review_id}`);
    } catch (e) {
      console.error(e);
      setTriggering(null);
    }
  };


  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">New Review</h1>
        <p className="text-muted-foreground">Select a repository and pull request to review</p>
      </div>

      {/* Warning Banner */}
      {settings && !settings.groq_api_key_set && (
        <Card className="border-yellow-500/20 bg-yellow-500/5 p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Groq API Key Required</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Please set up your Groq API key in Settings before triggering code reviews.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard/settings")}
            className="w-full sm:w-auto px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            Configure Key <ArrowRight className="h-4 w-4" />
          </button>
        </Card>
      )}

      {/* Step 1: Select Repo */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-7 w-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold">
            1
          </div>
          <h2 className="text-lg font-semibold text-foreground">Choose Repository</h2>
        </div>

        {loadingRepos ? (
          <div className="flex items-center gap-2 text-muted-foreground py-8">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your repositories...
          </div>
        ) : (
          <div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search repositories..."
                value={repoSearch}
                onChange={(e) => handleRepoSearch(e.target.value)}
                className="pl-9 bg-muted/30 border-border/50"
              />
            </div>

            <div className="grid gap-2 max-h-72 overflow-y-auto pr-1" data-lenis-prevent>
              {filteredRepos.map((repo) => (
                <button
                  key={repo.full_name}
                  onClick={() => selectRepo(repo)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedRepo?.full_name === repo.full_name
                      ? "border-primary/50 bg-primary/10 text-foreground"
                      : "border-border/50 glass hover:border-primary/30 text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {repo.private && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                      <span className="font-medium text-sm">{repo.full_name}</span>
                      {repo.language && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {repo.open_issues_count} open issues
                    </span>
                  </div>
                  {repo.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">{repo.description}</p>
                  )}
                </button>
              ))}
              {filteredRepos.length === 0 && (
                <p className="text-muted-foreground text-sm py-4 text-center">No repositories found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Select PR */}
      {selectedRepo && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-7 w-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold">
              2
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Choose Pull Request — <span className="text-primary font-mono text-base">{selectedRepo.full_name}</span>
            </h2>
          </div>

          {loadingPRs ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
              <Loader2 className="h-4 w-4 animate-spin" />
              Fetching open pull requests...
            </div>
          ) : prs.length === 0 ? (
            <Card className="glass border-border/50 p-8 text-center">
              <GitPullRequest className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No open pull requests in this repository.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {prs.map((pr) => (
                <Card
                  key={pr.number}
                  className="glass border-border/50 hover:border-primary/30 p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-primary/70">#{pr.number}</span>
                        <h3 className="font-medium text-foreground text-sm truncate">{pr.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>by {pr.author}</span>
                        <span>·</span>
                        <span className="font-mono">{pr.head} → {pr.base}</span>
                        <span>·</span>
                        <span>{timeAgo(pr.updated_at)}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleTrigger(pr)}
                      disabled={triggering === pr.number || (settings !== null && !settings.groq_api_key_set)}
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90 gap-2 shrink-0 glow-primary"
                    >
                      {triggering === pr.number ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Reviewing...
                        </>
                      ) : (
                        <>
                          Review PR
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
