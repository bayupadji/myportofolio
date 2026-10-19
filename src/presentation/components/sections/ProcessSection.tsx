"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import {
  Search,
  Compass,
  LayoutGrid,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Locale, resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { CardSpotlight } from "../ui/CardSpotlight";
import { ProcessStepItem } from "@/domain/entities/Profile";

export interface ProcessSectionProps {
  locale?: Locale;
  messages: Messages;
  customSteps?: ProcessStepItem[];
}

interface StepView {
  stepNumber: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const subscribeReducedMotion = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};

const getReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const getReducedMotionServer = () => false;

const clamp = (v: number, min = 0, max = 1) => Math.min(Math.max(v, min), max);

/** Resting tilt angles of cards while stacked (Amotax signature style) */
const REST_ANGLES = [0, 7, -5, 3, -4, 5];

/** Solid, opaque card face with rich typography, spotlight, and milestone bar */
const StepCard: React.FC<{
  step: StepView;
  index: number;
  total: number;
  isActive: boolean;
}> = ({ step, index, total, isActive }) => (
  <CardSpotlight
    className={`h-full w-full rounded-3xl p-6 sm:p-8 bg-[var(--surface)] border transition-all duration-300 ease-out flex flex-col justify-between shadow-2xl ${
      isActive
        ? "border-[var(--accent)]/50 ring-1 ring-[var(--accent)]/20"
        : "border-[var(--border)] hover:border-[var(--accent)]/40"
    }`}
  >
    {/* Top Row: Step Badge & Prominent Accent Icon Box */}
    <div className="flex items-center justify-between gap-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[var(--border)] bg-[var(--surface-hover)] text-xs font-mono font-semibold tracking-wider text-[var(--text)] shadow-2xs tabular-nums">
        <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
        <span>PHASE : 0{step.stepNumber}</span>
      </div>

      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-[var(--accent-contrast)] flex items-center justify-center shadow-md shadow-[var(--accent)]/20 shrink-0">
        {step.icon}
      </div>
    </div>

    {/* Middle: Title & Description */}
    <div className="my-auto py-3">
      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] mb-2.5 text-balance">
        {step.title}
      </h3>
      <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed text-pretty">
        {step.desc}
      </p>
    </div>

    {/* Bottom: Milestone bar */}
    <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]/60 text-xs text-[var(--text-muted)]">
      <span className="font-medium tracking-wide">
        Phase {index + 1} of {total}
      </span>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? "w-6 bg-[var(--accent)]"
                : i < index
                ? "w-2.5 bg-[var(--accent)]/40"
                : "w-1.5 bg-[var(--border)]"
            }`}
          />
        ))}
      </div>
    </div>
  </CardSpotlight>
);

export const ProcessSection: React.FC<ProcessSectionProps> = ({
  locale,
  messages,
  customSteps,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer
  );

  const defaultIcons = [
    <Search key="1" className="w-6 h-6 sm:w-7 sm:h-7" />,
    <Compass key="2" className="w-6 h-6 sm:w-7 sm:h-7" />,
    <LayoutGrid key="3" className="w-6 h-6 sm:w-7 sm:h-7" />,
    <CheckCircle2 key="4" className="w-6 h-6 sm:w-7 sm:h-7" />,
  ];

  const steps: StepView[] =
    customSteps && customSteps.length > 0
      ? customSteps.map((cs, idx) => ({
          stepNumber: cs.stepNumber || idx + 1,
          icon: defaultIcons[idx % defaultIcons.length],
          title: resolveLocalized(cs.title, locale).text || `Step ${idx + 1}`,
          desc:
            resolveLocalized(cs.description, locale).text ||
            "Detailed execution of this design phase to deliver high quality results.",
        }))
      : [
          {
            stepNumber: 1,
            icon: defaultIcons[0],
            title: messages.process.step1Title,
            desc: messages.process.step1Desc,
          },
          {
            stepNumber: 2,
            icon: defaultIcons[1],
            title: messages.process.step2Title,
            desc: messages.process.step2Desc,
          },
          {
            stepNumber: 3,
            icon: defaultIcons[2],
            title: messages.process.step3Title,
            desc: messages.process.step3Desc,
          },
          {
            stepNumber: 4,
            icon: defaultIcons[3],
            title: messages.process.step4Title,
            desc: messages.process.step4Desc,
          },
        ];

  const N = steps.length;
  const peelableCount = Math.max(N - 1, 1);

  // Map scroll progress across the pinned track
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        // The sticky viewport is positioned at top-20 (80px), height is (innerHeight - 80px)
        const headerOffset = 80;
        const scrollable = rect.height - (window.innerHeight - headerOffset);
        if (scrollable <= 0) return;

        const currentScroll = -rect.top + headerOffset;
        const p = clamp(currentScroll / scrollable);
        setScrollProgress(p);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [N]);

  // Determine current active step (from 0 to N-1)
  const getActiveStepIndex = () => {
    for (let i = 0; i < N - 1; i++) {
      const segSpan = 1 / peelableCount;
      const segEnd = i * segSpan + segSpan * 0.85;
      if (scrollProgress < segEnd) {
        return i;
      }
    }
    return N - 1;
  };

  const activeStep = getActiveStepIndex();

  // Jump to specific card on desktop
  const jumpTo = (targetIdx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const currentScrollY = window.scrollY;
    const containerTop = currentScrollY + rect.top - 80;
    const scrollable = el.offsetHeight - (window.innerHeight - 80);

    let targetProgress = 0;
    if (targetIdx === 0) {
      targetProgress = 0.02;
    } else if (targetIdx >= N - 1) {
      targetProgress = 0.95;
    } else {
      targetProgress = (targetIdx / peelableCount) + 0.04;
    }

    const targetScrollY = containerTop + targetProgress * scrollable;
    window.scrollTo({
      top: targetScrollY,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  // Card transform calculation (glides off to the left cleanly)
  const getCardStyle = (index: number): React.CSSProperties => {
    const baseZIndex = (N - index) * 10;
    const initialAngle = REST_ANGLES[index % REST_ANGLES.length];

    if (prefersReducedMotion) {
      return {
        zIndex: activeStep === index ? 50 : baseZIndex,
        opacity: activeStep === index ? 1 : 0,
        pointerEvents: activeStep === index ? "auto" : "none",
      };
    }

    // The final card never flies away
    if (index === N - 1) {
      const prevEnd = (index - 1) / peelableCount;
      const straightness = clamp((scrollProgress - prevEnd) / (1 - prevEnd || 0.1));
      const currentAngle = initialAngle * (1 - straightness);
      const transformStr = `translate3d(0px, 0px, 0px) rotate(${currentAngle.toFixed(2)}deg) scale(1)`;

      return {
        transform: transformStr,
        WebkitTransform: transformStr,
        opacity: 1,
        zIndex: 10,
      };
    }

    const segSpan = 1 / peelableCount;
    const segStart = index * segSpan;
    const segEnd = segStart + segSpan * 0.85;

    if (scrollProgress < segStart) {
      // Resting in stack
      const prevEnd = (index - 1) * segSpan + segSpan * 0.85;
      const isTopNow = index === 0 || scrollProgress >= prevEnd;

      let currentAngle = initialAngle;
      if (isTopNow && index > 0) {
        const t = clamp((scrollProgress - (index - 1) * segSpan) / (segSpan * 0.85));
        currentAngle = initialAngle * (1 - t * 0.8);
      }
      const transformStr = `translate3d(0px, 0px, 0px) rotate(${currentAngle.toFixed(2)}deg) scale(1)`;

      return {
        transform: transformStr,
        WebkitTransform: transformStr,
        opacity: 1,
        zIndex: baseZIndex,
      };
    }

    if (scrollProgress >= segEnd) {
      // Fully peeled off to the left
      const transformStr = `translate3d(-125%, -25%, 0px) rotate(-16deg) scale(0.9)`;
      return {
        transform: transformStr,
        WebkitTransform: transformStr,
        opacity: 0,
        pointerEvents: "none",
        zIndex: baseZIndex,
      };
    }

    // Actively peeling away to the left
    const t = (scrollProgress - segStart) / (segEnd - segStart);
    const ease = Math.pow(t, 1.5);

    const translateX = -ease * 125;
    const translateY = -ease * 25;
    const rotate = initialAngle - ease * 16;
    const scale = 1 - ease * 0.08;
    const opacity = clamp(1 - Math.pow(t, 2));
    const transformStr = `translate3d(${translateX.toFixed(1)}%, ${translateY.toFixed(1)}%, 0px) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

    return {
      transform: transformStr,
      WebkitTransform: transformStr,
      opacity,
      zIndex: baseZIndex + 5,
      pointerEvents: t > 0.4 ? "none" : "auto",
    };
  };

  // Mobile carousel handler
  const onCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el || !el.firstElementChild) return;
    const card = el.firstElementChild as HTMLElement;
    const scrollLeft = el.scrollLeft;
    const cardWidth = card.offsetWidth;
    const gap = 16;
    const active = Math.round(scrollLeft / (cardWidth + gap));
    setMobileActiveIdx(clamp(active, 0, N - 1));
  };

  const scrollCarouselTo = (idx: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const child = el.children[idx] as HTMLElement | undefined;
    child?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <section className="relative w-full border-b border-[var(--border)] bg-[var(--surface-hover)]/30">
      {/* =========================================================================
          DESKTOP VIEW: PINNED DECK INSIDE STANDARD 1200PX CONTAINER (>= 1024px)
          ========================================================================= */}
      <div
        ref={trackRef}
        className="relative hidden lg:block"
        style={{ height: `calc(100vh + ${N * 85}vh)` }}
      >
        {/* Sticky Viewport - positioned at top-20 (below header) without header collision */}
        <div
          className="sticky top-20 h-[calc(100vh-5rem)] w-full flex items-center overflow-hidden"
          style={{ position: "-webkit-sticky" as React.CSSProperties["position"] }}
        >
          {/* Ambient Lighting & Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-[var(--accent)]/5 blur-[140px] pointer-events-none rounded-full"
            aria-hidden="true"
          />

          {/* Standard 1200px Content Container (matching Hero & SelectedWork exactly) */}
          <div className="mx-auto max-w-[1200px] w-full px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-6 xl:py-8 relative z-10">
            {/* 1. Section Header: Matches SelectedWork Header Layout */}
            <div className="flex items-end justify-between gap-4 pb-4 border-b border-[var(--border)]/60">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
                    <span>❖</span>
                    <span>{messages.process.badge}</span>
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight text-[var(--text)] text-balance">
                  {messages.process.title}
                </h2>
                <p className="mt-1.5 text-sm sm:text-base text-[var(--text-muted)] max-w-xl text-pretty">
                  {messages.process.subtitle}
                </p>
              </div>

              {/* Step Jumper Buttons on the Right Side of Header */}
              <div className="flex items-center gap-2 shrink-0">
                {steps.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => jumpTo(i)}
                    className={`h-9 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer tabular-nums font-mono ${
                      activeStep === i
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs scale-105"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text)]"
                    }`}
                    aria-label={`Jump to Step ${s.stepNumber}: ${s.title}`}
                  >
                    <span>0{s.stepNumber}</span>
                    <span className="hidden xl:inline ml-1.5 font-sans font-medium">{s.title.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Center Stage: Card Deck inside 1200px Grid */}
            <div className="relative w-full max-w-[520px] h-[330px] sm:h-[350px] mx-auto my-auto flex items-center justify-center">
              {/* Animated Dashed Orbiting Lines (Pemanis seperti di Hero Photo) */}
              <svg
                aria-hidden="true"
                viewBox="0 0 600 400"
                fill="none"
                className="pointer-events-none absolute -inset-x-14 -inset-y-12 w-[calc(100%+7rem)] h-[calc(100%+6rem)] overflow-visible z-0 select-none"
              >
                <style>{`
                  @keyframes process-orbit-spin {
                    0% {
                      stroke-dashoffset: 0;
                    }
                    100% {
                      stroke-dashoffset: 26px;
                    }
                  }
                  @media (prefers-reduced-motion: reduce) {
                    .process-orbit-line {
                      animation: none !important;
                    }
                  }
                `}</style>
                {/* Primary tilted dashed ellipse */}
                <ellipse
                  cx="300"
                  cy="200"
                  rx="305"
                  ry="170"
                  transform="rotate(-9 300 200)"
                  strokeWidth="1.5"
                  strokeDasharray="4 9"
                  className="process-orbit-line"
                  style={{
                    stroke: "var(--accent)",
                    opacity: 0.45,
                    animation: "process-orbit-spin 1.8s linear infinite reverse",
                  }}
                />
                {/* Secondary outer subtle dashed orbit */}
                <ellipse
                  cx="300"
                  cy="200"
                  rx="330"
                  ry="190"
                  transform="rotate(6 300 200)"
                  strokeWidth="1.2"
                  strokeDasharray="3 12"
                  className="process-orbit-line"
                  style={{
                    stroke: "var(--accent)",
                    opacity: 0.25,
                    animation: "process-orbit-spin 2.6s linear infinite",
                  }}
                />
              </svg>

              {steps.map((step, idx) => (
                <div
                  key={idx}
                  style={getCardStyle(idx)}
                  className="absolute inset-0 m-auto w-full max-w-[490px] h-[320px] sm:h-[340px] will-change-transform"
                >
                  <StepCard
                    step={step}
                    index={idx}
                    total={N}
                    isActive={activeStep === idx}
                  />
                </div>
              ))}
            </div>

            {/* 3. Bottom Row: Active Phase Milestone Summary */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]/60 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <span className="font-medium">Active Phase:</span>
                <span className="font-semibold text-[var(--text)]">
                  Step 0{steps[activeStep].stepNumber} — {steps[activeStep].title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Phase {activeStep + 1} of {steps.length}</span>
                <div className="flex items-center gap-1.5 ml-2">
                  {steps.map((_, dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        dotIdx === activeStep
                          ? "w-6 bg-[var(--accent)]"
                          : dotIdx < activeStep
                          ? "w-2.5 bg-[var(--accent)]/40"
                          : "w-1.5 bg-[var(--border)]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE VIEW: HORIZONTAL SNAP CAROUSEL (< 1024px)
          ========================================================================= */}
      <div className="block lg:hidden py-16 sm:py-24 overflow-hidden">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-xl mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                {messages.process.badge}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
              {messages.process.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {messages.process.subtitle}
            </p>
          </div>

          {/* Swipeable Carousel with Animated Dashed Orbit Background */}
          <div className="relative">
            <svg
              aria-hidden="true"
              viewBox="0 0 400 300"
              fill="none"
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] overflow-visible z-0 select-none opacity-30"
            >
              <ellipse
                cx="200"
                cy="150"
                rx="195"
                ry="125"
                transform="rotate(-6 200 150)"
                strokeWidth="1.4"
                strokeDasharray="4 8"
                className="process-orbit-line"
                style={{
                  stroke: "var(--accent)",
                  animation: "process-orbit-spin 2s linear infinite reverse",
                }}
              />
            </svg>

            <div
              ref={carouselRef}
              onScroll={onCarouselScroll}
              className="-mx-4 sm:-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:px-6 pb-4 focus:outline-none scrollbar-none relative z-10"
              role="region"
              aria-label="Process steps"
              tabIndex={0}
            >
              {steps.map((step, idx) => (
              <div
                key={idx}
                className="snap-center shrink-0 w-[84vw] sm:w-[380px] max-w-[400px] h-[320px]"
              >
                <StepCard
                  step={step}
                  index={idx}
                  total={N}
                  isActive={mobileActiveIdx === idx}
                />
              </div>
            ))}
            </div>
          </div>

          {/* Mobile Navigation Controls & Dots */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={() => scrollCarouselTo(Math.max(mobileActiveIdx - 1, 0))}
              disabled={mobileActiveIdx === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--surface-hover)] transition-colors shadow-xs"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollCarouselTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    mobileActiveIdx === idx
                      ? "w-7 bg-[var(--accent)]"
                      : "w-2 bg-[var(--border)]"
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollCarouselTo(Math.min(mobileActiveIdx + 1, N - 1))}
              disabled={mobileActiveIdx === N - 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--surface-hover)] transition-colors shadow-xs"
              aria-label="Next step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
