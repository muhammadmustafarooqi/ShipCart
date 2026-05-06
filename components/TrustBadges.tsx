import { ShieldCheck, Truck, RefreshCw, Wallet } from "lucide-react";

const badges = [
  { icon: ShieldCheck, title: "100% Original", desc: "Authentic quality-checked" },
  { icon: Wallet, title: "Cash on Delivery", desc: "Pay when order arrives" },
  { icon: RefreshCw, title: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: Truck, title: "Fast Shipping", desc: "Delivery in 3–5 days" },
];

export default function TrustBadges() {
  return (
    <section className="trust-row">
      <div className="page-container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "24px" }}>
          {badges.map((b) => (
            <div key={b.title} className="trust-badge" style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ 
                width: "48px", height: "48px", 
                background: "var(--bg-primary)", 
                borderRadius: "12px", 
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--color-brand)",
                flexShrink: 0,
                border: "1px solid var(--border-default)"
              }}>
                <b.icon size={24} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px", fontFamily: "Outfit, sans-serif" }}>{b.title}</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.4, fontWeight: 500 }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
