"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ShoppingCart, Eye, Heart, Star } from "lucide-react";
import { useCart } from "./CartProvider";

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

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || "",
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const rating = product.rating || 4.5;
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  const badge = discount > 0
    ? { label: `Save ${discount}%`, color: "#ef4444" }
    : product.isFeatured
    ? { label: "Popular", color: "#f59e0b" }
    : product.isNewArrival
    ? { label: "New", color: "#6366f1" }
    : null;

  const isOutOfStock = product.stock !== undefined && product.stock === 0;

  const getFallbackImage = (category: string, name: string) => {
    const fallbacks: Record<string, string[]> = {
      "kitchen-cooking": [
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=400",
      ],
      "personal-care-beauty": [
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400",
      ],
      "electronics-gadgets": [
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
      ]
    };
    const catImages = fallbacks[category] || fallbacks["electronics-gadgets"];
    return catImages[name.length % catImages.length];
  };

  const finalImageSrc = product.images?.[0] || getFallbackImage(product.category, product.name);

  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: "none", height: "100%", display: "block" }}>
      <div
        className="aesthetic-product-card"
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
          border: "1px solid rgba(15, 23, 42, 0.04)",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Image Area */}
        <div style={{
          height: "260px",
          background: "radial-gradient(circle at center, #ffffff 0%, #f1f5f9 100%)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          overflow: "hidden"
        }}>
          <Image
            src={finalImageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "contain",
              padding: "24px",
              transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              filter: isOutOfStock ? "grayscale(100%) opacity(50%)" : "none",
            }}
            className="product-img-element"
            unoptimized
          />

          {/* Premium Badge */}
          {badge && (
            <div style={{
              position: "absolute",
              top: "16px", left: "16px",
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              color: badge.color,
              borderRadius: "100px",
              padding: "6px 14px",
              fontSize: "11px",
              fontWeight: 800,
              fontFamily: "Outfit, sans-serif",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              zIndex: 10,
              border: `1px solid ${badge.color}22`
            }}>
              {badge.label}
            </div>
          )}

          {/* Quick Action Buttons (Show on hover via CSS) */}
          <div className="quick-actions" style={{
            position: "absolute",
            top: "16px", right: "16px",
            display: "flex", flexDirection: "column", gap: "8px",
            zIndex: 10
          }}>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(!wishlisted); }}
              className="action-btn"
              style={{
                width: "40px", height: "40px", borderRadius: "50%", border: "none",
                background: wishlisted ? "rgba(254, 226, 226, 0.9)" : "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <Heart size={18} color={wishlisted ? "#ef4444" : "#475569"} fill={wishlisted ? "#ef4444" : "none"} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); window.location.href = `/products/${product.slug}`; }}
              className="action-btn"
              style={{
                width: "40px", height: "40px", borderRadius: "50%", border: "none",
                background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: "0.05s"
              }}
            >
              <Eye size={18} color="#475569" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1, background: "#ffffff" }}>
          <div style={{
            fontSize: "11px", fontWeight: 800, color: "var(--color-brand)",
            textTransform: "uppercase", letterSpacing: "1px",
            fontFamily: "Outfit, sans-serif", marginBottom: "8px",
          }}>
            {product.category.replace(/-/g, " ")}
          </div>

          <h3 style={{
            fontFamily: "Outfit, sans-serif", fontSize: "16px", fontWeight: 700,
            color: "#0f172a", lineHeight: 1.4, marginBottom: "12px",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            flex: 1
          }}>
            {product.name}
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} color={i < fullStars ? "#f59e0b" : "#e2e8f0"} fill={i < fullStars ? "#f59e0b" : "none"} />
              ))}
            </div>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>({product.reviewCount || 0})</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "auto" }}>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 900, color: "#0f172a", fontFamily: "Outfit, sans-serif", letterSpacing: "-0.5px" }}>
                Rs. {product.price.toLocaleString()}
              </div>
              {product.comparePrice && product.comparePrice > product.price && (
                <div style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "line-through", fontWeight: 600, marginTop: "2px" }}>
                  Rs. {product.comparePrice.toLocaleString()}
                </div>
              )}
            </div>

            <button
              ref={btnRef}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="add-to-cart-btn"
              style={{
                background: added ? "#10b981" : "#0f172a",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                opacity: isOutOfStock ? 0.5 : 1,
                boxShadow: added ? "0 8px 20px rgba(16,185,129,0.3)" : "0 8px 20px rgba(15,23,42,0.15)",
                transform: added ? "scale(0.9)" : "scale(1)",
                flexShrink: 0
              }}
            >
              <ShoppingCart size={20} color="white" />
            </button>
          </div>
        </div>

        <style>{`
          .aesthetic-product-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 30px 60px rgba(15, 23, 42, 0.08);
            border-color: rgba(99, 102, 241, 0.15);
          }
          
          .product-img-element { transform: scale(1); }
          .aesthetic-product-card:hover .product-img-element { transform: scale(1.08); }

          .quick-actions { opacity: 0; transform: translateX(10px); transition: all 0.4s ease; pointer-events: none; }
          .aesthetic-product-card:hover .quick-actions { opacity: 1; transform: translateX(0); pointer-events: auto; }

          .action-btn:hover { transform: scale(1.1); }
          .add-to-cart-btn:hover { transform: scale(1.05); background: var(--color-brand) !important; box-shadow: 0 10px 25px rgba(99,102,241,0.4) !important; }

          @media (max-width: 768px) {
            .quick-actions { opacity: 1; transform: translateX(0); pointer-events: auto; }
            .aesthetic-product-card:hover { transform: translateY(-4px); }
          }
        `}</style>
      </div>
    </Link>
  );
}
