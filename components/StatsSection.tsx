"use client";

import { Users, Package, MapPin, Star } from "lucide-react";

const stats = [
  { value: "10K+", label: "Happy Customers", icon: <Users size={40} color="var(--color-icon)" /> },
  { value: "500+", label: "Premium Products", icon: <Package size={40} color="var(--color-icon)" /> },
  { value: "50+", label: "Cities Delivered", icon: <MapPin size={40} color="var(--color-icon)" /> },
  { value: "4.9", label: "Average Rating", icon: <Star size={40} color="var(--color-icon)" /> },
];

export default function StatsSection() {
  return (
    <section style={{ 
      background: "var(--bg-primary)", 
      borderTop: "1px solid var(--border-default)",
      borderBottom: "1px solid var(--border-default)",
      padding: "64px 0",
      position: "relative",
      overflow: "hidden"
    }}>

      <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(4, 1fr)", 
          gap: "0",
          textAlign: "center"
        }} className="stats-grid">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "24px 16px",
                borderRight: i < stats.length - 1 ? "1px solid var(--border-default)" : "none",
              }}
            >
              <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>{stat.icon}</div>
              <div style={{
                fontSize: "clamp(2rem, 3vw, 2.8rem)",
                fontWeight: 900,
                color: "var(--text-primary)",
                fontFamily: "Outfit, sans-serif",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}>{stat.value}</div>
              <div style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                fontWeight: 600,
                marginTop: "6px",
                letterSpacing: "0.5px"
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:640px){.stats-grid{grid-template-columns:repeat(2,1fr)!important;} .stats-grid>div{border-right:none!important; border-bottom:1px solid var(--border-default);}}`}</style>
    </section>
  );
}
