"use client";

import Link from "next/link";
import { Zap, Package, RefreshCw, Gem, ArrowRight } from "lucide-react";

export default function WhatsAppCTA() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const message = "Hi! I'd like to know more about your products and latest offers.";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <section style={{
      padding: "80px 0",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative elements */}
      <div style={{ position: "absolute", top: "-120px", right: "5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "-120px", left: "5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />

      {/* Floating dots pattern */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "center",
        }} className="cta-grid">
          {/* Left content */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.3)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-brand)", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: "12px", color: "var(--color-brand)", fontWeight: 700, fontFamily: "Outfit, sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>Live Support</span>
            </div>
            <h2 style={{
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              marginBottom: "20px",
              fontFamily: "Outfit, sans-serif",
              letterSpacing: "-0.03em",
            }}>
              Need Help Choosing?<br />
              <span style={{ color: "var(--color-brand)" }}>Chat With Us!</span>
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "16px", lineHeight: 1.7, marginBottom: "36px", fontWeight: 500, maxWidth: "440px" }}>
              Our friendly team is available on WhatsApp to help you find the perfect product, track your order, or answer any questions.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "var(--color-brand)",
                  color: "white",
                  padding: "16px 32px",
                  borderRadius: "100px",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "15px",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  boxShadow: "0 8px 32px rgba(37,99,235,0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(37,99,235,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(37,99,235,0.3)";
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Start WhatsApp Chat
              </a>
              <Link
                href="/products"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  padding: "16px 32px",
                  borderRadius: "100px",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "15px",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                }}
              >
                Browse Store →
              </Link>
            </div>
          </div>

          {/* Right — benefit pills */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { icon: <Zap size={24} color="var(--color-icon)" />, title: "Instant Response", desc: "Get replies within minutes on WhatsApp" },
              { icon: <Package size={24} color="var(--color-icon)" />, title: "Order Tracking", desc: "Track your package in real-time" },
              { icon: <RefreshCw size={24} color="var(--color-icon)" />, title: "Easy Returns", desc: "Hassle-free 7-day return process" },
              { icon: <Gem size={24} color="var(--color-icon)" />, title: "Exclusive Deals", desc: "Get WhatsApp-only special discounts" },
            ].map((item) => (
              <div key={item.title} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                backdropFilter: "blur(8px)",
                transition: "all 0.3s ease",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
              >
                <div style={{ fontSize: "28px", flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "15px", fontFamily: "Outfit, sans-serif", marginBottom: "2px" }}>{item.title}</div>
                  <div style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 500 }}>{item.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", color: "var(--color-icon)" }}><ArrowRight size={18} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @media(max-width:900px){.cta-grid{grid-template-columns:1fr!important; gap:40px!important;}}
      `}</style>
    </section>
  );
}
