"use client";

import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/lib/utils";

const categoryImages: Record<string, { bg: string; img: string; accent: string }> = {
  "kitchen-cooking": {
    bg: "linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)",
    img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400",
    accent: "#f97316",
  },
  "personal-care-beauty": {
    bg: "linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%)",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400",
    accent: "#ec4899",
  },
  "home-cleaning": {
    bg: "linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%)",
    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400",
    accent: "#3b82f6",
  },
  "fitness-health": {
    bg: "linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 100%)",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400",
    accent: "#10b981",
  },
  "electronics-gadgets": {
    bg: "linear-gradient(135deg, #f5f3ff 0%, #ddd6fe 100%)",
    img: "https://images.unsplash.com/photo-1558002038-103792e1972d?auto=format&fit=crop&q=80&w=400",
    accent: "#8b5cf6",
  },
  "baby-kids": {
    bg: "linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)",
    img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=400",
    accent: "#eab308",
  },
};

export default function CategoryShowcase() {
  return (
    <section style={{ padding: "100px 0", background: "linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-card) 100%)", position: "relative", overflow: "hidden" }}>
      {/* Decorative background elements */}
      <div style={{ position: "absolute", top: "10%", right: "-5%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: "20%", left: "-5%", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)" }} />
      
      <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-tag" style={{ justifyContent: "center", marginBottom: "16px" }}>🗂️ Browse by Category</div>
          <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "16px" }}>Shop by Category</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "17px", maxWidth: "560px", margin: "0 auto", fontWeight: 500, lineHeight: 1.6 }}>
            Discover curated collections designed for every aspect of your lifestyle
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        }} className="cat-showcase-grid">
          {PRODUCT_CATEGORIES.map((cat, index) => {
            const style = categoryImages[cat.slug] || { bg: "linear-gradient(135deg, #f1f5f9, #e2e8f0)", img: "", accent: "#64748b" };
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                style={{ textDecoration: "none", animationDelay: `${index * 0.1}s` }}
                className="cat-card-link"
              >
                <div
                  className="cat-card"
                  style={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    position: "relative",
                    height: "240px",
                    background: style.bg,
                    cursor: "pointer",
                    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    border: "1px solid rgba(255,255,255,0.8)",
                  }}
                >
                  {/* Gradient overlay */}
                  <div className="cat-overlay" style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(135deg, transparent 0%, ${style.accent}15 100%)`,
                    opacity: 0,
                    transition: "opacity 0.5s ease",
                  }} />

                  {/* Background image */}
                  {style.img && (
                    <div className="cat-img" style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      width: "60%",
                      height: "100%",
                      backgroundImage: `url(${style.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      maskImage: "linear-gradient(to left, rgba(0,0,0,0.8), transparent)",
                      WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.8), transparent)",
                      transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    }} />
                  )}

                  {/* Decorative circle */}
                  <div className="cat-circle" style={{
                    position: "absolute",
                    top: "-40px",
                    right: "-40px",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: `${style.accent}20`,
                    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  }} />

                  {/* Content */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    padding: "32px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}>
                    <div className="cat-icon" style={{
                      fontSize: "48px",
                      transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                      opacity: 0.15,
                    }}>{cat.icon}</div>
                    
                    <div>
                      <div style={{
                        fontFamily: "Outfit, sans-serif",
                        fontWeight: 800,
                        fontSize: "20px",
                        color: "var(--text-primary)",
                        marginBottom: "8px",
                        letterSpacing: "-0.02em",
                      }}>{cat.name}</div>
                      <div className="cat-cta" style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        color: style.accent,
                        fontWeight: 700,
                        padding: "8px 16px",
                        background: "rgba(255,255,255,0.9)",
                        borderRadius: "100px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      }}>
                        Explore <span style={{ transition: "transform 0.3s ease", display: "inline-block" }}>→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .cat-card-link {
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
        }
        
        .cat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        
        .cat-card:hover .cat-overlay {
          opacity: 1;
        }
        
        .cat-card:hover .cat-img {
          transform: scale(1.1);
        }
        
        .cat-card:hover .cat-circle {
          transform: scale(1.5);
          opacity: 0.5;
        }
        
        .cat-card:hover .cat-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .cat-card:hover .cat-cta {
          background: rgba(255,255,255,1);
          padding-right: 20px;
        }
        
        .cat-card:hover .cat-cta span {
          transform: translateX(4px);
        }
        
        @media(max-width:900px){
          .cat-showcase-grid{grid-template-columns:repeat(2,1fr)!important; gap: 20px !important;}
          .cat-card { height: 220px !important; }
        }
        @media(max-width:500px){
          .cat-showcase-grid{grid-template-columns:1fr!important;}
          .cat-card { height: 200px !important; }
        }
      `}</style>
    </section>
  );
}
