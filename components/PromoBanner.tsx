"use client";

import Link from "next/link";
import { Sparkles, Truck, WalletCards, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useSettings } from "@/lib/useSettings";

const DEFAULT_OFFER = {
  isActive: true,
  kickerText: "Limited-time offer",
  kickerSubtext: "Ends when slots fill — same-day replies on WhatsApp",
  titleLine1: "FREE delivery + COD",
  titleLine2: "on carts",
  highlightText: "Rs. 1,500+",
  description: "Nationwide shipping, pay when it lands — no advance on standard orders. Stack cart value once and both perks unlock at checkout.",
  perk1Title: "Free shipping",
  perk1Text: "Orders Rs. 1,500+ ship on us",
  perk2Title: "COD unlocked",
  perk2Text: "Pay on delivery, zero prepay",
  buttonText: "Shop the offer",
  buttonLink: "/products",
  secondaryButtonText: "Featured picks",
  secondaryButtonLink: "/products?featured=true",
  statValue: "Rs. 1,500",
  statLabel: "Minimum cart for free delivery",
  stat2Value: "COD",
  stat2Label: "No advance on standard orders",
  panelNote: "Same dispatch and support as the rest of the store — only checkout perks change so you keep full confidence.",
};

export default function PromoBanner() {
  const { settings, loading } = useSettings();
  const offer = settings?.offerBanner || DEFAULT_OFFER;

  if (loading || !offer.isActive) return null;
  return (
    <section className="pb-section" aria-labelledby="promo-banner-heading">
      <div className="pb-bg-grid" aria-hidden />
      <div className="pb-glow pb-glow--gold" aria-hidden />
      <div className="pb-glow pb-glow--maroon" aria-hidden />

      <div className="page-container pb-inner">
        <div className="pb-card">
          <div className="pb-ribbon" aria-hidden>
            <Tag size={13} strokeWidth={2.4} aria-hidden />
            Special offer
          </div>
          <div className="pb-accent-bar" aria-hidden />

          <div className="pb-layout">
            <div className="pb-copy">
              <div className="pb-kicker-wrap">
                <span className="pb-kicker">
                  <Sparkles size={14} strokeWidth={2.25} className="pb-kicker-ico" aria-hidden />
                  {offer.kickerText}
                </span>
                <span className="pb-kicker-sub">{offer.kickerSubtext}</span>
              </div>

              <h2 id="promo-banner-heading" className="pb-title">
                <span className="pb-title-line1">{offer.titleLine1}</span>
                <span className="pb-title-line2">
                  {offer.titleLine2} <span className="pb-title-highlight">{offer.highlightText}</span>
                </span>
              </h2>

              <p className="pb-lede">
                {offer.description}
              </p>

              <ul className="pb-perks" role="list">
                <li className="pb-perk">
                  <span className="pb-perk-icon" aria-hidden>
                    <Truck size={18} strokeWidth={2} />
                  </span>
                  <span className="pb-perk-text">
                    <strong>{offer.perk1Title}</strong>
                    <span>{offer.perk1Text}</span>
                  </span>
                </li>
                <li className="pb-perk">
                  <span className="pb-perk-icon" aria-hidden>
                    <WalletCards size={18} strokeWidth={2} />
                  </span>
                  <span className="pb-perk-text">
                    <strong>{offer.perk2Title}</strong>
                    <span>{offer.perk2Text}</span>
                  </span>
                </li>
              </ul>

              <div className="pb-actions">
                <Link href={offer.buttonLink} className="btn-primary pb-btn-main">
                  <ShoppingBag size={18} strokeWidth={2} aria-hidden />
                  {offer.buttonText}
                </Link>
                <Link href={offer.secondaryButtonLink} className="pb-btn-outline">
                  {offer.secondaryButtonText}
                  <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
                </Link>
              </div>
            </div>

            <aside className="pb-panel" aria-label="Offer details">
              <div className="pb-panel-shine" aria-hidden />
              <p className="pb-panel-eyebrow">What you get today</p>
              <div className="pb-stat">
                <span className="pb-stat-value">{offer.statValue}</span>
                <span className="pb-stat-label">{offer.statLabel}</span>
              </div>
              <div className="pb-stat pb-stat-alt">
                <span className="pb-stat-value">{offer.stat2Value}</span>
                <span className="pb-stat-label">{offer.stat2Label}</span>
              </div>
              <p className="pb-panel-note">
                {offer.panelNote}
              </p>
            </aside>
          </div>
        </div>
      </div>

      <style>{`
        .pb-section {
          position: relative;
          padding: clamp(52px, 7vw, 84px) 0;
          background: linear-gradient(180deg, var(--cream-dark) 0%, var(--cream) 45%, var(--white) 100%);
          border-top: 1px solid var(--cream-mid);
          border-bottom: 1px solid rgba(107, 30, 46, 0.08);
          overflow: hidden;
        }

        .pb-bg-grid {
          pointer-events: none;
          position: absolute;
          inset: 0;
          opacity: 0.35;
          background-image:
            linear-gradient(rgba(107, 30, 46, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(107, 30, 46, 0.04) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 75% 65% at 50% 40%, black 20%, transparent 72%);
        }

        .pb-glow {
          pointer-events: none;
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.55;
        }
        .pb-glow--gold {
          width: min(420px, 55vw);
          height: min(320px, 40vw);
          top: -12%;
          right: -8%;
          background: rgba(201, 168, 76, 0.35);
        }
        .pb-glow--maroon {
          width: min(380px, 50vw);
          height: min(280px, 38vw);
          bottom: -18%;
          left: -10%;
          background: rgba(107, 30, 46, 0.12);
        }

        .pb-inner {
          position: relative;
          z-index: 1;
        }

        .pb-card {
          position: relative;
          border-radius: var(--radius-xl);
          background: linear-gradient(
            155deg,
            rgba(255, 253, 249, 0.97) 0%,
            var(--cream) 38%,
            rgba(250, 243, 232, 0.92) 100%
          );
          border: 1px solid rgba(201, 168, 76, 0.35);
          box-shadow:
            0 0 0 1px rgba(107, 30, 46, 0.06),
            0 28px 56px rgba(42, 21, 24, 0.12),
            0 12px 28px rgba(107, 30, 46, 0.08);
          overflow: visible;
        }

        .pb-ribbon {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px 7px 12px;
          border-radius: 999px;
          font-family: "Outfit", sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--maroon-deep);
          background: linear-gradient(135deg, #fff6d8 0%, var(--gold) 55%, #e8c85c 100%);
          border: 1px solid rgba(107, 30, 46, 0.2);
          box-shadow:
            0 4px 14px rgba(201, 168, 76, 0.45),
            inset 0 1px 0 rgba(255, 253, 249, 0.65);
        }

        .pb-accent-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
          background: linear-gradient(
            90deg,
            var(--maroon-deep) 0%,
            var(--maroon) 28%,
            var(--gold) 52%,
            var(--maroon-soft) 100%
          );
          opacity: 1;
        }

        .pb-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(200px, 0.88fr);
          gap: clamp(24px, 4vw, 40px);
          padding: clamp(30px, 4.5vw, 44px);
          padding-top: clamp(34px, 5vw, 48px);
          align-items: stretch;
        }

        .pb-kicker-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 16px;
        }

        .pb-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px 8px 12px;
          border-radius: 999px;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--maroon);
          background: linear-gradient(135deg, rgba(107, 30, 46, 0.1), rgba(201, 168, 76, 0.14));
          border: 1px solid rgba(107, 30, 46, 0.22);
          box-shadow: 0 2px 10px rgba(107, 30, 46, 0.08);
        }

        .pb-kicker-ico {
          color: var(--gold);
          flex-shrink: 0;
        }

        .pb-kicker-sub {
          font-size: 12px;
          font-weight: 600;
          color: rgba(42, 21, 24, 0.55);
          max-width: 28rem;
          line-height: 1.45;
        }

        .pb-title {
          margin: 0 0 16px;
          font-family: "Outfit", sans-serif;
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 1.05;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pb-title-line1 {
          font-size: clamp(1.95rem, 4.5vw, 2.85rem);
          background: linear-gradient(118deg, var(--maroon-deep) 0%, var(--maroon) 42%, var(--maroon-soft) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .pb-title-line2 {
          font-size: clamp(1.25rem, 2.8vw, 1.65rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: rgba(42, 21, 24, 0.72);
        }

        .pb-title-highlight {
          display: inline-block;
          padding: 2px 10px;
          margin-left: 4px;
          border-radius: 999px;
          font-weight: 800;
          color: var(--maroon-deep);
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.35), rgba(201, 168, 76, 0.12));
          border: 1px solid rgba(201, 168, 76, 0.45);
          box-shadow: 0 2px 12px rgba(201, 168, 76, 0.25);
        }

        .pb-lede {
          margin: 0 0 22px;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: clamp(15px, 1.55vw, 17px);
          font-weight: 500;
          line-height: 1.65;
          max-width: 36rem;
          color: rgba(42, 21, 24, 0.68);
        }

        .pb-perks {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin: 0 0 28px;
          padding: 0;
        }

        .pb-perk {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: var(--radius-md);
          background: var(--white);
          border: 1px solid rgba(201, 168, 76, 0.28);
          box-shadow:
            0 4px 16px rgba(42, 21, 24, 0.06),
            inset 0 1px 0 rgba(255, 253, 249, 0.9);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .pb-perk:hover {
          transform: translateY(-2px);
          box-shadow:
            0 10px 28px rgba(107, 30, 46, 0.1),
            inset 0 1px 0 rgba(255, 253, 249, 0.95);
        }

        .pb-perk-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(145deg, rgba(201, 168, 76, 0.28), rgba(107, 30, 46, 0.12));
          color: var(--maroon);
          border: 1px solid rgba(201, 168, 76, 0.35);
        }

        .pb-perk-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 13px;
          color: rgba(42, 21, 24, 0.58);
        }

        .pb-perk-text strong {
          font-size: 14px;
          font-weight: 800;
          color: var(--maroon);
        }

        .pb-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }

        .pb-btn-main {
          text-decoration: none;
          box-shadow:
            0 4px 0 rgba(74, 16, 32, 0.35),
            0 14px 32px rgba(107, 30, 46, 0.28);
        }

        .pb-btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 22px;
          border-radius: 999px;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          color: var(--maroon);
          background: var(--white);
          border: 2px solid rgba(107, 30, 46, 0.2);
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.3s ease,
            border-color 0.25s ease,
            background 0.25s ease;
        }

        .pb-btn-outline:hover {
          transform: translateY(-2px);
          border-color: rgba(201, 168, 76, 0.55);
          box-shadow: var(--shadow-md);
          background: linear-gradient(135deg, var(--white), var(--cream-dark));
        }

        .pb-panel {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 16px;
          padding: clamp(22px, 3vw, 28px);
          border-radius: var(--radius-lg);
          background: linear-gradient(165deg, var(--white) 0%, rgba(255, 253, 249, 0.96) 100%);
          border: 2px dashed rgba(201, 168, 76, 0.45);
          box-shadow:
            0 0 0 4px rgba(201, 168, 76, 0.08),
            0 16px 40px rgba(42, 21, 24, 0.08);
          overflow: hidden;
        }

        .pb-panel-shine {
          position: absolute;
          inset: -40% -20% auto;
          height: 55%;
          background: linear-gradient(
            125deg,
            transparent 30%,
            rgba(255, 253, 249, 0.55) 48%,
            transparent 62%
          );
          transform: rotate(-8deg);
          pointer-events: none;
        }

        .pb-panel-eyebrow {
          margin: 0 0 4px;
          font-family: "Outfit", sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
        }

        .pb-stat {
          position: relative;
          z-index: 1;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(232, 216, 188, 0.9);
        }

        .pb-stat-alt {
          padding-bottom: 0;
          border-bottom: none;
        }

        .pb-stat-value {
          display: block;
          font-family: "Outfit", sans-serif;
          font-size: clamp(1.85rem, 3.2vw, 2.35rem);
          font-weight: 900;
          letter-spacing: -0.035em;
          line-height: 1.05;
          margin-bottom: 6px;
          color: var(--maroon);
        }

        .pb-stat-alt .pb-stat-value {
          font-size: clamp(2.1rem, 3.6vw, 2.65rem);
          background: linear-gradient(118deg, var(--maroon-deep), var(--gold));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .pb-stat-label {
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 600;
          color: rgba(42, 21, 24, 0.58);
        }

        .pb-panel-note {
          position: relative;
          z-index: 1;
          margin: 4px 0 0;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 12px;
          line-height: 1.55;
          color: rgba(42, 21, 24, 0.52);
        }

        @media (max-width: 900px) {
          .pb-ribbon {
            top: 12px;
            right: 12px;
            font-size: 10px;
            letter-spacing: 0.1em;
            padding: 6px 11px 6px 9px;
          }

          .pb-layout {
            grid-template-columns: 1fr;
          }

          .pb-kicker-wrap {
            padding-right: 0;
          }

          .pb-panel {
            flex-direction: column;
            gap: 12px;
            justify-content: flex-start;
          }

          .pb-panel-eyebrow {
            flex: 1 1 100%;
            order: -1;
          }

          .pb-stat {
            flex: 0 1 auto;
            border-bottom: none;
            padding-bottom: 0;
            border-right: none;
            padding-right: 0;
          }

          .pb-stat-alt {
            border-right: none;
            padding-right: 0;
          }

          .pb-panel-note {
            flex: 1 1 100%;
            border-top: 1px solid rgba(232, 216, 188, 0.9);
            padding-top: 8px;
            margin-top: 4px;
          }
        }

        @media (max-width: 640px) {
          .pb-section {
            padding: clamp(40px, 5vw, 52px) 0;
          }

          .pb-layout {
            padding: clamp(20px, 4vw, 24px);
            padding-top: clamp(24px, 4.5vw, 28px);
            gap: clamp(16px, 3vw, 20px);
          }

          .pb-ribbon {
            top: 10px;
            right: 10px;
            font-size: 9px;
            padding: 5px 9px 5px 8px;
          }

          .pb-kicker-wrap {
            padding-right: 0;
            margin-bottom: 12px;
          }

          .pb-title-line1 {
            font-size: clamp(1.5rem, 3.5vw, 1.95rem);
          }

          .pb-title-line2 {
            font-size: clamp(0.95rem, 2.2vw, 1.25rem);
          }

          .pb-lede {
            font-size: clamp(13px, 1.4vw, 15px);
            margin-bottom: 18px;
          }

          .pb-perks {
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
          }

          .pb-perk {
            padding: 12px 14px;
            gap: 10px;
          }

          .pb-perk-icon {
            width: 40px;
            height: 40px;
          }

          .pb-perk-text {
            font-size: 12px;
            gap: 1px;
          }

          .pb-perk-text strong {
            font-size: 13px;
          }

          .pb-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }

          .pb-btn-main,
          .pb-btn-outline {
            width: 100%;
            justify-content: center;
            padding: 12px 16px;
            font-size: 13px;
          }

          .pb-panel {
            flex-direction: column;
            gap: 6px;
            padding: 12px 14px;
            min-height: auto;
            justify-content: flex-start;
          }

          .pb-panel-shine {
            inset: -50% -20% auto;
            height: 35%;
            opacity: 0.4;
          }

          .pb-stat {
            border-right: none;
            padding-right: 0;
            border-bottom: 1px solid rgba(232, 216, 188, 0.9);
            padding-bottom: 6px;
            margin-bottom: 6px;
          }

          .pb-stat:last-of-type {
            border-bottom: none;
            padding-bottom: 0;
            margin-bottom: 0;
          }

          .pb-stat-alt {
            border-bottom: none;
            padding-bottom: 0;
            margin-bottom: 0;
          }

          .pb-panel-eyebrow {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.15em;
            margin-bottom: 4px;
            color: var(--gold);
          }

          .pb-stat-value {
            font-size: clamp(1.1rem, 2.2vw, 1.35rem);
            margin-bottom: 1px;
            font-weight: 900;
            line-height: 1.1;
          }

          .pb-stat-alt .pb-stat-value {
            font-size: clamp(1.35rem, 2.6vw, 1.6rem);
          }

          .pb-stat-label {
            font-size: 10px;
            line-height: 1.3;
            color: rgba(42, 21, 24, 0.58);
            word-wrap: break-word;
            word-break: break-word;
          }

          .pb-panel-note {
            font-size: 9px;
            margin-top: 6px;
            line-height: 1.35;
            color: rgba(42, 21, 24, 0.52);
            word-wrap: break-word;
            word-break: break-word;
          }
        }

        @media (max-width: 480px) {
          .pb-card {
            border-radius: var(--radius-lg);
          }

          .pb-ribbon {
            top: 8px;
            right: 8px;
            font-size: 8px;
          }

          .pb-kicker {
            font-size: 10px;
            padding: 6px 10px 6px 8px;
          }

          .pb-kicker-sub {
            font-size: 10px;
          }

          .pb-layout {
            padding: 16px 14px;
            padding-top: 20px;
          }

          .pb-panel {
            padding: 10px 12px;
            gap: 4px;
          }

          .pb-panel-eyebrow {
            font-size: 9px;
          }

          .pb-stat-value {
            font-size: clamp(1rem, 2vw, 1.2rem);
          }

          .pb-stat-label {
            font-size: 9px;
          }

          .pb-panel-note {
            font-size: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pb-perk {
            transition: none;
          }
          .pb-perk:hover {
            transform: none;
          }
          .pb-btn-outline {
            transition: none;
          }
          .pb-btn-outline:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
