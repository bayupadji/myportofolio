"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles } from "lucide-react";
import { Locale } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { useUiStore } from "@/presentation/stores/useUiStore";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export interface HeaderProps {
  locale: Locale;
  messages: Messages;
}

export const Header: React.FC<HeaderProps> = ({ locale, messages }) => {
  const pathname = usePathname();
  const { toggleMobileDrawer } = useUiStore();

  const navLinks = [
    { href: `/${locale}/about`, label: messages.nav.about },
    { href: `/${locale}/work`, label: messages.nav.work },
    { href: `/${locale}/services`, label: messages.nav.services },
    { href: `/${locale}/contact`, label: messages.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md transition-colors">
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Name */}
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-2.5 text-base font-semibold tracking-tight text-[var(--text)] focus-visible:rounded-md"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            B
          </div>
          <span className="flex flex-col">
            <span className="font-bold tracking-tight text-[var(--text)] leading-tight">
              Bayu
            </span>
            <span className="text-[11px] font-medium text-[var(--text-muted)] tracking-wide">
              Product Designer
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== `/${locale}` && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[var(--accent)] bg-[var(--accent)]/10 font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />
          </div>

          <Link
            href={`/${locale}/contact?topic=freelance`}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] text-sm font-semibold hover:opacity-90 transition-all shadow-sm shadow-[var(--accent)]/20 active:scale-[0.98] min-h-[40px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {messages.nav.letsTalk}
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={toggleMobileDrawer}
            className="p-2.5 md:hidden rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)] min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={messages.nav.menu}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
