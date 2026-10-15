"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  UserCheck,
  Mail,
  ExternalLink,
  LogOut,
  Layers,
  Home,
  CheckCircle2,
  Palette,
  Lock,
  X,
} from "lucide-react";

import { useUiStore } from "@/presentation/stores/useUiStore";

interface AdminSidebarProps {
  projectCount?: number;
  unreadMessageCount?: number;
  isAvailable?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  projectCount = 0,
  unreadMessageCount = 0,
  isAvailable = true,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminDrawerOpen: mobileOpen, setAdminDrawerOpen: setMobileOpen } = useUiStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navGroups = [
    {
      title: "Workspace",
      items: [
        {
          label: "Studio Overview",
          href: "/admin",
          icon: LayoutDashboard,
          badge: null,
          exact: true,
        },
      ],
    },
    {
      title: "Content & Design",
      items: [
        {
          label: "Landing Page",
          href: "/admin/landing",
          icon: Home,
          badge: null,
          exact: false,
        },
        {
          label: "Case Studies",
          href: "/admin/projects",
          icon: FolderGit2,
          badge: projectCount > 0 ? projectCount : null,
          badgeColor: "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20",
          exact: false,
        },
        {
          label: "Services",
          href: "/admin/services",
          icon: Layers,
          badge: null,
          exact: false,
        },
        {
          label: "About & Career",
          href: "/admin/about",
          icon: UserCheck,
          badge: null,
          exact: false,
        },
      ],
    },
    {
      title: "Communication",
      items: [
        {
          label: "Inbound Messages",
          href: "/admin/messages",
          icon: Mail,
          badge: unreadMessageCount > 0 ? unreadMessageCount : null,
          badgeColor: "bg-[var(--accent)] text-[var(--accent-contrast)]",
          exact: false,
        },
      ],
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isItemActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[var(--surface)] border-r border-[var(--border)] w-64 select-none">
      {/* Brand & Studio Header */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 group min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <Palette className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-[var(--text)] tracking-tight truncate">
                  Bayu · Studio CMS
                </span>
                <span className="text-[9px] font-mono font-semibold px-1 py-0.2 rounded bg-[var(--accent)]/10 text-[var(--accent)]">
                  Pro
                </span>
              </div>
              <div className="text-[10px] text-[var(--text-muted)] truncate flex items-center gap-1">
                <span>UI/UX Portfolio</span>
                <span>&bull;</span>
                <span className="text-[var(--success)] font-medium">SQLite DB</span>
              </div>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] cursor-pointer shrink-0 ml-2"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="mt-3 p-2 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center gap-2.5">
          <div className="relative">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] font-bold text-xs flex items-center justify-center font-mono">
              SA
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--success)] ring-2 ring-[var(--surface)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-[var(--text)] font-mono leading-tight truncate">
              skyviadmin
            </div>
            <div className="text-[10px] text-[var(--text-muted)] truncate leading-tight">
              Owner · Lead Designer
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]/70">
              {group.title}
            </div>
            {group.items.map((item) => {
              const active = isItemActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active ? "text-current" : "text-[var(--text-muted)]"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md tabular-nums shrink-0 ${
                        active
                          ? "bg-white/20 text-white"
                          : item.badgeColor ||
                            "bg-[var(--surface-hover)] text-[var(--text)] border border-[var(--border)]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer / Status & Engine Specs */}
      <div className="p-3 border-t border-[var(--border)] space-y-2 bg-[var(--background)]/40">
        {/* Availability Status */}
        <div className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)] text-[11px] font-medium">Availability:</span>
          <span
            className={`font-semibold text-[11px] flex items-center gap-1.5 ${
              isAvailable ? "text-[var(--success)]" : "text-amber-500"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailable ? "bg-[var(--success)] animate-pulse" : "bg-amber-500"
              }`}
            />
            {isAvailable ? "Open" : "Limited"}
          </span>
        </div>

        {/* Database & Session security specs indicator */}
        <div className="px-3 py-1.5 rounded-xl border border-[var(--border)]/60 bg-[var(--background)] flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
          <span className="flex items-center gap-1.5" title="Sesi login otomatis kedaluwarsa setelah 5 menit">
            <Lock className="w-3 h-3 text-[var(--accent)]" />
            <span>Sesi: 5 Menit</span>
          </span>
          <span className="flex items-center gap-1 text-[var(--success)]">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>SQLite WAL</span>
          </span>
        </div>

        {/* Public Portfolio Link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] rounded-xl transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">/</span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-[var(--error)] hover:bg-[var(--error)]/10 rounded-xl transition-colors text-left cursor-pointer disabled:opacity-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay (Triggered via Zustand from AdminTopBar) */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="h-full shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
