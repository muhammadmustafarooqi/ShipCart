"use client";

import { MessageCircle, Clock, Shield, Headphones, ArrowUpRight } from "lucide-react";

const features = [
  { icon: MessageCircle, title: "Fast replies", desc: "Often within minutes" },
  { icon: Clock, title: "Always on", desc: "Night & weekend" },
  { icon: Shield, title: "Private chat", desc: "Your thread stays yours" },
  { icon: Headphones, title: "Real people", desc: "No scripted bots" },
];

function formatWaDisplay(num: string) {
  const digits = num.replace(/\D/g, "");
  if (digits.length >= 12 && digits.startsWith("92")) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return `+${digits}`;
}

export default function WhatsAppCTA() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const message = "Hi! I'd like to know more about your products and latest offers.";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <section className="wa" aria-labelledby="wa-heading">
      <div className="wa-bg" aria-hidden />
      <div className="page-container wa-inner">
        <div className="wa-dock">
          <div className="wa-dock-glow" aria-hidden />

          <div className="wa-main">
            <span className="wa-watermark" aria-hidden>
              <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </span>

            <div className="wa-grid">
              <div className="wa-copy">
                <p className="wa-eyebrow">
                  <span className="wa-dot" aria-hidden />
                  Live on WhatsApp
                </p>
                <h2 id="wa-heading" className="wa-title">
                  Questions before you order?
                  <span className="wa-title-accent">{"We're one tap away."}</span>
                </h2>
                <p className="wa-lead">
                  Stock, sizing, delivery areas, COD — message the same team that confirms your orders. No call queues.
                </p>
              </div>

              <div className="wa-side">
                <p className="wa-pill">
                  <Clock size={14} strokeWidth={2.2} aria-hidden />
                  Typical reply under 10 min
                </p>
                <a href={url} target="_blank" rel="noopener noreferrer" className="wa-btn">
                  <span className="wa-btn-ico" aria-hidden>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  <span className="wa-btn-copy">
                    <span className="wa-btn-title">Open WhatsApp</span>
                    <span className="wa-btn-sub">Free message · same business line</span>
                  </span>
                  <ArrowUpRight className="wa-btn-arrow" size={22} strokeWidth={2.5} aria-hidden />
                </a>
                <p className="wa-num">{formatWaDisplay(whatsappNumber)}</p>
              </div>
            </div>
          </div>

          <div className="wa-wave" aria-hidden>
            <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="wa-wave-svg">
              <path
                fill="currentColor"
                d="M0,32 C240,8 480,8 720,20 C960,32 1200,40 1440,28 L1440,48 L0,48 Z"
              />
            </svg>
          </div>

          <ul className="wa-rail" aria-label="Why message us">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className={`wa-rail-item${i > 0 ? " wa-rail-item--rule" : ""}`}>
                <span className="wa-rail-ico">
                  <Icon size={22} strokeWidth={1.85} aria-hidden />
                </span>
                <span className="wa-rail-title">{title}</span>
                <span className="wa-rail-desc">{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .wa {
          position: relative;
          isolation: isolate;
          padding: 64px 0 96px;
          background: linear-gradient(185deg, var(--cream) 0%, var(--cream-dark) 100%);
          border-top: 1px solid rgba(107, 30, 46, 0.08);
        }

        .wa-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 50% at 100% 0%, rgba(37, 211, 102, 0.07), transparent 55%);
          pointer-events: none;
        }

        .wa-inner {
          position: relative;
          z-index: 1;
        }

        .wa-dock {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
          border-radius: 28px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(201, 168, 76, 0.22),
            0 32px 64px rgba(42, 21, 24, 0.18);
        }

        .wa-dock-glow {
          position: absolute;
          inset: -2px;
          border-radius: 30px;
          background: linear-gradient(135deg, rgba(37, 211, 102, 0.25), transparent 40%, rgba(201, 168, 76, 0.2));
          opacity: 0.45;
          z-index: 0;
          pointer-events: none;
          filter: blur(18px);
        }

        .wa-main {
          position: relative;
          z-index: 1;
          padding: clamp(32px, 5vw, 44px) clamp(24px, 4vw, 40px) clamp(28px, 4vw, 36px);
          background: linear-gradient(
            155deg,
            #2a0f18 0%,
            var(--maroon-deep) 35%,
            var(--maroon) 92%
          );
        }

        .wa-watermark {
          position: absolute;
          right: -4%;
          top: 50%;
          transform: translateY(-50%);
          font-size: clamp(10rem, 28vw, 16rem);
          color: rgba(255, 253, 249, 0.04);
          pointer-events: none;
          line-height: 1;
        }

        .wa-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.15fr minmax(260px, 320px);
          gap: clamp(24px, 4vw, 40px);
          align-items: center;
        }

        .wa-copy {
          text-align: left;
        }

        .wa-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 16px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(232, 212, 160, 0.95);
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        .wa-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #25d366;
          box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4);
          animation: wa-breathe 2.4s ease-in-out infinite;
        }

        @keyframes wa-breathe {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.35);
          }
          50% {
            box-shadow: 0 0 0 12px rgba(37, 211, 102, 0);
          }
        }

        .wa-title {
          margin: 0 0 14px;
          font-family: Outfit, sans-serif;
          font-size: clamp(1.65rem, 3.8vw, 2.35rem);
          font-weight: 900;
          letter-spacing: -0.038em;
          line-height: 1.1;
          color: var(--white);
        }

        .wa-title-accent {
          display: block;
          margin-top: 6px;
          font-size: clamp(1.1rem, 2.4vw, 1.45rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          background: linear-gradient(110deg, #fff6d8 0%, var(--gold) 45%, #e8d48a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @supports not (background-clip: text) {
          .wa-title-accent {
            color: var(--gold);
            -webkit-text-fill-color: unset;
            background: none;
          }
        }

        .wa-lead {
          margin: 0;
          max-width: 34rem;
          font-size: clamp(0.92rem, 1.5vw, 1.02rem);
          line-height: 1.65;
          font-weight: 500;
          color: rgba(250, 243, 232, 0.82);
        }

        .wa-side {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 14px;
        }

        .wa-pill {
          margin: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          align-self: center;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(250, 243, 232, 0.95);
          background: rgba(37, 211, 102, 0.12);
          border: 1px solid rgba(37, 211, 102, 0.35);
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        .wa-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 17px 20px;
          border-radius: 18px;
          text-decoration: none;
          color: #063517;
          background: linear-gradient(180deg, #3ef48a 0%, #25d366 48%, #1ebe5d 100%);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-weight: 800;
          box-shadow:
            0 4px 0 rgba(12, 80, 40, 0.35),
            0 18px 40px rgba(0, 0, 0, 0.35);
          transition: transform 0.35s cubic-bezier(0.33, 1, 0.32, 1), box-shadow 0.35s ease, filter 0.25s ease;
        }

        .wa-btn:hover {
          transform: translateY(-5px) scale(1.01);
          filter: brightness(1.05);
          box-shadow:
            0 6px 0 rgba(12, 80, 40, 0.28),
            0 26px 52px rgba(0, 0, 0, 0.38);
        }

        .wa-btn-ico {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.38);
          color: #075e54;
        }

        .wa-btn-copy {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 3px;
          text-align: left;
        }

        .wa-btn-title {
          font-size: 1.05rem;
          letter-spacing: 0.01em;
        }

        .wa-btn-sub {
          font-size: 11px;
          font-weight: 600;
          opacity: 0.88;
        }

        .wa-btn-arrow {
          flex-shrink: 0;
          opacity: 0.9;
          transition: transform 0.35s cubic-bezier(0.33, 1, 0.32, 1);
        }

        .wa-btn:hover .wa-btn-arrow {
          transform: translate(4px, -4px);
        }

        .wa-num {
          margin: 0;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(232, 212, 160, 0.75);
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        .wa-wave {
          position: relative;
          z-index: 1;
          line-height: 0;
          margin-top: -1px;
          color: #10060a;
        }

        .wa-wave-svg {
          display: block;
          width: 100%;
          height: clamp(28px, 4vw, 40px);
        }

        .wa-rail {
          list-style: none;
          margin: 0;
          padding: clamp(22px, 3vw, 30px) clamp(16px, 3vw, 28px) clamp(24px, 3vw, 32px);
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0;
          background: linear-gradient(180deg, #10060a 0%, #1a0d14 100%);
          border-top: 1px solid rgba(201, 168, 76, 0.22);
        }

        .wa-rail-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          padding: 8px 12px;
          transition: transform 0.3s cubic-bezier(0.33, 1, 0.32, 1), background 0.3s ease;
        }

        .wa-rail-item:hover {
          transform: translateY(-3px);
        }

        .wa-rail-item--rule {
          border-left: 1px solid rgba(201, 168, 76, 0.2);
        }

        .wa-rail-ico {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          background: rgba(201, 168, 76, 0.1);
          border: 1px solid rgba(201, 168, 76, 0.28);
        }

        .wa-rail-title {
          font-family: Outfit, sans-serif;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #fffdf9;
        }

        .wa-rail-desc {
          font-size: 12px;
          font-weight: 500;
          line-height: 1.45;
          color: rgba(250, 243, 232, 0.78);
          max-width: 11rem;
        }

        @media (max-width: 900px) {
          .wa-watermark {
            display: none;
          }
          .wa-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .wa-copy {
            text-align: center;
          }
          .wa-eyebrow {
            justify-content: center;
          }
          .wa-lead {
            margin-left: auto;
            margin-right: auto;
          }
          .wa-side {
            max-width: 360px;
            margin-left: auto;
            margin-right: auto;
          }
          .wa-rail {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px 16px;
          }
          .wa-rail-item--rule {
            border-left: none;
          }
        }

        @media (max-width: 520px) {
          .wa {
            padding: 48px 0 72px;
          }
          .wa-dock {
            border-radius: 22px;
          }
          .wa-rail {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .wa-rail-item:nth-child(n + 2) {
            border-top: 1px solid rgba(201, 168, 76, 0.12);
            padding-top: 20px;
            margin-top: 4px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wa-dot {
            animation: none;
          }
          .wa-btn,
          .wa-btn-arrow,
          .wa-rail-item {
            transition: none;
          }
          .wa-btn:hover {
            transform: none;
          }
          .wa-btn:hover .wa-btn-arrow {
            transform: none;
          }
          .wa-rail-item:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
