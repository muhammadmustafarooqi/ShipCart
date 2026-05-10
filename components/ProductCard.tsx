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
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1584990347449-39b4aa02b01f?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop",
      ],
      "personal-care-beauty": [
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop",
      ],
      "home-cleaning": [
        "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1600428877938-29c5e5b8b250?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1584820927498-cafe2c1c9699?w=400&h=400&fit=crop",
      ],
      "fitness-health": [
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=400&fit=crop",
      ],
      "electronics-gadgets": [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
      ],
      "baby-kids": [
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
      ]
    };
    const catImages = fallbacks[category] || fallbacks["electronics-gadgets"];
    const index = Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % catImages.length;
    return catImages[index];
  };

  const finalImageSrc = product.images?.[0] || getFallbackImage(product.category, product.name);

  return (
    <Link href={`/products/${product._id}`} style={{ textDecoration: "none", height: "100%", display: "block" }}>
      <div
        className="ultra-product-card"
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
          transition: "all 0.3s ease",
        }}
      >
        {/* Image Container */}
        <div style={{
          position: "relative",
          height: "260px",
          background: "#f9fafb",
          overflow: "hidden",
        }}>
          <Image
            src={finalImageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover",
              transition: "transform 0.5s ease",
              filter: isOutOfStock ? "grayscale(100%) opacity(50%)" : "none",
            }}
            className="card-image"
            unoptimized
          />

          {/* Overlay Gradient */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }} className="image-overlay" />

          {/* Top Badges */}
          <div style={{ position: "absolute", top: "12px", left: "12px", right: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {discount > 0 && (
                <div style={{
                  background: "#ef4444",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 800,
                  fontFamily: "Outfit, sans-serif",
                  boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
                }}>
                  -{discount}%
                </div>
              )}
              {product.isNewArrival && (
                <div style={{
                  background: "#10b981",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 800,
                  fontFamily: "Outfit, sans-serif",
                }}>
                  NEW
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(!wishlisted); }}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease",
              }}
            >
              <Heart size={16} color={wishlisted ? "#ef4444" : "#6b7280"} fill={wishlisted ? "#ef4444" : "none"} />
            </button>
          </div>

          {/* Quick View - Bottom */}
          <div className="quick-view" style={{
            position: "absolute",
            bottom: "12px",
            left: "12px",
            right: "12px",
            opacity: 0,
            transform: "translateY(10px)",
            transition: "all 0.3s ease",
            zIndex: 10,
          }}>
            <button
              onClick={(e) => { e.preventDefault(); window.location.href = `/products/${product._id}`; }}
              style={{
                width: "100%",
                background: "white",
                color: "#1f2937",
                border: "none",
                borderRadius: "8px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "Plus Jakarta Sans, sans-serif",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <Eye size={16} />
              Quick View
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
        }}>
          {/* Category */}
          <div style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}>
            {product.category.split("-")[0]}
          </div>

          {/* Product Name */}
          <h3 style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#111827",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "40px",
            margin: 0,
          }}>
            {product.name}
          </h3>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  color={i < fullStars ? "#fbbf24" : "#e5e7eb"}
                  fill={i < fullStars ? "#fbbf24" : "#e5e7eb"}
                  strokeWidth={0}
                />
              ))}
            </div>
            <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600 }}>
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* Price & Button */}
          <div style={{ marginTop: "auto", paddingTop: "12px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
              <div style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#111827",
                fontFamily: "Outfit, sans-serif",
              }}>
                Rs. {product.price.toLocaleString()}
              </div>
              {product.comparePrice && product.comparePrice > product.price && (
                <div style={{
                  fontSize: "13px",
                  color: "#9ca3af",
                  textDecoration: "line-through",
                  fontWeight: 500,
                }}>
                  Rs. {product.comparePrice.toLocaleString()}
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              ref={btnRef}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                width: "100%",
                background: added ? "#10b981" : isOutOfStock ? "#e5e7eb" : "#111827",
                color: added || !isOutOfStock ? "white" : "#9ca3af",
                border: "none",
                borderRadius: "8px",
                padding: "11px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
            >
              {isOutOfStock ? (
                "Out of Stock"
              ) : added ? (
                <>
                  <span style={{ fontSize: "16px" }}>✓</span> Added
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>

        <style>{`
          .ultra-product-card:hover {
            box-shadow: 0 10px 30px rgba(0,0,0,0.12);
            border-color: #d1d5db;
            transform: translateY(-4px);
          }

          .ultra-product-card:hover .card-image {
            transform: scale(1.05);
          }

          .ultra-product-card:hover .image-overlay {
            opacity: 1;
          }

          .ultra-product-card:hover .quick-view {
            opacity: 1;
            transform: translateY(0);
          }

          .ultra-product-card button:not([disabled]):hover {
            background: #000000 !important;
            transform: translateY(-1px);
          }

          @media (max-width: 768px) {
            .quick-view {
              opacity: 0;
            }
            .ultra-product-card:hover {
              transform: translateY(-2px);
            }
          }
        `}</style>
      </div>
    </Link>
  );
}
