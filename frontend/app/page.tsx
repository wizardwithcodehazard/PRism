"use client";

import Link from "next/link";
import Image from "next/image";
import {
  GitPullRequest,
  ShieldCheck,
  Zap,
  Bug,
  BarChart3,
  MessageSquareCode,
  ArrowRight,
  Sparkles,
  Workflow,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";

// @ts-ignore
import agentImg from "@/assets/AI Agents Work, But Why Aren’t They Mainstream Yet_.jpg";
// @ts-ignore
import metricsImg from "@/assets/download (12).jpg";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const features = [
  {
    icon: Bug,
    title: "Bug Detection",
    description: "Catches logic errors, null dereferences, and off-by-one bugs before they hit production.",
  },
  {
    icon: ShieldCheck,
    title: "Security Scanning",
    description: "Finds SQL injection, XSS, and hardcoded secrets automatically.",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Identifies N+1 queries, memory leaks, and blocking calls in your async code.",
  },
  {
    icon: MessageSquareCode,
    title: "Code Smells",
    description: "Surfaces dead code, duplicated logic, and missing error handling effortlessly.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50, damping: 20 } }
};

export default function LandingPage() {
  const loginUrl = `${API}/auth/login`;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">

      {/* ── Background Glow Effects ── */}
      <div className="glow-bg">
        <div className="glow-orb-1 top-[-20%] left-[-10%]" />
        <div className="glow-orb-2 top-[40%] right-[-10%]" />
        <div className="glow-orb-1 bottom-[-20%] left-[20%]" />
      </div>

      {/* ── Navigation ── */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b-0 border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between relative">
          <div className="flex items-center gap-3 z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/prismlogo.png" alt="PRism Logo" className="h-8 w-8 md:h-10 md:w-10 object-contain" />
            <span className="text-lg md:text-xl font-semibold tracking-tight text-white">PRism</span>
          </div>

          {/* Centered Links */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium text-white/70">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#integrations" className="hover:text-white transition-colors">Integrations</Link>
            <Link href="#cta" className="hover:text-white transition-colors">Get Started</Link>
          </div>

          <div className="flex items-center gap-4 z-10">
            <a href={loginUrl} className="hidden sm:block text-sm font-medium text-white/80 hover:text-white transition-colors">
              Sign In
            </a>
            <a href={loginUrl} className="glass-button px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium text-white flex items-center gap-2">
              Start Free <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-28 md:pt-32 pb-20 px-6 z-10 flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-white/80">Next-Gen AI for Code Review</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="font-zen text-3xl min-[400px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 leading-tight">
            SHIP CODE
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-white">WITH CONFIDENCE</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/60 max-w-2xl mb-12 leading-relaxed">
            Stay ahead of bugs with AI-powered insights. Our platform continuously monitors your pull requests, delivers real-time security analysis, and ensures compliance with global standards.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a href={loginUrl} className="glass-button px-8 py-4 rounded-full text-base font-semibold text-white flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Connect GitHub
            </a>
            <a href="https://youtu.be/Jrcm1ZLZykY?si=tG5CdarWZHFmmqTX" className="glass-card px-8 py-4 rounded-full text-base font-semibold text-white/90 hover:text-white transition-colors flex items-center justify-center">
              View Live Demo
            </a>
          </motion.div>
        </motion.div>

        {/* ── Dashboard Mockup / Image Showcase ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
          className="w-full max-w-5xl mt-16 md:mt-24 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent blur-3xl -z-10 rounded-full" />
          <div className="glass-card rounded-2xl p-2 md:p-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Showcasing the provided image */}
            <Image
              src={agentImg}
              alt="AI Agents Workflow"
              className="w-full h-auto rounded-xl border border-white/10"
              priority
            />
          </div>
        </motion.div>
      </section>

      {/* ── Features Bento Grid ── */}
      <section id="features" className="relative py-16 md:py-24 px-6 z-10 scroll-mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card mb-4 border-purple-500/30">
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Features</span>
            </div>
            <h2 className="font-zen text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Power Features to Supercharge<br />Your Workflow
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              PRism is packed with smart, scalable features designed to simplify code reviews and boost team efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
            {/* Large Card spanning 2 columns and 2 rows */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl pt-6 px-6 md:pt-8 md:px-8 flex flex-col md:col-span-2 md:row-span-2 group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-colors" />
              <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Scale Without the Scream</h3>
              <p className="text-white/60 mb-6 relative z-10 max-w-md">Whether you have 10 developers or 10,000, PRism grows with you—minus the tech headaches.</p>

              <div className="mt-auto -mx-8 relative z-10 overflow-hidden flex items-end">
                <Image
                  src={metricsImg}
                  alt="Metrics and Analytics"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </motion.div>

            {/* Normal Card: Automate Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-3xl p-6 md:p-8 flex flex-col group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform relative z-10">
                <Workflow className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Automate Reviews</h3>
              <p className="text-white/60 relative z-10 mb-8">No configuration required. PRism integrates directly into your GitHub Actions instantly.</p>

              {/* Decorative UI */}
              <div className="mt-auto relative z-10">
                <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                  <div className="h-8 w-8 rounded bg-purple-500/20 flex items-center justify-center">
                    <GitPullRequest className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-16 bg-white/20 rounded-full mb-1.5" />
                    <div className="h-1.5 w-10 bg-white/10 rounded-full" />
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                </div>
                <div className="w-[2px] h-4 bg-white/10 ml-7" />
                <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5 opacity-70">
                  <div className="h-8 w-8 rounded bg-white/5 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white/50" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-20 bg-white/10 rounded-full mb-1.5" />
                    <div className="h-1.5 w-12 bg-white/5 rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature Card: Bug Detection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-3xl p-6 md:p-8 flex flex-col group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform relative z-10">
                <Bug className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Bug Detection</h3>
              <p className="text-white/60 relative z-10 mb-8">Catches logic errors, null dereferences, and off-by-one bugs before they hit production.</p>

              {/* Decorative UI */}
              <div className="mt-auto relative z-10 bg-[#0d0d0d] rounded-xl border border-white/5 p-4 font-mono text-[10px] leading-relaxed overflow-hidden">
                <div className="text-white/30 mb-2">12 | function process(data) {'{'}</div>
                <div className="text-white/30">13 |   if (!data) return;</div>
                <div className="relative mt-1">
                  <div className="absolute inset-0 bg-red-500/10 rounded" />
                  <div className="text-red-300 relative z-10 px-1">14 |   return data.user.id; // TypeError</div>
                  <div className="absolute -bottom-1 left-8 w-12 h-[2px] bg-red-500 blur-[1px]" />
                </div>
                <div className="text-white/30 mt-1">15 | {'}'}</div>
              </div>
            </motion.div>

            {/* Feature Card: Security Scanning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-3xl p-6 md:p-8 flex flex-col group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-500/10 blur-3xl rounded-full" />
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform relative z-10">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Security Scanning</h3>
              <p className="text-white/60 relative z-10 mb-8">Finds SQL injection, XSS, and hardcoded secrets automatically.</p>

              {/* Decorative UI */}
              <div className="mt-auto relative z-10 flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                  <div className="h-16 w-16 rounded-full border border-green-500/30 flex items-center justify-center relative bg-black/50">
                    <ShieldCheck className="h-8 w-8 text-green-400" />
                  </div>
                  {/* Circular scan line */}
                  <svg className="absolute inset-0 w-full h-full animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(74,222,128,0.5)" strokeWidth="1" strokeDasharray="150 200" />
                  </svg>
                </div>
                <div className="mt-4 text-xs font-medium text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                  0 Vulnerabilities
                </div>
              </div>
            </motion.div>

            {/* Feature Card: Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-3xl p-6 md:p-8 flex flex-col group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform relative z-10">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Performance</h3>
              <p className="text-white/60 relative z-10 mb-8">Identifies N+1 queries, memory leaks, and blocking calls in your async code.</p>

              {/* Decorative UI */}
              <div className="mt-auto relative z-10 flex items-end h-24 gap-1.5 w-full">
                {[40, 70, 45, 90, 65, 85, 55, 100, 75, 50].map((height, idx) => (
                  <div key={idx} className="flex-1 h-full bg-white/5 rounded-t-md relative group-hover:bg-white/10 transition-colors overflow-hidden">
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md transition-all duration-700"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Feature Card: Code Smells */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-3xl p-6 md:p-8 flex flex-col group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform relative z-10">
                <MessageSquareCode className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Code Smells</h3>
              <p className="text-white/60 relative z-10 mb-8">Surfaces dead code, duplicated logic, and missing error handling effortlessly.</p>

              {/* Decorative UI */}
              <div className="mt-auto relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between bg-white/5 px-4 py-2.5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                    <div className="h-2 w-16 bg-white/20 rounded-full" />
                  </div>
                  <div className="h-4 w-4 rounded-full bg-white/10 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white/30" />
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    <div className="h-2 w-20 bg-white/20 rounded-full" />
                  </div>
                  <div className="h-4 w-4 rounded-full bg-white/10 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white/30" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Integrations & ChatOps ── */}
      <section id="integrations" className="relative py-16 md:py-24 px-6 z-10 scroll-mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card mb-4 border-purple-500/30">
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Connected Ecosystem</span>
            </div>
            <h2 className="font-zen text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              ChatOps & Git Workflow
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              PRism operates directly inside your team's existing developer environment. No need to monitor a secondary dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* GitHub Inline Comments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group"
            >
              <div>
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3 block">GitHub PR Comments</span>
                <h3 className="text-2xl font-bold text-white mb-4">Inline Pull Request Reviews</h3>
                <p className="text-white/60 mb-8">
                  PRism writes feedback and precise code changes directly onto the target lines of your GitHub Pull Requests, letting developers apply fixes in one click.
                </p>
              </div>

              {/* GitHub Mockup */}
              <div className="bg-[#0c0c0f] border border-white/10 rounded-2xl p-5 font-sans relative shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">PR</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">prism-ai</span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">bot</span>
                    </div>
                    <span className="text-[11px] text-white/40">commented on lines 42-45</span>
                  </div>
                </div>

                <div className="bg-black/50 border border-white/5 rounded-xl p-3 mb-4 font-mono text-[11px] leading-relaxed">
                  <span className="text-red-400/90">- const user = fetchUser(id);</span>
                  <br />
                  <span className="text-green-400/90">+ const user = await fetchUser(id); // Fixed missing await</span>
                </div>

                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  <span className="font-semibold text-purple-400">Warning:</span> Calling an asynchronous function without the <code className="text-purple-300 bg-purple-500/10 px-1 py-0.5 rounded font-mono">await</code> keyword returns a Promise instance rather than the payload. This will break downstream logic.
                </p>

                <div className="flex items-center gap-3">
                  <button className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-colors shadow-md">
                    Apply Suggestion
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 font-medium text-xs transition-colors border border-white/10">
                    Reply
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Discord Webhook Embed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group"
            >
              <div>
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3 block">Discord Integration</span>
                <h3 className="text-2xl font-bold text-white mb-4">Instant ChatOps Webhooks</h3>
                <p className="text-white/60 mb-8">
                  Keep your team aligned by broadcasting high-fidelity review metrics, quality scores, and critical counts directly to your Discord channels.
                </p>
              </div>

              {/* Discord Mockup */}
              <div className="bg-[#2f3136] rounded-2xl p-5 font-sans relative shadow-2xl text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">PR</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">PRism AI</span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">BOT</span>
                    </div>
                  </div>
                </div>

                {/* Discord Embed */}
                <div className="border-l-4 border-purple-500 bg-[#2f3136] pl-3 sm:pl-4 py-1">
                  <h4 className="text-sm font-bold hover:underline cursor-pointer text-[#00b0f4] mb-2 break-words">
                    [wizardwithcodehazard/PRism] New Review: PR #18
                  </h4>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs mb-3">
                    <div>
                      <span className="text-white/40 block uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider">Quality Score</span>
                      <span className="font-bold text-green-400">87 / 100</span>
                    </div>
                    <div className="sm:border-l sm:border-white/10 sm:pl-4">
                      <span className="text-white/40 block uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider">Issues Found</span>
                      <span className="font-semibold text-white/95">Critical: 1  •  Warning: 3  •  Info: 5</span>
                    </div>
                  </div>

                  <p className="text-xs text-white/80 leading-relaxed mb-3">
                    <span className="font-semibold text-purple-400">AI Summary:</span> Identified 1 critical missing await keyword, 3 lint warnings, and 5 minor refactoring candidates. Security scans passed.
                  </p>

                  <div className="text-[11px] text-white/40">
                    Reviewed by PRism • Today at 3:45 PM
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" className="relative py-16 md:py-24 px-6 z-10 text-center scroll-mt-20">
        <div className="max-w-5xl mx-auto glass-card rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-purple-500/20 to-transparent" />
          <h2 className="font-zen text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6 relative z-10">
            Ready to dive in?<br className="hidden md:block" /> Start your journey today.
          </h2>
          <p className="text-white/60 mb-10 relative z-10">
            Connect your repository and track code performance with seamless automation.
          </p>
          <a href={loginUrl} className="glass-button px-10 py-4 rounded-full text-lg font-semibold text-white inline-flex items-center gap-2 relative z-10">
            Get started <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative border-t border-white/10 py-10 md:py-16 px-6 z-10 bg-black/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/prismlogo.png" alt="PRism Logo" className="h-10 w-10 object-contain" />
              <span className="text-xl font-semibold text-white">PRism</span>
            </div>
            <p className="text-sm text-white/50 max-w-sm leading-relaxed">
              Next-gen AI code review for modern engineering teams. Ship your pull requests with zero bugs and total confidence.
            </p>
            <p className="text-sm text-white/30 mt-4">© {new Date().getFullYear()} PRism AI. All rights reserved.</p>
          </div>

          <div className="flex flex-col gap-6 w-full md:w-auto">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Creators</h4>
            <div className="flex flex-col sm:flex-row gap-4">

              <div className="flex items-center justify-between gap-8 bg-white/5 px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-sm font-medium text-white/90">Sahil Rane</span>
                <div className="flex items-center gap-4 text-white/40">
                  <a href="https://www.linkedin.com/in/sahilrane8" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110 transition-all">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </a>
                  <a href="https://github.com/wizardwithcodehazard" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110 transition-all">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                  </a>
                  <a href="https://sahilrane.pages.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110 transition-all"><Globe className="h-4 w-4" /></a>
                </div>
              </div>

              <div className="flex items-center justify-between gap-8 bg-white/5 px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-sm font-medium text-white/90">Vedant Patil</span>
                <div className="flex items-center gap-4 text-white/40">
                  <a href="https://www.linkedin.com/in/vedant-patil-933190330/" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110 transition-all">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </a>
                  <a href="https://github.com/Vedant180205" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110 transition-all">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                  </a>
                  <a href="https://portfolio-vedant-patil.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110 transition-all"><Globe className="h-4 w-4" /></a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
