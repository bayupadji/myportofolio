"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles } from "lucide-react";
import { Locale } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { useUiStore } from "@/presentation/stores/useUiStore";
import { ThemeToggle } from "./ThemeToggle";

export interface HeaderProps {
  locale?: Locale;
  messages: Messages;
}

export const Header: React.FC<HeaderProps> = ({ messages }) => {
  const pathname = usePathname();
  const { toggleMobileDrawer } = useUiStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/about", label: messages.nav.about },
    { href: "/work", label: messages.nav.work },
    { href: "/services", label: messages.nav.services },
    { href: "/contact", label: messages.nav.contact },
  ];

  return (
    <header className="sticky top-2.5 sm:top-4 z-40 w-full px-3 sm:px-4 flex justify-center pointer-events-none transition-all duration-300">
      <a href="#main-content" className="skip-to-content pointer-events-auto">
        Skip to content
      </a>

      {/* Floating Island Capsule with Liquid Glass */}
      <div
        className={`pointer-events-auto relative flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 rounded-full py-1.5 px-2 sm:py-2 sm:px-3 liquid-glass-island transition-all duration-300 max-w-[calc(100vw-1.5rem)] ${isScrolled ? "scrolled" : ""
          }`}
      >
        {/* Specular Liquid Refraction Sheen */}
        <div className="liquid-glass-sheen" aria-hidden="true" />

        {/* Brand / Logo on the Left */}
        <Link
          href="/"
          className="group relative z-10 flex items-center gap-2 sm:gap-2.5 text-sm font-semibold tracking-tight text-[var(--text)] focus-visible:rounded-full py-1 pl-1 pr-2 sm:pr-3 rounded-full hover:bg-[var(--surface-hover)]/60 transition-colors"
          aria-label="Home · Bayu Product Designer"
        >
          <div className="flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] font-bold text-xs sm:text-sm shadow-sm shadow-[var(--accent)]/30 group-hover:scale-105 group-hover:rotate-[-4deg] transition-all duration-200 shrink-0">
            B
          </div>
          <span className="flex flex-col">
            <span className="font-bold tracking-tight text-[var(--text)] leading-tight text-xs sm:text-sm">
              Bayu
            </span>
            <span className="hidden xl:inline text-[10px] font-medium text-[var(--text-muted)] tracking-wide leading-none">
              Product Designer
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-0.5 p-1 rounded-full liquid-nav-track relative z-10"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${isActive
                  ? "text-[var(--accent-contrast)] bg-[var(--accent)] shadow-sm shadow-[var(--accent)]/30 font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]/70"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* CTA: Discuss project / Let's talk */}
          <Link
            href="/contact?topic=freelance"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] text-xs sm:text-sm font-semibold hover:opacity-95 shadow-sm shadow-[var(--accent)]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] shrink-0 min-h-[36px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{messages.nav.letsTalk}</span>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={toggleMobileDrawer}
            data-testid="mobile-menu-btn"
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)]/70 bg-[var(--surface)]/40 text-[var(--text)] hover:bg-[var(--surface)]/70 hover:border-[var(--accent)] transition-all cursor-pointer shrink-0 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 backdrop-blur-sm"
            aria-label={messages.nav.menu}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

