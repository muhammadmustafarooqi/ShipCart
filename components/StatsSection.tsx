"use client";

import { Package, Users, Award, HeadphonesIcon } from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "50k+",
      label: "Happy Customers",
      desc: "Trusting our brand across Pakistan",
    },
    {
      icon: Package,
      value: "100k+",
      label: "Orders Delivered",
      desc: "Fast and reliable shipping",
    },
    {
      icon: Award,
      value: "100%",
      label: "Genuine Products",
      desc: "Quality guaranteed on all items",
    },
    {
      icon: HeadphonesIcon,
      value: "24/7",
      label: "Customer Support",
      desc: "We're here to help anytime",
    },
  ];

  return (
    <section className="stats-section">
      <div className="page-container">
        <div className="stats-grid">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="stat-card">
                <div className="stat-icon-wrapper">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <p className="stat-desc">{stat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .stats-section {
          padding: 80px 0;
          background: var(--white);
          border-top: 1px solid var(--border-default);
          border-bottom: 1px solid var(--border-default);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .stat-card {
          text-align: center;
          padding: 32px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          background: rgba(255, 97, 2, 0.1);
          color: var(--orange);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .stat-value {
          font-family: var(--font-outfit), sans-serif;
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--navy);
          margin-bottom: 8px;
          line-height: 1;
        }

        .stat-label {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 8px;
        }

        .stat-desc {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 0.9rem;
          color: var(--slate);
          margin: 0;
          line-height: 1.5;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .stat-card {
            border: 1px solid var(--border-default);
            border-radius: var(--radius-lg);
          }
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
