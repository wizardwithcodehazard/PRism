'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, AlertTriangle, AlertCircle, CheckCircle2, Code2, Copy } from 'lucide-react'

const mockIssues = [
  {
    id: 1,
    file: 'src/auth/login.ts',
    line: 42,
    severity: 'critical',
    type: 'Security Vulnerability',
    message: 'Potential SQL injection detected in query builder',
    suggestion: 'Use parameterized queries instead of string interpolation',
    code: 'const query = `SELECT * FROM users WHERE email = ${email}`',
    fix: 'const query = db.query("SELECT * FROM users WHERE email = $1", [email])',
  },
  {
    id: 2,
    file: 'src/auth/login.ts',
    line: 56,
    severity: 'warning',
    type: 'Performance Issue',
    message: 'Missing error handling in async function',
    suggestion: 'Add try-catch block to handle potential errors',
    code: 'await authenticateUser(credentials)',
    fix: 'try {\n  await authenticateUser(credentials)\n} catch (error) {\n  handleError(error)\n}',
  },
  {
    id: 3,
    file: 'src/auth/utils.ts',
    line: 18,
    severity: 'warning',
    type: 'Code Smell',
    message: 'Function exceeds recommended length (45 lines)',
    suggestion: 'Consider breaking this function into smaller, reusable components',
    code: 'export function validateAndProcessUserData(...) { ... }',
    fix: 'Split into: validateUserData() and processUserData()',
  },
  {
    id: 4,
    file: 'src/auth/login.ts',
    line: 28,
    severity: 'info',
    type: 'Best Practice',
    message: 'Consider using const instead of let for immutable data',
    suggestion: 'Change let to const for variables that are not reassigned',
    code: 'let token = null',
    fix: 'const token = generateToken()',
  },
]

export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  const criticalCount = mockIssues.filter(i => i.severity === 'critical').length
  const warningCount = mockIssues.filter(i => i.severity === 'warning').length
  const infoCount = mockIssues.filter(i => i.severity === 'info').length

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 text-red-700 border-red-500/20'
      case 'warning':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20'
      case 'info':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20'
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />
      case 'warning':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <CheckCircle2 className="h-4 w-4" />
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2 mb-6">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">Add user authentication flow</h1>
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <span>PR #2847</span>
          <span>•</span>
          <span>company/auth-service</span>
          <span>•</span>
          <span>alice@company.com</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-foreground">{criticalCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Warnings</p>
              <p className="text-2xl font-bold text-foreground">{warningCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Info</p>
              <p className="text-2xl font-bold text-foreground">{infoCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lines Changed</p>
              <p className="text-2xl font-bold text-foreground">245</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Issues */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Review Comments</h2>

        <div className="space-y-4">
          {mockIssues.map((issue) => (
            <Card key={issue.id} className="p-6 border border-border">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${getSeverityColor(issue.severity).split(' ')[0]} ${getSeverityColor(issue.severity).split(' ')[1]} ${getSeverityColor(issue.severity).split(' ')[2]}`}>
                      {getSeverityIcon(issue.severity)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{issue.type}</h3>
                        <Badge className={`${getSeverityColor(issue.severity)}`}>
                          {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {issue.file}:{issue.line}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-foreground mb-3">{issue.message}</p>
                <p className="text-sm text-muted-foreground mb-4">{issue.suggestion}</p>
              </div>

              {/* Code Block */}
              <div className="bg-muted/50 rounded-lg p-4 mb-4 space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground font-mono">Current Code</p>
                  <Button size="sm" variant="ghost" className="h-7 gap-1">
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                </div>
                <pre className="text-xs text-foreground overflow-x-auto">
                  <code>{issue.code}</code>
                </pre>
              </div>

              {/* Suggested Fix */}
              <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <p className="text-xs text-green-700 font-semibold">Suggested Fix</p>
                </div>
                <pre className="text-xs text-green-700 font-mono overflow-x-auto">
                  <code>{issue.fix}</code>
                </pre>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
