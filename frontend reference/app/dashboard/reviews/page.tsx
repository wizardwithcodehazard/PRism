'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, GitBranch, Calendar, User } from 'lucide-react'

const allReviews = [
  {
    id: 1,
    title: 'Add user authentication flow',
    repo: 'company/auth-service',
    author: 'alice@company.com',
    date: '2 hours ago',
    status: 'reviewed',
    issues: 3,
    critical: 1,
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
  },
  {
    id: 6,
    title: 'Implement caching strategy',
    repo: 'company/api-core',
    author: 'frank@company.com',
    date: '12 hours ago',
    status: 'reviewed',
    issues: 4,
    critical: 0,
  },
  {
    id: 7,
    title: 'Update dependencies',
    repo: 'company/shared',
    author: 'grace@company.com',
    date: '1 day ago',
    status: 'clean',
    issues: 0,
    critical: 0,
  },
  {
    id: 8,
    title: 'Add error logging middleware',
    repo: 'company/api-core',
    author: 'henry@company.com',
    date: '1 day ago',
    status: 'reviewed',
    issues: 2,
    critical: 0,
  },
]

export default function ReviewsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">All Reviews</h1>
        <p className="text-muted-foreground">Browse and manage all code reviews</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      {/* Reviews Table */}
      <div className="space-y-3">
        {allReviews.map((review) => (
          <Link key={review.id} href={`/dashboard/review/${review.id}`}>
            <Card className="p-4 border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-foreground truncate">{review.title}</h3>
                    {review.status === 'clean' ? (
                      <Badge className="bg-green-500/10 text-green-700 border-green-500/20 whitespace-nowrap">
                        Clean
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20 whitespace-nowrap">
                        {review.issues} Issues
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <GitBranch className="h-3 w-3" />
                      {review.repo}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {review.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {review.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  {review.critical > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Critical</p>
                      <p className="text-sm font-semibold text-destructive">{review.critical}</p>
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary hover:bg-primary/10"
                  >
                    View
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
