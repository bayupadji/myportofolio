import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Locale } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { CardSpotlight } from "@/presentation/components/ui/CardSpotlight";

import { CtaBannerContent } from "@/domain/entities/Profile";

export interface CtaCardSectionProps {
  locale?: Locale;
  messages: Messages;
  className?: string;
  customContent?: CtaBannerContent;
}

/**
 * High-impact CTA banner formatted as an elevated spotlight card with hover lift.
 * Displayed at the bottom of pages (Home, About, Services, Work, Case Studies) to drive contact conversions.
 */
export const CtaCardSection: React.FC<CtaCardSectionProps> = ({
  locale,
  messages,
  className = "",
  customContent,
}) => {
  const isId = locale === "id";

  const badgeText = customContent?.badge?.en || (isId ? "Tersedia untuk Peluang Baru" : "Open to New Opportunities");
  const headlineText = customContent?.headline?.en || (isId ? "Punya proyek produk atau peran yang ingin didiskusikan?" : "Have a product challenge or an open role to discuss?");
  const descriptionText = customContent?.description?.en || (isId ? "Saya siap membantu mentransformasi ide menjadi produk digital yang intuitif, cepat, dan berdampak." : "I am ready to help turn your product ideas into intuitive, fast, and measurable digital experiences.");
  const primaryBtnText = customContent?.primaryButtonText?.en || messages.hero.ctaContact;

  return (
    <section className={`w-full py-16 sm:py-24 border-b border-[var(--border)] ${className}`}>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <CardSpotlight
          size={380}
          className="relative rounded-[24px] sm:rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-14 lg:p-16 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[var(--accent)] hover:shadow-2xl overflow-hidden"
        >
          {/* Ambient radial gradient glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[var(--accent)]/10 blur-[90px] pointer-events-none rounded-full"
            aria-hidden="true"
          />

          <div className="relative z-1 max-w-2xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text)] mb-4 leading-[1.2]">
              {headlineText}
            </h2>

            <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed mb-8 max-w-xl">
              {descriptionText}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[16px] bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold text-base hover:opacity-95 shadow-md shadow-[var(--accent)]/20 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-[0.98] min-h-[48px] w-full sm:w-auto"
              >
                <span>{primaryBtnText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[16px] border border-[var(--border)] bg-[var(--background)] text-[var(--text)] font-semibold text-base hover:bg-[var(--surface-hover)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-[0.98] min-h-[48px] w-full sm:w-auto"
              >
                <span>{messages.nav.services}</span>
              </Link>
            </div>
          </div>
        </CardSpotlight>
      </div>
    </section>
  );
};
