"use client";

import { useState, useEffect } from "react";
import { Users, Package, MapPin, Star, TrendingUp, Award, Truck, Shield, Clock } from "lucide-react";

interface Stat {
  _id: string;
  value: string;
  label: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setStats(data);
          }
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = { 
      users: Users, 
      package: Package, 
      truck: Truck,
      shield: Shield,
      clock: Clock,
      star: Star, 
      trending: TrendingUp, 
      award: Award 
    };
    return icons[iconName.toLowerCase()] || Package;
  };

  if (loading || stats.length === 0) return null;
  
  return (
    <section className="stats-showcase" aria-label="Store highlights">
      <div className="stats-showcase-blobs" aria-hidden>
        <span className="stats-blob stats-blob-a" />
        <span className="stats-blob stats-blob-b" />
      </div>

      <div className="page-container stats-showcase-inner">
        <header className="stats-showcase-head">
          <span className="stats-showcase-line" aria-hidden />
          <p className="stats-showcase-kicker">Trusted across Pakistan</p>
          <span className="stats-showcase-line" aria-hidden />
        </header>

        <ul className="stats-showcase-grid">
          {stats.map((stat) => {
            const Icon = getIcon(stat.icon);
            return (
              <li key={stat._id} className="stats-showcase-card">
                <div className="stats-showcase-card-border" aria-hidden />
                <div className="stats-showcase-card-glow" aria-hidden />
                <div className="stats-showcase-card-body">
                  <Icon className="stats-showcase-watermark" size={88} strokeWidth={1.25} aria-hidden />
                  <div className="stats-showcase-icon-ring">
                    <Icon size={22} strokeWidth={2.2} aria-hidden />
                  </div>
                  <p className="stats-showcase-value">{stat.value}</p>
                  <p className="stats-showcase-label">{stat.label}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        .stats-showcase {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          padding: 64px 0 80px;
          background:
            radial-gradient(ellipse 80% 55% at 50% -20%, rgba(107, 30, 46, 0.07), transparent 55%),
            linear-gradient(180deg, var(--cream-dark) 0%, var(--cream) 38%, var(--white) 100%);
          border-top: 1px solid var(--border-default);
          border-bottom: none;
        }

        .stats-showcase-blobs {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .stats-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(64px);
          opacity: 0.45;
        }

        .stats-blob-a {
          width: 280px;
          height: 280px;
          background: rgba(201, 168, 76, 0.22);
          top: -120px;
          right: -80px;
        }

        .stats-blob-b {
          width: 200px;
          height: 200px;
          background: rgba(107, 30, 46, 0.1);
          bottom: -48px;
          left: -48px;
          opacity: 0.35;
        }

        .stats-showcase-inner {
          position: relative;
          z-index: 1;
        }

        .stats-showcase-head {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 36px;
        }

        .stats-showcase-line {
          flex: 1;
          max-width: 120px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(107, 30, 46, 0.25),
            var(--gold),
            rgba(107, 30, 46, 0.25),
            transparent
          );
        }

        .stats-showcase-kicker {
          margin: 0;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--maroon);
          font-family: "Plus Jakarta Sans", sans-serif;
          white-space: nowrap;
        }

        .stats-showcase-grid {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
          align-items: start;
        }

        .stats-showcase-card {
          position: relative;
          border-radius: calc(var(--radius-lg) + 4px);
          padding: 2px;
          background: linear-gradient(
            145deg,
            rgba(201, 168, 76, 0.55) 0%,
            rgba(107, 30, 46, 0.35) 45%,
            rgba(201, 168, 76, 0.35) 100%
          );
          box-shadow:
            0 4px 0 rgba(107, 30, 46, 0.06),
            0 18px 40px rgba(42, 21, 24, 0.08);
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
        }

        .stats-showcase-card:nth-child(1) { transform: translateY(0); }
        .stats-showcase-card:nth-child(2) { transform: translateY(10px); }
        .stats-showcase-card:nth-child(3) { transform: translateY(0); }
        .stats-showcase-card:nth-child(4) { transform: translateY(10px); }

        .stats-showcase-card:nth-child(1):hover,
        .stats-showcase-card:nth-child(3):hover {
          transform: translateY(-8px) !important;
          box-shadow:
            0 6px 0 rgba(107, 30, 46, 0.05),
            0 28px 50px rgba(42, 21, 24, 0.12);
        }

        .stats-showcase-card:nth-child(2):hover,
        .stats-showcase-card:nth-child(4):hover {
          transform: translateY(2px) !important;
          box-shadow:
            0 6px 0 rgba(107, 30, 46, 0.05),
            0 28px 50px rgba(42, 21, 24, 0.12);
        }

        .stats-showcase-card-border {
          position: absolute;
          inset: 2px;
          border-radius: var(--radius-lg);
          background: var(--white);
          z-index: 0;
        }

        .stats-showcase-card-glow {
          position: absolute;
          inset: 2px;
          border-radius: var(--radius-lg);
          background: radial-gradient(
            120% 80% at 50% -10%,
            rgba(201, 168, 76, 0.12),
            transparent 55%
          );
          z-index: 0;
          pointer-events: none;
        }

        .stats-showcase-card-body {
          position: relative;
          z-index: 1;
          border-radius: var(--radius-lg);
          padding: 26px 18px 24px;
          text-align: center;
          overflow: hidden;
          min-height: 168px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .stats-showcase-watermark {
          position: absolute;
          top: 6px;
          right: -14px;
          color: var(--maroon);
          opacity: 0.06;
          pointer-events: none;
        }

        .stats-showcase-icon-ring {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--maroon);
          background: linear-gradient(180deg, var(--cream) 0%, var(--cream-dark) 100%);
          border: 2px solid rgba(201, 168, 76, 0.45);
          box-shadow: 0 4px 12px rgba(107, 30, 46, 0.1);
        }

        .stats-showcase-value {
          margin: 0 0 8px;
          padding-top: 8px;
          font-family: Outfit, sans-serif;
          font-size: clamp(1.75rem, 3.2vw, 2.35rem);
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 1;
          background: linear-gradient(125deg, var(--maroon-deep) 0%, var(--maroon) 42%, var(--maroon-soft) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @supports not (background-clip: text) {
          .stats-showcase-value {
            color: var(--maroon);
            -webkit-text-fill-color: unset;
            background: none;
          }
        }

        .stats-showcase-label {
          margin: 0;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: "Plus Jakarta Sans", sans-serif;
          line-height: 1.35;
          max-width: 12rem;
        }

        @media (max-width: 900px) {
          .stats-showcase-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }
          .stats-showcase-card:nth-child(2),
          .stats-showcase-card:nth-child(4) {
            transform: translateY(0);
          }
        }

        @media (max-width: 480px) {
          .stats-showcase {
            padding: 48px 0 56px;
          }
          .stats-showcase-head {
            margin-bottom: 28px;
          }
          .stats-showcase-line {
            max-width: 48px;
          }
          .stats-showcase-kicker {
            letter-spacing: 0.12em;
            font-size: 10px;
          }
          .stats-showcase-grid {
            grid-template-columns: 1fr;
            max-width: 360px;
            margin: 0 auto;
          }
          .stats-showcase-card:nth-child(n) {
            transform: translateY(0) !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .stats-showcase-card {
            transition: none;
          }
          .stats-showcase-card:nth-child(n) {
            transform: none !important;
          }
          .stats-showcase-card:nth-child(1):hover,
          .stats-showcase-card:nth-child(2):hover,
          .stats-showcase-card:nth-child(3):hover,
          .stats-showcase-card:nth-child(4):hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
