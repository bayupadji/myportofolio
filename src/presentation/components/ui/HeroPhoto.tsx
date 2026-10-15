"use client";

import React, { useState } from "react";

export interface HeroPhotoProps {
  avatarUrl?: string;
  name?: string;
  role?: string;
  tagline?: string;
  className?: string;
  variant?: "hero" | "about";
}

export const HeroPhoto: React.FC<HeroPhotoProps> = ({
  avatarUrl = "/profile.webp",
  name = "Bayu",
  role = "Product Designer",
  tagline = "UI/UX & Systems",
  className = "",
  variant = "hero",
}) => {
  const [imgSrc, setImgSrc] = useState<string>(avatarUrl);
  const [imgError, setImgError] = useState<boolean>(false);

  // Fallback to placeholder if profile.webp doesn't exist yet
  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
      );
    }
  };

  const isAbout = variant === "about";

  return (
    <div
      className={`relative aspect-square w-[clamp(260px,70vw,420px)] justify-self-center select-none ${className}`}
      aria-label={`${name} - ${role} (${tagline})`}
    >
      {/* Embedded CSS keyframes & hover states */}
      <style>{`
        @keyframes ik-orbit-spin {
          to {
            stroke-dashoffset: -22px;
          }
        }

        /* Hero coprime bobbing (X drift + Y vertical bobbing) */
        @keyframes hero-bob-y {
          0%, 100% { transform: translateY(0px); }
          22% { transform: translateY(-6px); }
          46% { transform: translateY(-16px); }
          72% { transform: translateY(-4px); }
          88% { transform: translateY(-11px); }
        }

        @keyframes hero-bob-x {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          25% { transform: translateX(5px) rotate(0.6deg); }
          52% { transform: translateX(-4px) rotate(-0.5deg); }
          75% { transform: translateX(3px) rotate(0.4deg); }
          90% { transform: translateX(-1px) rotate(-0.2deg); }
        }

        /* About coprime bobbing */
        @keyframes about-bob-y {
          0%, 100% { transform: translateY(0px); }
          20% { transform: translateY(-12px); }
          48% { transform: translateY(-5px); }
          70% { transform: translateY(-18px); }
          86% { transform: translateY(-8px); }
        }

        @keyframes about-bob-x {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          28% { transform: translateX(-5px) rotate(-0.7deg); }
          55% { transform: translateX(4px) rotate(0.6deg); }
          80% { transform: translateX(-2px) rotate(-0.3deg); }
        }

        /* Badge floating animations */
        @keyframes badge-float-1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }

        @keyframes badge-float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-9px) rotate(1.5deg); }
        }

        @keyframes cursor-float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(6px, 8px); }
        }

        /* Pure CSS hover-pause: When hovered, animations pause gracefully */
        .ik-bob-container:hover .ik-bob-animated,
        .ik-bob-container:hover .ik-drift-animated,
        .ik-badge-hover:hover {
          animation-play-state: paused !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .ik-drift-animated,
          .ik-bob-animated,
          .ik-badge-hover,
          .ik-cursor-animated {
            animation: none !important;
          }
        }
      `}</style>

      {/* 1. Designer Grid Canvas Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-[8%] opacity-25 dark:opacity-30 blur-[70px] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(closest-side, var(--accent), transparent)",
        }}
      />

      {/* 2. Main photo card with Figma Canvas Frame Styling */}
      <div className="ik-bob-container absolute top-[4%] left-[6%] w-[88%] pointer-events-auto">
        <div
          className="ik-drift-animated"
          style={{
            animation: isAbout
              ? "about-bob-x 7.8s ease-in-out infinite -2.4s"
              : "hero-bob-x 6.8s ease-in-out infinite 0s",
          }}
        >
          <div
            className="ik-bob-animated"
            style={{
              animation: isAbout
                ? "about-bob-y 5.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite -1.8s"
                : "hero-bob-y 4.6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite 0s",
            }}
          >
            {/* Figma-Style Canvas Frame with Selection Handles & Coordinate Spec */}
            <div
              className="group relative cursor-pointer rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-2.5 sm:p-3 shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[var(--accent)] hover:shadow-2xl"
              title={`${name} — ${role}`}
            >
              {/* Figma Corner Handles (4 points) */}
              <span className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-xs border border-[var(--accent)] bg-[var(--surface)] shadow-xs opacity-75 group-hover:opacity-100 transition-opacity" />
              <span className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-xs border border-[var(--accent)] bg-[var(--surface)] shadow-xs opacity-75 group-hover:opacity-100 transition-opacity" />
              <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-xs border border-[var(--accent)] bg-[var(--surface)] shadow-xs opacity-75 group-hover:opacity-100 transition-opacity" />
              <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-xs border border-[var(--accent)] bg-[var(--surface)] shadow-xs opacity-75 group-hover:opacity-100 transition-opacity" />

              {/* Designer Canvas Header bar with spec coordinates */}
              <div
                aria-hidden="true"
                className="flex items-center justify-between px-2 pt-1 pb-2.5 border-b border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-muted)]"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[var(--accent)] font-semibold">❖</span>
                  <span className="font-semibold text-[var(--text)] tracking-tight">
                    {isAbout ? "Frame: AboutMe" : "Component: HeroLead"}
                  </span>
                </div>
                <div className="flex items-center gap-2 tabular-nums font-mono text-[9px] sm:text-[10px]">
                  <span>W:420</span>
                  <span className="text-[var(--border)]">|</span>
                  <span>H:460</span>
                  <span className="text-[var(--border)]">|</span>
                  <span className="hidden sm:inline text-emerald-500 font-semibold">Auto Layout</span>
                </div>
              </div>

              {/* Photo Container */}
              <div className="mt-2 bg-[var(--surface-hover)] aspect-[1/0.95] overflow-hidden rounded-xl sm:rounded-2xl relative border border-[var(--border-subtle)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt={name}
                  onError={handleImageError}
                  fetchPriority="high"
                  loading="eager"
                  width={800}
                  height={800}
                  className="h-full w-full object-cover object-[50%_18%] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />

                {/* Subtle Inner Glass Vignette */}
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10 pointer-events-none rounded-xl sm:rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Multiplayer Designer Cursor (Figma Style) */}
      <div
        aria-hidden="true"
        className="ik-cursor-animated absolute -top-2 left-[2%] z-20 pointer-events-none"
        style={{ animation: "cursor-float 4.2s ease-in-out infinite" }}
      >
        <div className="flex items-start gap-1">
          {/* Custom Cursor SVG */}
          <svg className="w-4 h-4 text-[var(--accent)] fill-current drop-shadow-md" viewBox="0 0 24 24">
            <path d="M4 2l16 11.5-6.5 1.5 4 7-3 1.5-4-7-4.5 4.5V2z" />
          </svg>
          <span className="px-2 py-0.5 rounded-md bg-[var(--accent)] text-[var(--accent-contrast)] text-[10px] font-semibold tracking-tight shadow-md whitespace-nowrap">
            Bayu · Lead UI/UX
          </span>
        </div>
      </div>

      {/* 4. Bottom-Left Floating Design System / Metric Spec Badge */}
      <div
        className="ik-badge-hover absolute bottom-[1%] -left-[4%] sm:bottom-[0%] sm:-left-[6%] z-20 pointer-events-auto"
        style={{
          animation: isAbout
            ? "badge-float-1 5.9s ease-in-out infinite -2.8s"
            : "badge-float-1 5.2s ease-in-out infinite -1.5s",
        }}
      >
        <div className="group cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-105 hover:border-[var(--accent)] hover:shadow-2xl font-mono text-[11px] leading-[1.6]">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-sans font-bold text-xs text-[var(--text)]">
              Impact-Driven Design
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-[var(--text-muted)] space-y-0.5">
            <div>
              <span className="text-[var(--accent)] font-semibold">conversion</span>
              <span>: </span>
              <span className="text-[var(--text)] font-semibold tabular-nums">+38% Lift</span>
            </div>
            <div>
              <span className="text-[var(--accent)] font-semibold">tokens</span>
              <span>: </span>
              <span className="text-[var(--text)] font-semibold">120+ Components</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Top-Right Floating Tool / System Badge */}
      <div
        aria-hidden="true"
        className="ik-badge-hover absolute top-[0%] -right-[3%] sm:-top-[2%] sm:-right-[5%] z-20 pointer-events-auto"
        style={{
          animation: isAbout
            ? "badge-float-2 6.3s ease-in-out infinite -1.2s"
            : "badge-float-2 5.5s ease-in-out infinite -0.8s",
        }}
      >
        <div className="group cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md px-3 py-2 shadow-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-105 hover:border-[var(--accent)] hover:shadow-2xl flex items-center gap-2">
          {/* Figma Logo SVG */}
          <svg
            className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 38 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
            <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
            <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
            <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
            <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
          </svg>
          <div className="font-mono text-[10px] leading-tight">
            <div className="font-bold text-[var(--text)]">Design Systems</div>
            <div className="text-[var(--text-muted)] text-[9px]">Figma Variables</div>
          </div>
        </div>
      </div>
    </div>
  );
};
