"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  rating?: number;
  reviewCount?: number;
  stock?: number;
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
    sort: "createdAt",
    order: "desc",
    page: 1,
    limit: 12,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.search) params.set("search", filters.search);
      params.set("sort", filters.sort);
      params.set("order", filters.order);
      params.set("page", String(filters.page));
      params.set("limit", String(filters.limit));
      if (searchParams.get("featured")) params.set("featured", "true");
      if (searchParams.get("newArrival")) params.set("newArrival", "true");

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const sortOptions = [
    { label: "Newest First", sort: "createdAt", order: "desc" },
    { label: "Oldest First", sort: "createdAt", order: "asc" },
    { label: "Price: Low to High", sort: "price", order: "asc" },
    { label: "Price: High to Low", sort: "price", order: "desc" },
  ];

  return (
    <div>
      <Navbar />

      {/* Page Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        padding: "48px 0",
        marginBottom: "0",
      }}>
        <div className="page-container">
          <h1 style={{ fontSize: "36px", fontWeight: 800, color: "white", marginBottom: "8px" }}>
            All Products
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px" }}>
            {total} products available • Pakistan&apos;s Best Gadgets Store
          </p>
        </div>
      </div>

      <div className="page-container" style={{ padding: "32px 16px" }}>
        {/* Toolbar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}>
          {/* Search */}
          <div className="search-input" style={{ flex: 1, minWidth: "200px", maxWidth: "340px" }}>
            <Search size={16} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
            />
            {filters.search && (
              <button
                onClick={() => setFilters((f) => ({ ...f, search: "", page: 1 }))}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0" }}
              >
                <X size={14} color="#9ca3af" />
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Sort */}
            <select
              value={`${filters.sort}-${filters.order}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split("-");
                setFilters((f) => ({ ...f, sort, order, page: 1 }));
              }}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "2px solid #e5e7eb",
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "Poppins, sans-serif",
                background: "white",
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt.label} value={`${opt.sort}-${opt.order}`}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "10px",
                border: "2px solid #e5e7eb",
                background: sidebarOpen ? "#ff6b00" : "white",
                color: sidebarOpen ? "white" : "#374151",
                cursor: "pointer",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "24px" }}>
          {/* Sidebar Filters */}
          {sidebarOpen && (
            <div style={{
              width: "220px",
              flexShrink: 0,
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #f0f0f0",
              alignSelf: "flex-start",
              position: "sticky",
              top: "80px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: 700, fontSize: "16px" }}>Filters</h3>
                <button
                  onClick={() => setFilters((f) => ({ ...f, category: "", page: 1 }))}
                  style={{ fontSize: "12px", color: "#ff6b00", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  Clear All
                </button>
              </div>

              <div>
                <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                  Category
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button
                    onClick={() => setFilters((f) => ({ ...f, category: "", page: 1 }))}
                    style={{
                      textAlign: "left",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "none",
                      background: !filters.category ? "rgba(255,107,0,0.1)" : "transparent",
                      color: !filters.category ? "#ff6b00" : "#374151",
                      cursor: "pointer",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      fontWeight: !filters.category ? 600 : 400,
                    }}
                  >
                    All Categories
                  </button>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setFilters((f) => ({ ...f, category: cat.slug, page: 1 }))}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "none",
                        background: filters.category === cat.slug ? "rgba(255,107,0,0.1)" : "transparent",
                        color: filters.category === cat.slug ? "#ff6b00" : "#374151",
                        cursor: "pointer",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        fontWeight: filters.category === cat.slug ? 600 : 400,
                      }}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div style={{ flex: 1 }}>
            {/* Active Filter Tags */}
            {(filters.category || filters.search) && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                {filters.category && (
                  <span style={{
                    background: "rgba(255,107,0,0.1)",
                    color: "#ff6b00",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}>
                    {filters.category}
                    <button
                      onClick={() => setFilters((f) => ({ ...f, category: "", page: 1 }))}
                      style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}
                    >
                      <X size={12} color="#ff6b00" />
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span style={{
                    background: "rgba(255,107,0,0.1)",
                    color: "#ff6b00",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}>
                    &quot;{filters.search}&quot;
                    <button
                      onClick={() => setFilters((f) => ({ ...f, search: "", page: 1 }))}
                      style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}
                    >
                      <X size={12} color="#ff6b00" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                <div className="spinner" />
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
                <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#1f2937", marginBottom: "8px" }}>No Products Found</h3>
                <p style={{ color: "#6b7280", marginBottom: "24px" }}>Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => setFilters((f) => ({ ...f, category: "", search: "", page: 1 }))}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "40px", alignItems: "center" }}>
                    <button
                      onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) }))}
                      disabled={filters.page === 1}
                      style={{
                        width: "40px", height: "40px", borderRadius: "10px", border: "2px solid #e5e7eb",
                        background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: filters.page === 1 ? 0.5 : 1,
                      }}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setFilters((f) => ({ ...f, page: p }))}
                        style={{
                          width: "40px", height: "40px", borderRadius: "10px",
                          border: "2px solid",
                          borderColor: p === filters.page ? "#ff6b00" : "#e5e7eb",
                          background: p === filters.page ? "#ff6b00" : "white",
                          color: p === filters.page ? "white" : "#374151",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "14px",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setFilters((f) => ({ ...f, page: Math.min(pages, f.page + 1) }))}
                      disabled={filters.page === pages}
                      style={{
                        width: "40px", height: "40px", borderRadius: "10px", border: "2px solid #e5e7eb",
                        background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: filters.page === pages ? 0.5 : 1,
                      }}
                    >
                      <ChevronRight size={18} />
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
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", padding: "100px" }}><div className="spinner" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
