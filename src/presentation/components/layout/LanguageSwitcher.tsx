"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Locale } from "@/domain/value-objects/LocalizedText";

export interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLocale }) => {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Replace current locale segment in pathname
    let newPath = pathname;
    if (pathname.startsWith(`/${currentLocale}`)) {
      newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    } else {
      newPath = `/${newLocale}${pathname}`;
    }

    // Save preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.push(newPath);
  };

  return (
    <div
      role="group"
      aria-label="Language selection"
      className="inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1 text-xs font-semibold"
    >
      <button
        onClick={() => switchLocale("en")}
        aria-pressed={currentLocale === "en"}
        className={`px-2.5 py-1.5 rounded-md transition-all min-h-[32px] ${
          currentLocale === "en"
            ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-sm"
            : "text-[var(--text-muted)] hover:text-[var(--text)]"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("id")}
        aria-pressed={currentLocale === "id"}
        className={`px-2.5 py-1.5 rounded-md transition-all min-h-[32px] ${
          currentLocale === "id"
            ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-sm"
            : "text-[var(--text-muted)] hover:text-[var(--text)]"
        }`}
      >
        ID
      </button>
    </div>
  );
};
