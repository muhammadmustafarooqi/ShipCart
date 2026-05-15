import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/utils";
import { CategorySlugIcon } from "@/components/CategorySlugIcon";

export default function CategoryGrid() {
  return (
    <section style={{ padding: "80px 0", background: "var(--bg-card)", borderBottom: "1px solid var(--border-default)" }}>
      <div className="page-container">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div className="section-tag" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <LayoutGrid size={14} color="var(--color-icon)" aria-hidden />
              Browse by
            </div>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <Link href="/products" style={{ fontSize: "14px", color: "var(--color-brand)", textDecoration: "none", fontWeight: 600, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            See All Categories &rarr;
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "20px" }}>
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="category-card">
              <span className="cat-emoji" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CategorySlugIcon slug={cat.slug} size={32} color="var(--color-icon)" strokeWidth={2} />
              </span>
              <span className="cat-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          section > div > div:last-child {
            grid-template-columns: repeat(4,1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .category-card { min-width: 120px; padding: 20px 12px; }
          section > div > div:last-child {
            display: flex !important;
            overflow-x: auto;
            gap: 16px !important;
            padding-bottom: 12px;
            grid-template-columns: none !important;
            scrollbar-width: none;
            margin: 0 -24px;
            padding: 0 24px 16px;
          }
          section > div > div:last-child::-webkit-scrollbar { display: none; }
        }
        @media (max-width: 480px) {
          section > div > div:last-child { grid-template-columns: repeat(2,1fr) !important; display: grid !important; margin: 0; padding: 0; }
        }
      `}</style>
    </section>
  );
}
