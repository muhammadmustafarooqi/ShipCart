"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { CategorySlugIcon } from "@/components/CategorySlugIcon";
import { PRODUCT_CATEGORIES } from "@/lib/utils";

interface Product {
  _id: string; name: string; slug: string; price: number; comparePrice?: number;
  images: string[]; category: string; isFeatured?: boolean; isNewArrival?: boolean;
  rating?: number; reviewCount?: number; stock?: number;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    sort: "createdAt", order: "desc", page: 1, limit: 12,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.search) params.set("search", filters.search);
      params.set("sort", filters.sort); params.set("order", filters.order);
      params.set("page", String(filters.page)); params.set("limit", String(filters.limit));
      if (searchParams.get("featured")) params.set("featured", "true");
      if (searchParams.get("newArrival")) params.set("newArrival", "true");
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []); setTotal(data.total || 0); setPages(data.pages || 1);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [filters, searchParams]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const sortOptions = [
    { label: "Newest First", sort: "createdAt", order: "desc" },
    { label: "Price: Low to High", sort: "price", order: "asc" },
    { label: "Price: High to Low", sort: "price", order: "desc" },
  ];

  const inputStyle = {
    background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "12px",
    color: "var(--text-primary)", padding: "12px 16px", fontSize: "14px", outline: "none",
    cursor: "pointer", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 500,
    boxShadow: "var(--shadow-sm)", transition: "all 0.2s ease"
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: "var(--bg-card)", padding: "64px 0", borderBottom: "1px solid var(--border-default)" }}>
        <div className="page-container" style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px", fontFamily: "Outfit, sans-serif" }}>Premium Collection</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", fontWeight: 500 }}>Explore our curated selection of {total} high-end products.</p>
        </div>
      </div>

      <div className="page-container" style={{ padding: "40px 24px", flex: 1 }}>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "32px", flexWrap: "wrap" }}>
          <div className="search-bar" style={{ flex: "1 1 200px", minWidth: 0, maxWidth: "min(400px, 100%)", width: "100%", background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "12px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "var(--shadow-sm)" }}>
            <Search size={18} color="var(--color-icon)" />
            <input type="text" placeholder="Search our collection..." value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))} 
              style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: "15px", fontFamily: "Plus Jakarta Sans, sans-serif", color: "var(--text-primary)" }}
            />
            {filters.search && (
              <button onClick={() => setFilters((f) => ({ ...f, search: "", page: 1 }))} style={{ background: "var(--bg-card-hover)", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={14} color="var(--color-icon)" />
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <select
              value={`${filters.sort}-${filters.order}`}
              onChange={(e) => { const [sort, order] = e.target.value.split("-"); setFilters((f) => ({ ...f, sort, order, page: 1 })); }}
              style={inputStyle}
            >
              {sortOptions.map((o) => <option key={o.label} value={`${o.sort}-${o.order}`}>{o.label}</option>)}
            </select>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ ...inputStyle, display: "flex", alignItems: "center", gap: "8px", border: sidebarOpen ? "1px solid var(--text-primary)" : "1px solid var(--border-default)", background: sidebarOpen ? "var(--text-primary)" : "var(--bg-card)", color: sidebarOpen ? "white" : "var(--text-primary)" }}
            >
              <SlidersHorizontal size={16} color="currentColor" /> Filters
            </button>
          </div>
        </div>

        {/* Active Tags */}
        {(filters.category || filters.search) && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
            {filters.category && (
              <span style={{ background: "var(--color-brand-dim)", color: "var(--color-brand)", padding: "6px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                {PRODUCT_CATEGORIES.find(c => c.slug === filters.category)?.name || filters.category}
                <button onClick={() => setFilters((f) => ({ ...f, category: "", page: 1 }))} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                  <X size={14} color="var(--color-icon)" />
                </button>
              </span>
            )}
            {filters.search && (
              <span style={{ background: "var(--color-brand-dim)", color: "var(--color-brand)", padding: "6px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                &quot;{filters.search}&quot;
                <button onClick={() => setFilters((f) => ({ ...f, search: "", page: 1 }))} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                  <X size={14} color="var(--color-icon)" />
                </button>
              </span>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
          {/* Sidebar */}
          {sidebarOpen && (
            <div style={{ width: "240px", flexShrink: 0, background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "24px", position: "sticky", top: "100px", boxShadow: "var(--shadow-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <span style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>Filters</span>
                <button onClick={() => setFilters((f) => ({ ...f, category: "", page: 1 }))} style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Clear</button>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Category</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button onClick={() => setFilters((f) => ({ ...f, category: "", page: 1 }))} style={{ textAlign: "left", padding: "10px 14px", borderRadius: "8px", border: "none", background: !filters.category ? "var(--text-primary)" : "transparent", color: !filters.category ? "white" : "var(--text-secondary)", cursor: "pointer", fontSize: "14px", fontWeight: 500, transition: "all 0.2s ease" }}>All Categories</button>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button key={cat.slug} onClick={() => setFilters((f) => ({ ...f, category: cat.slug, page: 1 }))} style={{ textAlign: "left", padding: "10px 14px", borderRadius: "8px", border: "none", background: filters.category === cat.slug ? "var(--text-primary)" : "transparent", color: filters.category === cat.slug ? "white" : "var(--text-secondary)", cursor: "pointer", fontSize: "14px", fontWeight: 500, transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
                      <CategorySlugIcon slug={cat.slug} size={18} color={filters.category === cat.slug ? "white" : "var(--color-icon)"} />
                    </span>{" "}
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
                <div className="spinner" />
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: "center", padding: "100px 0", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-hover)" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", color: "var(--text-secondary)" }}>
                  <Search size={56} strokeWidth={1.5} aria-hidden />
                </div>
                <h3 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px", fontFamily: "Outfit, sans-serif" }}>No Products Found</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: "28px", fontSize: "16px" }}>Try adjusting your filters or search terms to find what you&apos;re looking for.</p>
                <button onClick={() => setFilters((f) => ({ ...f, category: "", search: "", page: 1 }))} className="btn-primary">Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
                {pages > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "48px", alignItems: "center" }}>
                    <button onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) }))} disabled={filters.page === 1} style={{ width: "44px", height: "44px", borderRadius: "12px", border: "1px solid var(--border-default)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)", opacity: filters.page === 1 ? 0.4 : 1, transition: "all 0.2s ease" }}>
                      <ChevronLeft size={20} color="var(--color-icon)" />
                    </button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => setFilters((f) => ({ ...f, page: p }))} style={{ width: "44px", height: "44px", borderRadius: "12px", border: "1px solid", borderColor: p === filters.page ? "var(--text-primary)" : "var(--border-default)", background: p === filters.page ? "var(--text-primary)" : "var(--bg-card)", color: p === filters.page ? "white" : "var(--text-primary)", cursor: "pointer", fontWeight: p === filters.page ? 700 : 500, fontSize: "15px", transition: "all 0.2s ease" }}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setFilters((f) => ({ ...f, page: Math.min(pages, f.page + 1) }))} disabled={filters.page === pages} style={{ width: "44px", height: "44px", borderRadius: "12px", border: "1px solid var(--border-default)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)", opacity: filters.page === pages ? 0.4 : 1, transition: "all 0.2s ease" }}>
                      <ChevronRight size={20} color="var(--color-icon)" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", padding: "150px", background: "var(--bg-primary)", minHeight: "100vh" }}><div className="spinner" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
