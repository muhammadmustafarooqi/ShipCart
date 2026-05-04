"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const discountPercent =
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
      image: product.images[0] || "/placeholder.jpg",
      slug: product.slug,
    });
  };

  const imageUrl = product.images[0] || `https://placehold.co/400x400/f5f5f5/ff6b00?text=${encodeURIComponent(product.name.slice(0, 15))}`;

  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
      <div className="product-card fade-in">
        {/* Image */}
        <div className="img-wrapper" style={{ position: "relative" }}>
          <Image
            src={imageUrl}
            alt={product.name}
            width={400}
            height={400}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            unoptimized
          />
          {/* Badges */}
          <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {discountPercent > 0 && (
              <span className="badge-sale">-{discountPercent}%</span>
            )}
            {product.isNewArrival && !discountPercent && (
              <span className="badge-new">New</span>
            )}
          </div>
          {/* Quick Cart on Hover */}
          <div style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            opacity: 0,
            transition: "opacity 0.2s ease",
          }} className="quick-cart">
            <button
              onClick={handleAddToCart}
              style={{
                background: "linear-gradient(135deg, #ff6b00, #e55a00)",
                color: "white",
                border: "none",
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(255,107,0,0.4)",
              }}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "16px" }}>
          {/* Category */}
          <div style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", fontFamily: "Outfit, sans-serif" }}>
            {product.category}
          </div>

          {/* Name */}
          <h3 style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--secondary)",
            marginBottom: "10px",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontFamily: "Plus Jakarta Sans, sans-serif"
          }}>
            {product.name}
          </h3>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  fill={star <= Math.round(product.rating || 4.5) ? "#FBBF24" : "none"}
                  color={star <= Math.round(product.rating || 4.5) ? "#FBBF24" : "var(--gray-300)"}
                />
              ))}
            </div>
            <span style={{ fontSize: "12px", color: "var(--gray-400)", fontWeight: 500 }}>
              ({product.reviewCount || Math.floor(Math.random() * 200) + 10})
            </span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
            <div>
              <span className="price-current">Rs. {product.price.toLocaleString()}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="price-original" style={{ marginLeft: "6px" }}>
                  Rs. {product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="btn-primary"
              style={{ padding: "8px 16px", fontSize: "13px", borderRadius: "var(--radius-full)" }}
            >
              <ShoppingCart size={14} />
              Add
            </button>
          </div>

          {/* Stock warning */}
          {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
            <div style={{ marginTop: "10px", fontSize: "12px", color: "var(--warning)", fontWeight: 600 }}>
              ⚡ Only {product.stock} left!
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .product-card:hover .quick-cart {
          opacity: 1 !important;
        }
      `}</style>
    </Link>
  );
}
