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

  // Distinct organic idle float timings for hero vs about to feel alive and non-mechanical
  const mainFloatStyle = {
    animation: isAbout
      ? "ik-float-alt 7.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite -2.4s"
      : "ik-float-smooth 6.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite 0s",
  };

  const badgeFloatStyle = {
    animation: isAbout
      ? "ik-float-smooth 7.4s ease-in-out infinite -5s"
      : "ik-float-alt 6.5s ease-in-out infinite -3.2s",
  };

  const toolFloatStyle = {
    animation: isAbout
      ? "ik-float-alt 7s ease-in-out infinite -1.2s"
      : "ik-float-smooth 6.2s ease-in-out infinite -0.8s",
  };

  return (
    <div
      className={`relative aspect-square w-[clamp(260px,70vw,420px)] justify-self-center select-none ${className}`}
      aria-label={`${name} - ${role}`}
    >
      {/* 1. Orbiting / marching dashed ellipse SVG (Identical to indrakusuma.dev) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        fill="none"
        className="pointer-events-none absolute top-[-6%] left-[-6%] h-[112%] w-[112%] -translate-y-[3.4%] overflow-visible"
      >
        <ellipse
          cx="200"
          cy="200"
          rx="215"
          ry="92"
          transform="rotate(-14 200 200)"
          strokeWidth="1.3"
          strokeDasharray="3 8"
          className="ik-orbit-march"
          style={{ stroke: "var(--accent)", opacity: 0.45 }}
        />
      </svg>

      {/* 2. Ambient radial glow blur */}
      <div
        aria-hidden="true"
        className="absolute inset-[12%] opacity-35 blur-[60px] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(closest-side, var(--accent), transparent)",
        }}
      />

      {/* 3. Main photo card with idle organic float + interactive hover lift */}
      <div
        className="absolute top-[4%] left-[8%] w-[84%] pointer-events-auto"
        style={mainFloatStyle}
      >
        <div
          className="group cursor-pointer rounded-[clamp(16px,5.5%,24px)] border border-[var(--border)] bg-[var(--surface)] p-[2.5%] shadow-xl transition-all duration-300 ease-out hover:-translate-y-2.5 hover:scale-[1.025] hover:border-[var(--accent)]/60 hover:shadow-2xl active:scale-[0.99]"
          title={`${name} — ${role}`}
        >
          {/* Terminal Header dots & title */}
          <div
            aria-hidden="true"
            className="flex items-center gap-1.5 px-[3%] pt-[1%] pb-[3%]"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56] transition-opacity group-hover:opacity-90" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E] transition-opacity group-hover:opacity-90" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F] transition-opacity group-hover:opacity-90" />
            <span className="text-[var(--text-muted)] ml-3 font-mono text-[11px] group-hover:text-[var(--text)] transition-colors">
              {isAbout ? "about-bayu.md" : "bayu.design"}
            </span>
          </div>

          {/* Photo Container */}
          <div className="bg-[var(--surface-hover)] aspect-[1/0.92] overflow-hidden rounded-[clamp(11px,4%,16px)] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={name}
              onError={handleImageError}
              fetchPriority="high"
              loading="eager"
              width={800}
              height={800}
              className="h-full w-full object-cover object-[50%_20%] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          </div>
        </div>
      </div>

      {/* 4. Bottom-Left Floating Code/Spec Badge (with counter-phase float + hover lift) */}
      <div
        className="absolute bottom-[3%] left-[-4%] sm:bottom-[2%] sm:left-[-6%] z-10 pointer-events-auto"
        style={badgeFloatStyle}
      >
        <div className="group cursor-pointer rounded-[14px] sm:rounded-[16px] border border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-105 hover:border-[var(--accent)]/60 hover:shadow-2xl font-mono text-[10px] leading-[1.65] sm:text-[12px] sm:leading-[1.7]">
          <p className="sr-only">
            {role} focusing on {tagline}
          </p>
          <div aria-hidden="true" className="min-w-[26ch] sm:min-w-[29ch]">
            <div className="whitespace-nowrap">
              <span className="text-[var(--accent)] font-semibold">role</span>
              <span className="text-[var(--text-muted)]">: </span>
              <span className="text-[var(--text)]">&#x27;{role}&#x27;</span>
            </div>
            <div className="whitespace-nowrap">
              <span className="text-[var(--accent)] font-semibold">focus</span>
              <span className="text-[var(--text-muted)]">: </span>
              <span className="text-[var(--text)]">
                &#x27;{tagline}
                <span className="ik-caret" />
                &#x27;
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Top-Right Floating Tool Badge (Figma icon with float + hover lift/spin) */}
      <div
        aria-hidden="true"
        className="absolute top-[calc(4%-18px)] right-[calc(8%-18px)] sm:top-[calc(4%-22px)] sm:right-[calc(8%-22px)] z-10 pointer-events-auto"
        style={toolFloatStyle}
      >
        <div className="group cursor-pointer h-11 w-11 sm:h-13 sm:w-13 rounded-[14px] sm:rounded-[16px] border border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md shadow-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-110 hover:rotate-6 hover:border-[var(--accent)]/60 hover:shadow-2xl flex items-center justify-center p-2.5">
          {/* Figma Logo SVG */}
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 38 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z"
              fill="#1ABCFE"
            />
            <path
              d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"
              fill="#0ACF83"
            />
            <path
              d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z"
              fill="#FF7262"
            />
            <path
              d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z"
              fill="#F24E1E"
            />
            <path
              d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z"
              fill="#A259FF"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
