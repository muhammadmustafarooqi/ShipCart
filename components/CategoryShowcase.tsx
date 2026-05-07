"use client";

import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/lib/utils";

const categoryImages: Record<string, { bg: string; img: string }> = {
  "kitchen-cooking": {
    bg: "linear-gradient(135deg, #fef3c7, #fde68a)",
    img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400",
  },
  "personal-care-beauty": {
    bg: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400",
  },
  "home-cleaning": {
    bg: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400",
  },
  "fitness-health": {
    bg: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400",
  },
  "electronics-gadgets": {
    bg: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
    img: "https://images.unsplash.com/photo-1558002038-103792e1972d?auto=format&fit=crop&q=80&w=400",
  },
  "baby-kids": {
    bg: "linear-gradient(135deg, #fef9c3, #fef08a)",
    img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=400",
  },
};

export default function CategoryShowcase() {
  return (
    <section style={{ padding: "80px 0", background: "var(--bg-primary)" }}>
      <div className="page-container">
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div className="section-tag" style={{ justifyContent: "center" }}>🗂️ Browse by Category</div>
          <h2 className="section-title">Shop by Category</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "480px", margin: "12px auto 0", fontWeight: 500 }}>
            Explore our hand-picked categories crafted for every need
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }} className="cat-showcase-grid">
          {PRODUCT_CATEGORIES.map((cat) => {
            const style = categoryImages[cat.slug] || { bg: "linear-gradient(135deg, #f1f5f9, #e2e8f0)", img: "" };
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    position: "relative",
                    height: "200px",
                    background: style.bg,
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: "var(--shadow-sm)",
                    border: "1px solid var(--border-default)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-6px) scale(1.01)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xl)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                  }}
                >
                  {/* Background image */}
                  {style.img && (
                    <div style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      width: "55%",
                      height: "100%",
                      backgroundImage: `url(${style.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      maskImage: "linear-gradient(to left, rgba(0,0,0,0.7), transparent)",
                      WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.7), transparent)",
                    }} />
                  )}

                  {/* Content */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>{cat.icon}</div>
                    <div style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 800,
                      fontSize: "18px",
                      color: "var(--text-primary)",
                      marginBottom: "4px",
                    }}>{cat.name}</div>
                    <div style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}>
                      Shop Now →
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.cat-showcase-grid{grid-template-columns:repeat(2,1fr)!important;}}
        @media(max-width:500px){.cat-showcase-grid{grid-template-columns:1fr!important;}}
      `}</style>
    </section>
  );
}
