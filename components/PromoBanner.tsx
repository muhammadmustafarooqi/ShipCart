"use client";

import Link from "next/link";
import { Sparkles, Truck, WalletCards, ShoppingBag, ArrowRight } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="pb-section" aria-labelledby="promo-banner-heading">
      <div className="pb-ambient" aria-hidden />

      <div className="page-container pb-inner">
        <div className="pb-card">
          <div className="pb-accent-bar" aria-hidden />

          <div className="pb-layout">
            <div className="pb-copy">
              <div className="section-tag pb-kicker">
                <Sparkles size={14} strokeWidth={2.25} aria-hidden />
                Limited time
              </div>

              <h2 id="promo-banner-heading" className="pb-title">
                Free delivery &amp; COD â€”{" "}
                <span className="pb-title-em">built for how you shop</span>
              </h2>

              <p className="pb-lede">
                Nationwide delivery on orders above Rs. 1,500. Pay when your parcel
                arrives â€” no advance, same quality you expect from the catalog.
              </p>

              <ul className="pb-perks" role="list">
                <li className="pb-perk">
                  <span className="pb-perk-icon" aria-hidden>
                    <Truck size={18} strokeWidth={2} />
                  </span>
                  <span className="pb-perk-text">
                    <strong>Free shipping</strong>
                    <span>On carts Rs. 1,500+</span>
                  </span>
                </li>
                <li className="pb-perk">
                  <span className="pb-perk-icon" aria-hidden>
                    <WalletCards size={18} strokeWidth={2} />
                  </span>
                  <span className="pb-perk-text">
                    <strong>COD ready</strong>
                    <span>Pay on delivery</span>
                  </span>
                </li>
              </ul>

              <div className="pb-actions">
                <Link href="/products" className="btn-primary pb-btn-main">
                  <ShoppingBag size={18} strokeWidth={2} aria-hidden />
                  Shop now
                </Link>
                <Link href="/products?featured=true" className="pb-btn-outline">
                  Featured picks
                  <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
                </Link>
              </div>
            </div>

            <aside className="pb-panel" aria-label="Offer highlights">
              <div className="pb-stat">
                <span className="pb-stat-value">Rs. 1,500</span>
                <span className="pb-stat-label">Minimum for free delivery</span>
              </div>
              <div className="pb-stat pb-stat-alt">
                <span className="pb-stat-value">COD</span>
                <span className="pb-stat-label">No advance on standard orders</span>
              </div>
              <p className="pb-panel-note">
                Same dispatch and support flow as the rest of the store â€” perks only
                change how checkout feels.
              </p>
            </aside>
          </div>
        </div>
      </div>

      <style>{`
        .pb-section {
          position: relative;
          padding: clamp(56px, 8vw, 88px) 0;
          background: var(--white);
          border-top: 1px solid var(--border-default);
          border-bottom: 1px solid var(--border-default);
          overflow: hidden;
        }

        .pb-ambient {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 42% at 100% 0%, rgba(201, 168, 76, 0.1), transparent 58%),
            radial-gradient(ellipse 50% 40% at 0% 100%, rgba(107, 30, 46, 0.06), transparent 55%);
        }

        .pb-inner {
          position: relative;
          z-index: 1;
        }

        .pb-card {
          position: relative;
          border-radius: var(--radius-xl);
          background: linear-gradient(165deg, var(--white) 0%, var(--cream) 100%);
          border: 1px solid var(--cream-mid);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        .pb-accent-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--gold), var(--maroon-soft));
          opacity: 0.95;
        }

        .pb-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(200px, 0.88fr);
          gap: clamp(24px, 4vw, 40px);
          padding: clamp(28px, 4.5vw, 40px);
          align-items: stretch;
        }

        .pb-kicker {
          margin-bottom: 14px;
        }

        .pb-title {
          margin: 0 0 14px;
          font-family: "Outfit", sans-serif;
          font-size: clamp(1.85rem, 4vw, 2.65rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.12;
          background: linear-gradient(
            118deg,
            var(--maroon-deep) 0%,
            var(--maroon) 45%,
            var(--maroon-soft) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .pb-title-em {
          background: linear-gradient(118deg, var(--maroon) 0%, var(--gold) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .pb-lede {
          margin: 0 0 22px;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: clamp(15px, 1.55vw, 17px);
          font-weight: 500;
          line-height: 1.65;
          max-width: 36rem;
          color: var(--text-secondary);
        }

        .pb-perks {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin: 0 0 26px;
          padding: 0;
        }

        .pb-perk {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          background: var(--white);
          border: 1px solid var(--cream-mid);
          box-shadow: var(--shadow-sm);
        }

        .pb-perk-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(145deg, rgba(201, 168, 76, 0.18), rgba(107, 30, 46, 0.08));
          color: var(--maroon);
        }

        .pb-perk-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .pb-perk-text strong {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .pb-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }

        .pb-btn-main {
          text-decoration: none;
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
          border: 1px solid var(--cream-mid);
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.3s ease,
            border-color 0.25s ease,
            background 0.25s ease;
        }

        .pb-btn-outline:hover {
          transform: translateY(-2px);
          border-color: rgba(201, 168, 76, 0.5);
          box-shadow: var(--shadow-md);
          background: linear-gradient(135deg, var(--white), var(--cream-dark));
        }

        .pb-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
          padding: clamp(20px, 3vw, 26px);
          border-radius: var(--radius-lg);
          background: var(--white);
          border: 1px solid var(--cream-mid);
          box-shadow: var(--shadow-sm);
        }

        .pb-stat {
          padding-bottom: 16px;
          border-bottom: 1px solid var(--cream-mid);
        }

        .pb-stat-alt {
          padding-bottom: 0;
          border-bottom: none;
        }

        .pb-stat-value {
          display: block;
          font-family: "Outfit", sans-serif;
          font-size: clamp(1.75rem, 3.2vw, 2.25rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 6px;
          color: var(--maroon);
        }

        .pb-stat-alt .pb-stat-value {
          font-size: clamp(2rem, 3.5vw, 2.5rem);
          background: linear-gradient(118deg, var(--maroon-deep), var(--gold));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .pb-stat-label {
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .pb-panel-note {
          margin: 0;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 12px;
          line-height: 1.55;
          color: var(--text-secondary);
          opacity: 0.92;
        }

        @media (max-width: 900px) {
          .pb-layout {
            grid-template-columns: 1fr;
          }

          .pb-panel {
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-start;
          }

          .pb-stat {
            flex: 1 1 140px;
            border-bottom: none;
            padding-bottom: 0;
            border-right: 1px solid var(--cream-mid);
            padding-right: 16px;
          }

          .pb-stat-alt {
            border-right: none;
            padding-right: 0;
          }

          .pb-panel-note {
            flex: 1 1 100%;
          }
        }

        @media (max-width: 640px) {
          .pb-perks {
            flex-direction: column;
          }

          .pb-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .pb-btn-main,
          .pb-btn-outline {
            width: 100%;
            justify-content: center;
          }

          .pb-panel {
            flex-direction: column;
          }

          .pb-stat {
            border-right: none;
            padding-right: 0;
            border-bottom: 1px solid var(--cream-mid);
            padding-bottom: 16px;
          }

          .pb-stat-alt {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      `}</style>
    </section>
  );
}
