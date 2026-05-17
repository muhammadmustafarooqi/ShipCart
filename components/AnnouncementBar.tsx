"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { X, Sparkles, Banknote } from "lucide-react";
import { useSettings } from "@/lib/useSettings";

const ANNOUNCEMENT_VAR = "--announcement-h";

function setAnnouncementHeight(px: number) {
  document.documentElement.style.setProperty(
    ANNOUNCEMENT_VAR,
    px > 0 ? `${px}px` : "0px"
  );
}

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [spacerHeight, setSpacerHeight] = useState(44);
  const barRef = useRef<HTMLDivElement>(null);
  const { settings, loading } = useSettings();

  useLayoutEffect(() => {
    if (!visible) {
      setSpacerHeight(0);
      setAnnouncementHeight(0);
      return;
    }

    const el = barRef.current;
    if (!el) return;

    const sync = () => {
      const h = el.offsetHeight;
      setSpacerHeight(h);
      setAnnouncementHeight(h);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, [visible]);

  useEffect(() => {
    return () => setAnnouncementHeight(0);
  }, []);

  // Hide announcement bar if not active in settings
  useEffect(() => {
    if (settings && !settings.announcementBarActive) {
      setVisible(false);
    }
  }, [settings]);

  if (!visible || !settings) return null;

  return (
    <>
      <div
        ref={barRef}
        role="region"
        aria-label="Store announcement"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 250,
          padding: "10px clamp(12px, 4vw, 20px)",
          background: "var(--color-brand)",
          color: "white",
          fontSize: "clamp(11px, 2.6vw, 13px)",
          fontWeight: 600,
          textAlign: "center",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          letterSpacing: "0.5px",
          lineHeight: 1.45,
          wordBreak: "break-word",
          boxShadow: "0 6px 20px rgba(42, 21, 24, 0.18)",
        }}
      >
        <span className="animate-pulse" style={{ display: "inline-flex", marginRight: "8px", verticalAlign: "middle" }}>
          <Sparkles size={15} strokeWidth={2.25} aria-hidden />
        </span>
        <span style={{ verticalAlign: "middle" }}>
          {settings.announcementBarText} &nbsp;&nbsp;{" "}
        </span>
        {/* <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", verticalAlign: "middle" }}>
          <Banknote size={15} strokeWidth={2.25} aria-hidden />
          <span>Cash on Delivery</span>
        </span> */}
        {/* <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss announcement"
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            opacity: 0.75,
            transition: "opacity 150ms ease",
            display: "flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
        >
          <X size={16} />
        </button> */}
      </div>
      <div aria-hidden style={{ height: spacerHeight, flexShrink: 0 }} />
    </>
  );
}
