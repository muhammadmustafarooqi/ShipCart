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
          background: "var(--navy)",
          color: "var(--white)",
          boxShadow: "0 4px 20px rgba(16, 40, 87, 0.15)",
          overflow: "hidden",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          height: "36px",
        }}
      >
        <div 
          style={{
            display: "inline-block",
            animation: "marquee 25s linear infinite",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          {Array(8).fill(null).map((_, i) => (
            <span key={i} style={{ margin: "0 24px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={14} color="var(--orange)" strokeWidth={2.5} aria-hidden />
              <span>{settings.announcementBarText}</span>
              <span style={{ color: "var(--orange)" }}>•</span>
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
      <div aria-hidden style={{ height: spacerHeight, flexShrink: 0 }} />
    </>
  );
}
