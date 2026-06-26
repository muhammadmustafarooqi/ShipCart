"use client";

import Image from "next/image";
import { LOGO_URL } from "@/lib/site";

/**
 * Wide navbar logo — preserves the wordmark's natural aspect ratio.
 * height is fixed; width expands naturally up to maxWidth.
 */
export function NavLogo({
  height = 48,
  maxWidth = 180,
  className,
}: {
  height?: number;
  maxWidth?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        height,
        width: maxWidth,
        maxWidth: "100%",
        flexShrink: 1,
        minWidth: 0,
        position: "relative",
      }}
    >
      <Image
        src={LOGO_URL}
        alt="ShipCart"
        fill
        sizes={`${maxWidth}px`}
        style={{ objectFit: "contain", objectPosition: "left center" }}
        priority
      />
    </div>
  );
}

export type BrandLogoMarkProps = {
  size: number;
  /** Corner radius; defaults from size */
  radius?: number;
  /** Inner padding so the mark does not touch the frame */
  pad?: number;
  tone?: "cream" | "elevated" | "footer" | "nav";
  /** When true, screen readers rely on adjacent text (e.g. wordmark in same link) */
  decorative?: boolean;
};

const tones = {
  cream: {
    background: "var(--white)",
    border: "2px solid var(--cream-mid)",
    boxShadow:
      "0 4px 16px rgba(42, 21, 24, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.85)",
  },
  elevated: {
    background: "var(--white)",
    border: "1px solid rgba(107, 30, 46, 0.14)",
    boxShadow: "0 12px 32px rgba(42, 21, 24, 0.14), 0 4px 12px rgba(107, 30, 46, 0.1)",
  },
  footer: {
    background: "rgba(255,255,255,0.98)",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
  },
  /** Navbar: no cream box — mark floats on its own art (e.g. full-bleed JPEG) */
  nav: {
    background: "transparent",
    border: "none",
    boxShadow: "none",
  },
} as const;

/** Framed brand mark — use inside links, headers, auth cards, etc. */
export function BrandLogoMark({
  size,
  radius,
  pad,
  tone = "cream",
  decorative = false,
}: BrandLogoMarkProps) {
  const t = tones[tone];
  const isNav = tone === "nav";
  const r = radius ?? (isNav ? Math.max(16, Math.round(size * 0.26)) : Math.max(14, Math.round(size * 0.24)));
  const p = pad ?? (isNav ? 0 : Math.max(3, Math.round(size * 0.1)));

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
        padding: p,
        boxSizing: "border-box",
        background: t.background,
        border: t.border,
        boxShadow: t.boxShadow,
      }}
    >
      <Image
        src={LOGO_URL}
        alt={decorative ? "" : "ShipCart logo"}
        width={Math.round(size * 2)}
        height={Math.round(size * 2)}
        sizes={`${size}px`}
        style={{
          objectFit: isNav ? "cover" : "contain",
          width: "100%",
          height: "100%",
          ...(isNav
            ? {
                filter:
                  "drop-shadow(0 4px 12px rgba(0,0,0,0.22)) drop-shadow(0 10px 28px rgba(42, 21, 24, 0.18))",
              }
            : {}),
        }}
      />
    </div>
  );
}
