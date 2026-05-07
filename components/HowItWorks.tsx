"use client";

import { Search, ClipboardList, Package, Banknote, ShoppingBag } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <Search size={32} color="var(--color-icon)" />,
    title: "Browse & Select",
    description: "Explore our premium collection of 500+ products. Filter by category, price, and rating to find exactly what you need.",
  },
  {
    number: "02",
    icon: <ClipboardList size={32} color="var(--color-icon)" />,
    title: "Place Your Order",
    description: "Add items to cart and fill in your delivery details. No account required, no advance payment needed.",
  },
  {
    number: "03",
    icon: <Package size={32} color="var(--color-icon)" />,
    title: "We Pack & Ship",
    description: "Your order is carefully packed and dispatched within 1–2 business days to your doorstep anywhere in Pakistan.",
  },
  {
    number: "04",
    icon: <Banknote size={32} color="var(--color-icon)" />,
    title: "Pay on Delivery",
    description: "Receive your order, inspect it, then pay cash. No risk, no hassle — 100% satisfaction guaranteed.",
  },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: "80px 0", background: "var(--bg-primary)" }}>
      <div className="page-container">
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div className="section-tag" style={{ justifyContent: "center" }}><ShoppingBag size={14} color="var(--color-icon)" /> Simple Process</div>
          <h2 className="section-title">How It Works</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "480px", margin: "12px auto 0", fontWeight: 500 }}>
            Shopping with us is easy, safe, and completely risk-free
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          position: "relative",
        }} className="how-grid">
          {/* Connecting line */}
          <div style={{
            position: "absolute",
            top: "52px",
            left: "12.5%",
            right: "12.5%",
            height: "2px",
            background: "var(--border-default)",
            zIndex: 0,
          }} className="connector-line" />

          {steps.map((step, i) => (
            <div key={step.number} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              {/* Circle */}
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "var(--color-brand-dim)",
                border: "3px solid var(--border-default)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                position: "relative",
                transition: "all 0.3s ease",
              }}>
                {step.icon}
                <div style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "var(--color-brand)",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Outfit, sans-serif",
                }}>
                  {i + 1}
                </div>
              </div>

              <div style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
                borderRadius: "20px",
                padding: "28px 20px",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.3s ease",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-brand)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
                }}
              >
                <div style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "var(--color-brand)",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}>{step.number}</div>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "12px",
                  fontFamily: "Outfit, sans-serif",
                }}>{step.title}</h3>
                <p style={{
                  color: "var(--text-secondary)",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  fontWeight: 500,
                }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.how-grid{grid-template-columns:repeat(2,1fr)!important;} .connector-line{display:none!important;}}
        @media(max-width:500px){.how-grid{grid-template-columns:1fr!important;}}
      `}</style>
    </section>
  );
}
