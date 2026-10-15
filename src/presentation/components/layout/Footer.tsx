"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUp, Copy, Check, FileText } from "lucide-react";
import { LinkedinIcon, GithubIcon, FigmaIcon } from "@/presentation/components/ui/Icons";
import { Locale } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";

export interface FooterProps {
  locale?: Locale;
  messages: Messages;
  email: string;
}

export const Footer: React.FC<FooterProps> = ({ messages, email }) => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--surface)] text-[var(--text)] mt-auto">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[var(--border)]">
          {/* Brand & Value statement */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-contrast)] font-bold text-xs">
                B
              </div>
              <span className="font-bold text-base tracking-tight text-[var(--text)]">
                Bayu
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 font-medium">
                {messages.footer.availability}
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-md leading-relaxed">
              {messages.hero.valueStatement}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-mono font-medium text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors min-h-[44px] cursor-pointer"
                aria-label={messages.contact.copyEmail}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--success)]" />
                    <span>{messages.contact.emailCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>{email}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Navigation
            </span>
            <Link
              href="/work"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors py-1"
            >
              {messages.nav.work}
            </Link>
            <Link
              href="/services"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors py-1"
            >
              {messages.nav.services}
            </Link>
            <Link
              href="/about"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors py-1"
            >
              {messages.nav.about}
            </Link>
            <Link
              href="/contact"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors py-1"
            >
              {messages.nav.contact}
            </Link>
            <Link
              href="/admin"
              className="text-xs text-[var(--text-muted)]/70 hover:text-[var(--text-muted)] transition-colors py-1"
            >
              Admin CMS
            </Link>
          </div>

          {/* Connect & Social */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Connect
            </span>
            <a
              href="https://linkedin.com/in/bayu-designer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors py-1 min-h-[36px]"
            >
              <LinkedinIcon className="w-4 h-4 text-[var(--accent)]" />
              LinkedIn
            </a>
            <a
              href="https://github.com/bayu-design"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors py-1 min-h-[36px]"
            >
              <GithubIcon className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://figma.com/@bayu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors py-1 min-h-[36px]"
            >
              <FigmaIcon className="w-4 h-4 text-purple-400" />
              Figma Community
            </a>
            <a
              href="/cv/Bayu-Product-Designer-Resume.pdf"
              download
              className="flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline py-1 min-h-[36px]"
            >
              <FileText className="w-4 h-4" />
              {messages.nav.resume}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)] font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© 2026 Bayu · Generalist Product Designer</p>
            <span className="hidden sm:inline text-[var(--border)]">|</span>
            <p className="text-[11px] text-[var(--text-muted)]">Built to WCAG 2.2 AA · 8px Grid System</p>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-[var(--text)] transition-colors min-h-[44px] px-2 py-1 cursor-pointer font-sans"
            aria-label={messages.footer.backToTop}
          >
            <span>{messages.footer.backToTop}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
