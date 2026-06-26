"use client";

import { ShieldCheck, Truck, RotateCcw, HeadphonesIcon } from "lucide-react";

export default function MarqueeBanner() {
  const items = [
    { text: "100% Genuine Products", icon: ShieldCheck },
    { text: "Fast Nationwide Delivery", icon: Truck },
    { text: "Cash on Delivery Available", icon: RotateCcw },
    { text: "24/7 Dedicated Support", icon: HeadphonesIcon },
  ];

  return (
    <div className="trust-ticker" aria-label="Trust highlights">
      <div className="trust-ticker-track">
        {/* Render 4 sets to ensure seamless loop on large screens */}
        {[...Array(4)].map((_, groupIdx) => (
          <div key={groupIdx} className="trust-ticker-group">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="trust-ticker-item">
                  <Icon size={18} className="trust-icon" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style>{`
        .trust-ticker {
          background: var(--cream);
          border-top: 1px solid var(--border-default);
          border-bottom: 1px solid var(--border-default);
          padding: 16px 0;
          overflow: hidden;
          position: relative;
          display: flex;
        }

        /* Subtle gradient overlays for fade effect at edges */
        .trust-ticker::before,
        .trust-ticker::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
          z-index: 2;
          pointer-events: none;
        }

        .trust-ticker::before {
          left: 0;
          background: linear-gradient(to right, var(--cream), transparent);
        }

        .trust-ticker::after {
          right: 0;
          background: linear-gradient(to left, var(--cream), transparent);
        }

        .trust-ticker-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: trust-scroll 35s linear infinite;
        }

        .trust-ticker-track:hover {
          animation-play-state: paused;
        }

        .trust-ticker-group {
          display: flex;
          align-items: center;
          padding-right: 40px; /* Space between groups */
        }

        .trust-ticker-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-right: 40px;
          color: var(--navy);
          font-family: var(--font-jakarta), sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .trust-icon {
          color: var(--orange);
        }

        @keyframes trust-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 4)); }
        }

        @media (max-width: 768px) {
          .trust-ticker {
            padding: 12px 0;
          }
          .trust-ticker-item {
            font-size: 13px;
            margin-right: 32px;
          }
        }
      `}</style>
    </div>
  );
}
