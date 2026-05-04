import { Shield, Truck, RotateCcw, Banknote } from "lucide-react";

const badges = [
  {
    icon: <Shield size={28} color="#ff6b00" />,
    title: "100% Original",
    desc: "All products are authentic and quality checked",
  },
  {
    icon: <Banknote size={28} color="#ff6b00" />,
    title: "Cash on Delivery",
    desc: "Pay when you receive your order. No advance payment",
  },
  {
    icon: <RotateCcw size={28} color="#ff6b00" />,
    title: "Easy Returns",
    desc: "7-day hassle-free return policy on all products",
  },
  {
    icon: <Truck size={28} color="#ff6b00" />,
    title: "Fast Shipping",
    desc: "Delivery across Pakistan in 3-5 business days",
  },
];

export default function TrustBadges() {
  return (
    <section style={{ padding: "40px 0", background: "#f9fafb", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
      <div className="page-container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}>
          {badges.map((badge) => (
            <div key={badge.title} className="trust-badge">
              <div className="icon-wrap">{badge.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#1f2937", marginBottom: "2px" }}>
                  {badge.title}
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.4 }}>
                  {badge.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
