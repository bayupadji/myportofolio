"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  Database,
  User,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { ThemeToggle } from "@/presentation/components/layout/ThemeToggle";

const routeTitles: Record<string, { title: string; category: string }> = {
  "/admin": { title: "Overview", category: "Studio" },
  "/admin/landing": { title: "Landing Page", category: "Content" },
  "/admin/projects": { title: "Case Studies", category: "Content" },
  "/admin/services": { title: "Freelance Services", category: "Content" },
  "/admin/about": { title: "About & Career", category: "Content" },
  "/admin/messages": { title: "Inbound Messages", category: "Communication" },
};

export const AdminTopBar: React.FC = () => {
  const pathname = usePathname();
  const currentRoute = routeTitles[pathname] || {
    title: pathname.replace("/admin/", "").replace(/^\w/, (c) => c.toUpperCase()),
    category: "Studio",
  };

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md px-4 sm:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <span className="font-semibold">Studio</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            <span className="hidden sm:inline opacity-70">{currentRoute.category}</span>
            <ChevronRight className="hidden sm:inline w-3.5 h-3.5 opacity-40" />
          </div>
          <span className="font-bold text-[var(--text)] tracking-tight">
            {currentRoute.title}
          </span>
        </div>

        {/* Right Status & Actions */}
        <div className="flex items-center gap-3">
          {/* SQLite Engine Status Chip */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[11px] font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]" />
            </span>
            <Database className="w-3 h-3 text-[var(--text-muted)]" />
            <span className="text-[var(--text-muted)]">SQLite · Drizzle</span>
          </div>

          {/* 5-Minute Session Security Chip */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[11px] font-mono text-[var(--text-muted)]"
            title="Sesi otomatis kedaluwarsa setiap 5 menit demi keamanan"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>5m Session</span>
          </div>

          {/* Active User Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--background)]">
            <div className="w-5 h-5 rounded-md bg-[var(--accent)] text-[var(--accent-contrast)] flex items-center justify-center text-[10px] font-bold">
              <User className="w-3 h-3" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[var(--text)] leading-none font-mono">
                skyviadmin
              </span>
              <span className="text-[9px] text-[var(--text-muted)] font-medium leading-tight">
                Owner
              </span>
            </div>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Preview Public Site Button */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--text)] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="hidden sm:inline">Live Site</span>
            <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
          </Link>
        </div>
      </div>
    </header>
  );
};
