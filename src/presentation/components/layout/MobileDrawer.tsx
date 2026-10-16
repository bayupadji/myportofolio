"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowRight, FileText } from "lucide-react";
import { useUiStore } from "@/presentation/stores/useUiStore";
import { Locale } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { ThemeToggle } from "./ThemeToggle";

export interface MobileDrawerProps {
  locale?: Locale;
  messages: Messages;
  cvUrl?: string;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  messages,
  cvUrl = "/cv/Bayu-Product-Designer-Resume.pdf",
}) => {
  const { isMobileDrawerOpen, setMobileDrawerOpen } = useUiStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileDrawerOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
  }, [isMobileDrawerOpen, setMobileDrawerOpen]);

  // Close drawer upon route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname, setMobileDrawerOpen]);

  if (!isMobileDrawerOpen) return null;

  const navLinks = [
    { href: "/work", label: messages.nav.work },
    { href: "/services", label: messages.nav.services },
    { href: "/about", label: messages.nav.about },
    { href: "/contact", label: messages.nav.contact },
  ];

  return (
    <div
      role="dialog"
      data-testid="mobile-drawer"
      aria-modal="true"
      aria-label="Navigation drawer"
      className="fixed inset-0 z-50 flex sm:hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setMobileDrawerOpen(false)}
    >
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className="ml-auto w-[85%] max-w-sm h-full bg-[var(--surface)] border-l border-[var(--border)] p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250"
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-[var(--border)]">
            <span className="font-bold text-lg tracking-tight text-[var(--text)]">
              Bayu · <span className="text-xs font-medium text-[var(--accent)]">UI/UX</span>
            </span>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="p-2.5 rounded-[16px] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)] min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={messages.nav.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-2" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-[16px] text-lg font-medium transition-colors min-h-[48px] ${
                    isActive
                      ? "bg-[var(--accent)]/10 text-[var(--accent)] font-semibold"
                      : "text-[var(--text)] hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  {link.label}
                  <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[var(--border)] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)] font-medium">Theme Mode</span>
            <ThemeToggle />
          </div>

          <a
            href={cvUrl}
            download
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-[16px] border border-[var(--border)] text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-hover)] min-h-[44px]"
          >
            <FileText className="w-4 h-4 text-[var(--accent)]" />
            {messages.nav.resume}
          </a>

          <Link
            href="/contact?topic=freelance"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-[16px] bg-[var(--accent)] text-[var(--accent-contrast)] text-sm font-semibold hover:opacity-90 min-h-[44px]"
          >
            {messages.nav.letsTalk}
          </Link>
        </div>
      </div>
    </div>
  );
};
