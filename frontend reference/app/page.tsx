import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, Zap, BarChart3, GitBranch, Code2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">CodeReview.AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              AI-Powered Code Review
              <span className="block text-primary">for Engineering Teams</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Detect bugs, security vulnerabilities, performance bottlenecks, and code smells automatically. Review PRs in seconds, not hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="px-8">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8">
              View Demo
            </Button>
          </div>

          <div className="pt-8 text-sm text-muted-foreground">
            No credit card required · 14-day free trial
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">Powerful Features</h2>
          <p className="text-muted-foreground">Everything you need to review code efficiently</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
            <AlertCircle className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Bug Detection</h3>
            <p className="text-sm text-muted-foreground">
              Automatically detect logic errors, null pointer exceptions, and common bug patterns.
            </p>
          </Card>

          <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
            <CheckCircle2 className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Security Scan</h3>
            <p className="text-sm text-muted-foreground">
              Find vulnerabilities, unsafe dependencies, and security best practice violations.
            </p>
          </Card>

          <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
            <Zap className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Performance Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Identify performance bottlenecks, memory leaks, and optimization opportunities.
            </p>
          </Card>

          <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
            <GitBranch className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">GitHub Integration</h3>
            <p className="text-sm text-muted-foreground">
              Seamless integration with GitHub. Auto-review every PR instantly.
            </p>
          </Card>

          <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
            <BarChart3 className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Detailed Insights</h3>
            <p className="text-sm text-muted-foreground">
              Get actionable insights with severity levels and fix recommendations.
            </p>
          </Card>

          <Card className="p-6 border border-border hover:border-primary/50 transition-colors">
            <Code2 className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Code Standards</h3>
            <p className="text-sm text-muted-foreground">
              Enforce coding standards, best practices, and team conventions.
            </p>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">10,000+</div>
            <p className="text-muted-foreground">PRs Reviewed Daily</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">500+</div>
            <p className="text-muted-foreground">Active Teams</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">99.9%</div>
            <p className="text-muted-foreground">Uptime SLA</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8 sm:p-12 text-center border border-primary/20 bg-primary/5">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Ready to streamline your code reviews?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join 500+ engineering teams using CodeReview.AI to catch bugs before they reach production.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Start Free Trial
            </Button>
          </Link>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>CodeReview.AI © 2024. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
