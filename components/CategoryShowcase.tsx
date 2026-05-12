"use client";

import Link from "next/link";
import { ChefHat, Sparkles, Home, Dumbbell, Zap, Baby } from "lucide-react";

const categories = [
  { 
    name: "Kitchen & Cooking", 
    slug: "kitchen-cooking", 
    icon: ChefHat,
    color: "#f97316"
  },
  { 
    name: "Personal Care & Beauty", 
    slug: "personal-care-beauty", 
    icon: Sparkles,
    color: "#ec4899"
  },
  { 
    name: "Home & Cleaning", 
    slug: "home-cleaning", 
    icon: Home,
    color: "#3b82f6"
  },
  { 
    name: "Fitness & Health", 
    slug: "fitness-health", 
    icon: Dumbbell,
    color: "#10b981"
  },
  { 
    name: "Electronics & Gadgets", 
    slug: "electronics-gadgets", 
    icon: Zap,
    color: "#8b5cf6"
  },
  { 
    name: "Baby & Kids", 
    slug: "baby-kids", 
    icon: Baby,
    color: "#eab308"
  },
];

export default function CategoryShowcase() {
  return (
    <section style={{ 
      padding: "80px 0", 
      background: "var(--cream)",
      position: "relative"
    }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div className="section-tag" style={{ justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--maroon)" strokeWidth="2.5">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Browse Collections
          </div>
          <h2 className="section-title">Shop by Category</h2>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "16px",
            maxWidth: "560px",
            margin: "12px auto 0",
            fontWeight: 500
          }}>
            Discover curated collections for every aspect of your lifestyle
          </p>
        </div>

        {/* Categories Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          maxWidth: "1100px",
          margin: "0 auto"
        }} className="category-grid-clean">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "var(--white)",
                    border: "2px solid var(--cream-mid)",
                    borderRadius: "16px",
                    padding: "32px 24px",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    boxShadow: "var(--shadow-sm)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "180px",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  className="category-card-clean"
                >
                  {/* Background Circle */}
                  <div 
                    style={{
                      position: "absolute",
                      top: "-30px",
                      right: "-30px",
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background: `${cat.color}10`,
                      transition: "all 0.3s ease"
                    }}
                    className="cat-bg-circle"
                  />

                  {/* Icon Container */}
                  <div style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "16px",
                    background: `${cat.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                    transition: "all 0.3s ease",
                    position: "relative",
                    zIndex: 1
                  }} className="cat-icon-box">
                    <Icon size={32} color={cat.color} strokeWidth={2} />
                  </div>

                  {/* Name */}
                  <h3 style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    fontFamily: "Outfit, sans-serif",
                    lineHeight: 1.3,
                    transition: "color 0.3s ease",
                    position: "relative",
                    zIndex: 1
                  }} className="cat-name-clean">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        .category-card-clean:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
          border-color: var(--maroon);
        }

        .category-card-clean:hover .cat-icon-box {
          transform: scale(1.1);
          background: var(--maroon);
        }

        .category-card-clean:hover .cat-icon-box svg {
          color: white !important;
        }

        .category-card-clean:hover .cat-name-clean {
          color: var(--maroon);
        }

        .category-card-clean:hover .cat-bg-circle {
          transform: scale(1.5);
          opacity: 0.5;
        }

        @media (max-width: 900px) {
          .category-grid-clean {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 500px) {
          .category-grid-clean {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
