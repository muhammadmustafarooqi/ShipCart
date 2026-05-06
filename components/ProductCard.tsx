"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ShoppingCart } from "lucide-react";
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

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  const imageUrl =
    product.images[0] ||
    `https://placehold.co/400x400/ffffff/2563eb?text=${encodeURIComponent(product.name.slice(0, 10))}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || "",
      slug: product.slug,
    });
    if (btnRef.current) {
      btnRef.current.classList.add("cart-flash");
      setTimeout(() => btnRef.current?.classList.remove("cart-flash"), 300);
    }
  };

  const badge = discount > 0 ? `−${discount}%` : product.isFeatured ? "Popular" : product.isNewArrival ? "New" : null;

  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
      <div className="product-card">
        {/* Image */}
        <div className="product-img-wrap">
          <Image
            src={imageUrl}
            alt={product.name}
            width={300}
            height={300}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            unoptimized
          />
          {badge && <span className="product-badge">{badge}</span>}
        </div>

        {/* Info */}
        <div className="product-info">
          <div className="product-name">{product.name}</div>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <span className="product-price">Rs. {product.price.toLocaleString()}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="product-old-price">Rs. {product.comparePrice.toLocaleString()}</span>
            )}
          </div>
          <div className="product-rating">
            <span style={{ color: "var(--color-warning)" }}>{"★".repeat(Math.round(product.rating || 4))}</span>
            <span style={{ color: "var(--border-hover)" }}>{"★".repeat(5 - Math.round(product.rating || 4))}</span>
            {" "}
            <span style={{ opacity: 0.6, fontSize: "11px", fontWeight: 500 }}>({product.reviewCount || Math.floor(Math.random() * 150) + 20})</span>
          </div>
          {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
            <div style={{ fontSize: "11px", color: "var(--color-warning)", fontWeight: 700, marginBottom: "4px", fontFamily: "Outfit, sans-serif" }}>
              ⚡ Only {product.stock} left in stock!
            </div>
          )}
          <button ref={btnRef} onClick={handleAddToCart} className="product-cart-btn">
            <ShoppingCart size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
