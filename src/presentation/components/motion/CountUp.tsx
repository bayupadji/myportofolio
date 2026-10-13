"use client";

import React, { useEffect, useRef } from "react";

export interface CountUpProps {
  value: string;
  className?: string;
  duration?: number;
}

/**
 * Animated number count-up component that triggers once when entering the viewport.
 * Automatically respects `prefers-reduced-motion`.
 * Mutates the DOM directly during animation for 60fps performance without re-render cascades.
 */
export const CountUp: React.FC<CountUpProps> = ({
  value,
  className = "",
  duration = 1200,
}) => {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    // If reduced motion is preferred or already animated, keep original value
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    if (hasAnimatedRef.current) return;

    // Parse the numeric portion and prefix/suffix (e.g., "5+", "40%", "150k+")
    const match = value.match(/^([^0-9.]*)([0-9.]+)(.*)$/);
    if (!match) return;

    const prefix = match[1] || "";
    const rawTarget = parseFloat(match[2]);
    const suffix = match[3] || "";
    const isDecimal = match[2].includes(".");
    const decimalPlaces = isDecimal ? match[2].split(".")[1].length : 0;

    const node = textRef.current;
    if (!node) return;

    // Initialize display with 0
    node.textContent = `${prefix}0${suffix}`;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          let startTime: number | null = null;

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease-out cubic: 1 - (1 - progress)^3
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentNum = easeOutProgress * rawTarget;

            const formattedNum = isDecimal
              ? currentNum.toFixed(decimalPlaces)
              : Math.floor(currentNum).toString();

            if (node) {
              node.textContent = `${prefix}${formattedNum}${suffix}`;
            }

            if (progress < 1) {
              requestAnimationFrame(step);
            } else if (node) {
              node.textContent = value;
            }
          };

          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [value, duration]);

  return (
    <span className={className} aria-label={value}>
      <span ref={textRef} aria-hidden="true">
        {value}
      </span>
    </span>
  );
};
