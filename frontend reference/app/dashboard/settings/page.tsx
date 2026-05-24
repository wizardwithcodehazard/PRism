'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Github, ChevronRight, Save } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and integration settings</p>
      </div>

      {/* GitHub Integration */}
      <Card className="p-6 border border-border mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">GitHub Integration</h2>
          <p className="text-sm text-muted-foreground">Connect and manage your GitHub repositories</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Github className="h-6 w-6 text-foreground" />
              <div>
                <p className="font-semibold text-foreground">Connected Account</p>
                <p className="text-sm text-muted-foreground">alice@company.com</p>
              </div>
            </div>
            <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Connected</Badge>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm font-semibold text-foreground mb-3">Repositories</p>
            <div className="space-y-2">
              {['company/auth-service', 'company/api-core', 'company/payments'].map((repo) => (
                <div key={repo} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-foreground">{repo}</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20">Active</Badge>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Manage Repositories
          </Button>
        </div>
      </Card>

      {/* Review Preferences */}
      <Card className="p-6 border border-border mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Review Preferences</h2>
          <p className="text-sm text-muted-foreground">Configure how CodeReview.AI analyzes your code</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="font-semibold text-foreground">Security Scanning</p>
              <p className="text-sm text-muted-foreground">Detect vulnerabilities and security issues</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="font-semibold text-foreground">Performance Analysis</p>
              <p className="text-sm text-muted-foreground">Identify performance bottlenecks</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="font-semibold text-foreground">Code Smell Detection</p>
              <p className="text-sm text-muted-foreground">Detect code quality issues</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="font-semibold text-foreground">Auto-Post Comments</p>
              <p className="text-sm text-muted-foreground">Automatically post review comments on PRs</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="font-semibold text-foreground">Notify on Critical Issues</p>
              <p className="text-sm text-muted-foreground">Send alerts for critical vulnerabilities</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Review Thresholds */}
      <Card className="p-6 border border-border mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Review Thresholds</h2>
          <p className="text-sm text-muted-foreground">Set severity levels for automatic PR blocking</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">
              Block PR if Critical Issues Found
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                defaultValue={1}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">or more critical issues</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">
              Block PR if Warning Count Exceeds
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                defaultValue={5}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">or more warnings</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Code Style Rules */}
      <Card className="p-6 border border-border mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Code Style Rules</h2>
          <p className="text-sm text-muted-foreground">Enforce your team&apos;s code standards</p>
        </div>

        <div className="space-y-3">
          {['ESLint Configuration', 'Prettier Rules', 'TypeScript Strict Mode', 'Test Coverage Minimum'].map((rule) => (
            <div key={rule} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-foreground">{rule}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </Card>

      {/* Save */}
      <div className="flex gap-3">
        <Button size="lg" className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
        <Button size="lg" variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  )
}
