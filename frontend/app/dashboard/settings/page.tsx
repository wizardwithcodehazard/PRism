"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, MessageSquare, Shield, Zap, Code2, Bell, Webhook, Check, Key } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getSettings, updateSettings, type UserSettings } from "@/lib/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const update = (key: keyof UserSettings, value: unknown) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-8 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-muted-foreground">Customize how PRism reviews your code</p>
      </div>

      {/* Review Preferences */}
      <Card className="glass border-border/50 p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Review Checks
        </h2>
        <div className="space-y-4">
          {[
            {
              key: "check_security" as keyof UserSettings,
              icon: Shield,
              label: "Security Scanning",
              description: "Detect vulnerabilities, secrets, and security anti-patterns",
              color: "text-red-400",
            },
            {
              key: "check_performance" as keyof UserSettings,
              icon: Zap,
              label: "Performance Analysis",
              description: "Identify N+1 queries, memory leaks, and bottlenecks",
              color: "text-yellow-400",
            },
            {
              key: "check_code_smells" as keyof UserSettings,
              icon: Code2,
              label: "Code Quality & Smells",
              description: "Detect duplicates, dead code, and poor practices",
              color: "text-purple-400",
            },
            {
              key: "auto_post_comments" as keyof UserSettings,
              icon: MessageSquare,
              label: "Auto-Post GitHub Comments",
              description: "Automatically post the AI review as a comment on the PR",
              color: "text-blue-400",
            },
          ].map(({ key, icon: Icon, label, description, color }) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30">
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 ${color}`} />
                <div>
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
              </div>
              <Switch
                checked={settings[key] as boolean}
                onCheckedChange={(val) => update(key, val)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Thresholds */}
      <Card className="glass border-border/50 p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Review Thresholds
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30">
            <div>
              <p className="font-medium text-foreground text-sm">Block PR threshold — Critical issues</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Annotate as blocking if this many critical issues found
              </p>
            </div>
            <Input
              type="number"
              min={1}
              value={settings.block_on_critical}
              onChange={(e) => update("block_on_critical", Number(e.target.value))}
              className="w-20 text-center bg-muted/30 border-border/50"
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30">
            <div>
              <p className="font-medium text-foreground text-sm">Block PR threshold — Warnings</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Annotate as blocking if this many warnings found
              </p>
            </div>
            <Input
              type="number"
              min={1}
              value={settings.block_on_warnings}
              onChange={(e) => update("block_on_warnings", Number(e.target.value))}
              className="w-20 text-center bg-muted/30 border-border/50"
            />
          </div>
        </div>
      </Card>

      {/* Groq API Key */}
      <Card className="glass border-border/50 p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          Groq API Key
          <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">Required</span>
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Provide your own Groq API Key to power the review agent. Your key is stored securely in the database and is never returned in plaintext.
        </p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              Groq API Key
            </label>
            <Input
              type="password"
              placeholder={settings.groq_api_key_set ? "••••••••••••••••••••••••••••••••" : "gsk_..."}
              value={settings.groq_api_key ?? ""}
              onChange={(e) => update("groq_api_key", e.target.value)}
              className="bg-muted/30 border-border/50 font-mono text-sm"
            />
            {settings.groq_api_key_set && (
              <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                Active API key is configured. Enter a new key to overwrite it.
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Discord ChatOps */}
      <Card className="glass border-border/50 p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Webhook className="h-5 w-5 text-primary" />
          Discord Notifications
          <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">Optional</span>
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Get rich Discord embeds with review results posted to your team channel after each review.
        </p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              Discord Webhook URL
            </label>
            <Input
              type="url"
              placeholder="https://discord.com/api/webhooks/..."
              value={settings.discord_webhook_url ?? ""}
              onChange={(e) => update("discord_webhook_url", e.target.value || null)}
              className="bg-muted/30 border-border/50 font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Create a webhook in your Discord server: Channel Settings → Integrations → Webhooks
            </p>
          </div>
        </div>
      </Card>

      {/* Save */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 gap-2 glow-primary"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </Button>
        {saved && (
          <span className="text-sm text-green-400 flex items-center justify-center gap-1.5 animate-fade-in">
            <Check className="h-4 w-4" /> Settings saved!
          </span>
        )}
      </div>
    </div>
  );
}
