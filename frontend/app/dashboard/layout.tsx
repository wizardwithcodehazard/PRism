"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  GitPullRequest,
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMe, logout, type User } from "@/lib/api";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/reviews", icon: History, label: "Review History" },
  { href: "/dashboard/new-review", icon: GitPullRequest, label: "New Review" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // If we just logged in, the token will be in the URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      localStorage.setItem("prism_token", tokenParam);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    getMe()
      .then(setUser)
      .catch(() => {
        // If it fails, clear invalid token and redirect
        localStorage.removeItem("prism_token");
        router.push("/");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    }
    localStorage.removeItem("prism_token");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          Loading PRism...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#06060c] overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-black/40 backdrop-blur-md shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/prismlogo.png" alt="PRism Logo" className="h-8 w-8 object-contain" />
            <span className="font-bold text-foreground text-lg">PRism</span>
          </Link>
        </div>

        {/* User info */}
        {user && (
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              {user.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="h-8 w-8 rounded-full border border-white/10"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {user.login[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name ?? user.login}</p>
                <p className="text-xs text-muted-foreground truncate">@{user.login}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 text-sm h-10 ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                  {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sm h-10 text-muted-foreground hover:text-foreground hover:bg-white/5"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay Drawer ── */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-white/10 bg-[#06060c]/95 backdrop-blur-xl animate-in slide-in-from-left duration-200">
            {/* Close button & Logo */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsMobileMenuOpen(false)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/prismlogo.png" alt="PRism Logo" className="h-8 w-8 object-contain" />
                <span className="font-bold text-foreground text-lg">PRism</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 -mr-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User info */}
            {user && (
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar_url}
                      alt={user.login}
                      className="h-8 w-8 rounded-full border border-white/10"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {user.login[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name ?? user.login}</p>
                    <p className="text-xs text-muted-foreground truncate">@{user.login}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 text-sm h-10 ${
                        isActive
                          ? "bg-primary/15 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                      {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-white/5">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sm h-10 text-muted-foreground hover:text-foreground hover:bg-white/5"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Sign Out
              </Button>
            </div>
          </aside>
        </>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto relative flex flex-col h-full" data-lenis-prevent>
        {/* Mobile Sticky Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/prismlogo.png" alt="PRism Logo" className="h-6 w-6 object-contain" />
            <span className="font-bold text-foreground text-sm">PRism</span>
          </div>
          <div className="w-8 h-8 flex items-center justify-end">
            {user?.avatar_url && (
              <img
                src={user.avatar_url}
                alt={user.login}
                className="h-6 w-6 rounded-full border border-white/10"
              />
            )}
          </div>
        </div>

        {/* Background Glow Effects */}
        <div className="glow-bg absolute inset-0 -z-10 pointer-events-none">
          <div className="glow-orb-1 top-[-20%] left-[-10%]" />
          <div className="glow-orb-2 top-[40%] right-[-10%]" />
          <div className="glow-orb-1 bottom-[-20%] left-[20%]" />
        </div>
        
        <div className="relative z-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
