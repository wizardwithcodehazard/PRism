'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, TrendingUp, GitBranch, Eye } from 'lucide-react'

const mockReviews = [
  {
    id: 1,
    title: 'Add user authentication flow',
    repo: 'company/auth-service',
    author: 'alice@company.com',
    date: '2 hours ago',
    status: 'reviewed',
    issues: 3,
    critical: 1,
    warnings: 2,
    lines: 245,
  },
  {
    id: 2,
    title: 'Refactor database queries',
    repo: 'company/api-core',
    author: 'bob@company.com',
    date: '4 hours ago',
    status: 'reviewed',
    issues: 5,
    critical: 2,
    warnings: 3,
    lines: 512,
  },
  {
    id: 3,
    title: 'Update payment processing',
    repo: 'company/payments',
    author: 'carol@company.com',
    date: '6 hours ago',
    status: 'reviewed',
    issues: 1,
    critical: 0,
    warnings: 1,
    lines: 128,
  },
  {
    id: 4,
    title: 'Add unit tests for utils',
    repo: 'company/shared',
    author: 'david@company.com',
    date: '8 hours ago',
    status: 'clean',
    issues: 0,
    critical: 0,
    warnings: 0,
    lines: 342,
  },
  {
    id: 5,
    title: 'Fix memory leak in cache',
    repo: 'company/cache-layer',
    author: 'eve@company.com',
    date: '10 hours ago',
    status: 'reviewed',
    issues: 2,
    critical: 1,
    warnings: 1,
    lines: 89,
  },
]

export default function DashboardPage() {
  const totalReviews = mockReviews.length
  const issuesFound = mockReviews.reduce((acc, r) => acc + r.issues, 0)
  const averageIssuesPerPR = Math.round(issuesFound / totalReviews * 10) / 10

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Review your recent pull requests and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Reviews</p>
              <p className="text-3xl font-bold text-foreground">{totalReviews}</p>
            </div>
            <Eye className="h-6 w-6 text-primary" />
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Issues Found</p>
              <p className="text-3xl font-bold text-foreground">{issuesFound}</p>
            </div>
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Issues/PR</p>
              <p className="text-3xl font-bold text-foreground">{averageIssuesPerPR}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Clean Reviews</p>
              <p className="text-3xl font-bold text-foreground">1</p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Recent Reviews */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recent Reviews</h2>
        </div>

        <div className="space-y-4">
          {mockReviews.map((review) => (
            <Link key={review.id} href={`/dashboard/review/${review.id}`}>
              <Card className="p-6 border border-border hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{review.title}</h3>
                      {review.status === 'clean' ? (
                        <Badge className="bg-green-500/10 text-green-700 border border-green-500/20">
                          Clean
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-700 border border-amber-500/20">
                          {review.issues} Issues
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GitBranch className="h-3 w-3" />
                      {review.repo}
                      <span className="mx-2">•</span>
                      By {review.author}
                      <span className="mx-2">•</span>
                      {review.date}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Lines Changed</p>
                    <p className="font-semibold text-foreground">{review.lines}</p>
                  </div>
                  {review.critical > 0 && (
                    <div>
                      <p className="text-muted-foreground">Critical</p>
                      <p className="font-semibold text-destructive">{review.critical}</p>
                    </div>
                  )}
                  {review.warnings > 0 && (
                    <div>
                      <p className="text-muted-foreground">Warnings</p>
                      <p className="font-semibold text-amber-600">{review.warnings}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Review Time</p>
                    <p className="font-semibold text-foreground">2s</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
