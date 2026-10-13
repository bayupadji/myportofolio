"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  UserCheck,
  Briefcase,
  Mail,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
      exact: true,
    },
    {
      label: "Projects",
      href: "/admin/projects",
      icon: FolderGit2,
      badge: projectCount > 0 ? projectCount : null,
      exact: false,
    },
    {
      label: "Profile & Bio",
      href: "/admin/profile",
      icon: UserCheck,
      badge: null,
      exact: false,
    },
    {
      label: "Experience & Services",
      href: "/admin/experience",
      icon: Briefcase,
      badge: null,
      exact: false,
    },
    {
      label: "Inbound Messages",
      href: "/admin/messages",
      icon: Mail,
      badge: unreadMessageCount > 0 ? unreadMessageCount : null,
      badgeColor: "bg-[var(--accent)] text-[var(--accent-contrast)]",
      exact: false,
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

  const isItemActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[var(--surface)] border-r border-[var(--border)] w-64 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-[var(--text)] leading-tight">
              Portfolio CMS
            </div>
            <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
              <span>Bayu</span>
              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] opacity-50" />
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-zinc-500/10 text-zinc-500">
                Owner
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Manajemen Konten
        </div>

        {navItems.map((item) => {
          const active = isItemActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                active
                  ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? "text-current" : "text-[var(--text-muted)]"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    active
                      ? "bg-white/20 text-white"
                      : item.badgeColor || "bg-[var(--surface-hover)] text-[var(--text)] border border-[var(--border)]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Status / Actions */}
      <div className="p-3 border-t border-[var(--border)] space-y-2 bg-[var(--background)]/50">
        {/* Availability Badge */}
        <div className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)] text-[11px]">Ketersediaan:</span>
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

        {/* Public Portfolio Link */}
        <Link
          href="/en"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] rounded-xl transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Web Publik</span>
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">/en</span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-[var(--error)] hover:bg-[var(--error)]/10 rounded-xl transition-colors text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{isLoggingOut ? "Keluar..." : "Keluar Dashboard"}</span>
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

      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[var(--accent)]" />
          <span className="font-bold text-sm text-[var(--text)]">Portfolio CMS</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)]"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
