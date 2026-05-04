import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/lib/utils";

const categoryIcons: Record<string, string> = {
  "kitchen-cooking": "🍳",
  "personal-care-beauty": "💆‍♀️",
  "home-cleaning": "🏠",
  "fitness-health": "💪",
  "electronics-gadgets": "⚡",
  "baby-kids": "👶",
};

const categoryColors: Record<string, string> = {
  "kitchen-cooking": "linear-gradient(135deg, #ff6b00, #ff8533)",
  "personal-care-beauty": "linear-gradient(135deg, #ec4899, #f43f5e)",
  "home-cleaning": "linear-gradient(135deg, #06b6d4, #0284c7)",
  "fitness-health": "linear-gradient(135deg, #10b981, #059669)",
  "electronics-gadgets": "linear-gradient(135deg, #8b5cf6, #6d28d9)",
  "baby-kids": "linear-gradient(135deg, #f59e0b, #d97706)",
};

export default function CategoryGrid() {
  return (
    <section style={{ padding: "60px 0" }}>
      <div className="page-container">
        <div className="section-header">
          <p style={{ color: "#ff6b00", fontWeight: 600, fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
            Browse by Category
          </p>
          <h2>Shop What You Need</h2>
          <div className="section-divider" />
          <p>Explore our wide range of quality products for every need</p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "16px",
        }}>
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="category-card"
            >
              <div
                className="cat-icon"
                style={{
                  background: categoryColors[cat.slug] || "linear-gradient(135deg, #ff6b00, #ff8533)",
                  fontSize: "32px",
                  width: "70px",
                  height: "70px",
                }}
              >
                {categoryIcons[cat.slug]}
              </div>
              <span style={{ fontWeight: 600, fontSize: "13px", textAlign: "center", lineHeight: 1.3 }}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
