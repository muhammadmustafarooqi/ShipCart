"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  ShoppingCart,
  Eye,
  Heart,
  Star,
  Sparkles,
  ChevronUp,
} from "lucide-react";
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

function formatCategoryLabel(slug: string) {
  return slug
    .split("-")
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" · ");
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
      ],
    };
    const catImages = fallbacks[category] || fallbacks["electronics-gadgets"];
    const index =
      Math.abs(name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % catImages.length;
    return catImages[index];
  };

  const finalImageSrc = product.images?.[0] || getFallbackImage(product.category, product.name);

  return (
    <Link href={`/products/${product._id}`} className="pc-root">
      <div className="pc-shell">
        <article
          className={`pc-card${isOutOfStock ? " pc-card--oos" : ""}${added ? " pc-card--added" : ""}`}
        >
          <div className="pc-stage">
            <span className="pc-corner pc-corner--tl" aria-hidden />
            <span className="pc-corner pc-corner--br" aria-hidden />

            <div className="pc-stage-glow" aria-hidden />

            <Image
              src={finalImageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="pc-img"
              unoptimized
            />

            {isOutOfStock && <div className="pc-oos-ribbon">Out of stock</div>}

            <div className="pc-float-badges">
              {discount > 0 && (
                <span className="pc-badge pc-badge--sale">−{discount}%</span>
              )}
              {product.isFeatured && discount === 0 && (
                <span className="pc-badge pc-badge--featured">
                  <Sparkles size={11} strokeWidth={2.5} aria-hidden />
                  Popular
                </span>
              )}
              {product.isNewArrival && <span className="pc-badge pc-badge--new">New</span>}
            </div>

            <button
              type="button"
              className={`pc-wish${wishlisted ? " pc-wish--on" : ""}`}
              aria-pressed={wishlisted}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setWishlisted(!wishlisted);
              }}
            >
              <Heart size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="pc-rail">
            <div className="pc-rail-clip">
              <div className="pc-rail-inner">
                <div className="pc-rail-head">
                  <div className="pc-rail-head-text">
                    <div className="pc-prices">
                      <span className="pc-price">Rs. {product.price.toLocaleString()}</span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="pc-compare">
                          Rs. {product.comparePrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="pc-rail-hint" aria-hidden>
                    <ChevronUp size={20} strokeWidth={2.5} className="pc-rail-chev" />
                    <span>Details</span>
                  </div>
                </div>

                <div className="pc-rail-drawer">
                  <div className="pc-rail-rest">
                    <p className="pc-cat">{formatCategoryLabel(product.category)}</p>
                    <h3 className="pc-title">{product.name}</h3>

                    <div className="pc-rating">
                      <div className="pc-stars" aria-hidden>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={i < fullStars ? "pc-star pc-star--on" : "pc-star"}
                            fill={i < fullStars ? "currentColor" : "none"}
                            strokeWidth={i < fullStars ? 0 : 1.5}
                          />
                        ))}
                      </div>
                      <span className="pc-reviews">{product.reviewCount ?? 0} reviews</span>
                    </div>

                    <div className="pc-actions">
                      <button
                        type="button"
                        className="pc-btn pc-btn--ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = `/products/${product._id}`;
                        }}
                      >
                        <Eye size={16} strokeWidth={2} aria-hidden />
                        View
                      </button>
                      <button
                        ref={btnRef}
                        type="button"
                        className="pc-btn pc-btn--cart"
                        disabled={isOutOfStock}
                        onClick={handleAddToCart}
                      >
                        {isOutOfStock ? (
                          "Unavailable"
                        ) : added ? (
                          <>
                            <span className="pc-cart-check" aria-hidden>
                              ✓
                            </span>
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={16} strokeWidth={2} aria-hidden />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <style>{`
        .pc-root {
          text-decoration: none;
          height: 100%;
          display: block;
          color: inherit;
        }

        .pc-shell {
          padding: 3px;
          border-radius: 1.75rem 0.85rem 2rem 1.1rem;
          background: linear-gradient(
            135deg,
            rgba(201, 168, 76, 0.85) 0%,
            rgba(107, 30, 46, 0.55) 42%,
            rgba(201, 168, 76, 0.45) 100%
          );
          box-shadow: 0 16px 40px rgba(42, 21, 24, 0.1);
          transition: transform 0.5s cubic-bezier(0.33, 1, 0.32, 1), box-shadow 0.5s cubic-bezier(0.33, 1, 0.32, 1);
        }

        .pc-root:hover .pc-shell,
        .pc-root:focus-within .pc-shell {
          transform: translateY(-8px) rotate(-0.35deg);
          box-shadow: 0 28px 56px rgba(42, 21, 24, 0.14);
        }

        .pc-card {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 300px;
          border-radius: 1.55rem 0.65rem 1.85rem 0.95rem;
          overflow: hidden;
          background: linear-gradient(180deg, var(--cream) 0%, var(--white) 55%);
          cursor: pointer;
        }

        @media (min-width: 769px) {
          .pc-card {
            aspect-ratio: 3 / 4.1;
            min-height: 0;
          }
        }

        .pc-card--oos {
          opacity: 0.94;
        }

        .pc-stage {
          position: relative;
          flex: 1;
          min-height: 200px;
          margin: 10px 10px 0;
          border-radius: 1.15rem 0.55rem 1.25rem 0.65rem;
          background: radial-gradient(
            ellipse 85% 75% at 50% 42%,
            rgba(255, 253, 249, 0.95) 0%,
            var(--cream-dark) 72%,
            var(--cream-mid) 100%
          );
          box-shadow:
            inset 0 1px 0 rgba(255, 253, 249, 0.9),
            inset 0 -8px 24px rgba(107, 30, 46, 0.06);
          overflow: hidden;
        }

        @media (min-width: 769px) {
          .pc-stage {
            min-height: 0;
          }
        }

        .pc-corner {
          position: absolute;
          width: 22px;
          height: 22px;
          z-index: 4;
          pointer-events: none;
          border-color: rgba(201, 168, 76, 0.65);
          border-style: solid;
          border-width: 0;
        }

        .pc-corner--tl {
          top: 10px;
          left: 10px;
          border-top-width: 2px;
          border-left-width: 2px;
          border-radius: 4px 0 0 0;
        }

        .pc-corner--br {
          bottom: 10px;
          right: 10px;
          border-bottom-width: 2px;
          border-right-width: 2px;
          border-radius: 0 0 4px 0;
        }

        .pc-stage-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 20%,
            rgba(255, 255, 255, 0.5) 0%,
            transparent 45%
          );
          pointer-events: none;
          z-index: 1;
        }

        .pc-img {
          object-fit: contain;
          padding: 14px 12px;
          z-index: 2;
          transition: transform 0.5s cubic-bezier(0.33, 1, 0.32, 1);
        }

        .pc-root:hover .pc-img,
        .pc-root:focus-within .pc-img {
          transform: scale(1.06) translateY(-4px);
        }

        .pc-card--oos .pc-img {
          filter: grayscale(1) opacity(0.52);
        }

        .pc-oos-ribbon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-7deg);
          z-index: 8;
          padding: 7px 16px;
          font-family: Outfit, sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--white);
          background: var(--maroon-deep);
          border-radius: 6px;
          box-shadow: var(--shadow-md);
          pointer-events: none;
        }

        .pc-float-badges {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 6;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          pointer-events: none;
        }

        .pc-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 8px;
          font-family: Outfit, sans-serif;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          box-shadow: var(--shadow-sm);
        }

        .pc-badge--sale {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: #fff;
        }

        .pc-badge--featured {
          background: linear-gradient(135deg, var(--gold), #b4923a);
          color: var(--maroon-deep);
        }

        .pc-badge--new {
          background: var(--maroon);
          color: var(--white);
        }

        .pc-wish {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 7;
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: rgba(255, 253, 249, 0.92);
          color: var(--gray);
          box-shadow: 0 4px 14px rgba(42, 21, 24, 0.12);
          transition: transform 0.25s ease, color 0.2s ease, box-shadow 0.2s ease;
        }

        .pc-wish:hover {
          transform: scale(1.08);
          color: var(--maroon);
          box-shadow: 0 6px 18px rgba(107, 30, 46, 0.18);
        }

        .pc-wish--on {
          color: var(--maroon);
          background: rgba(255, 253, 249, 0.98);
        }

        .pc-wish--on svg {
          fill: var(--maroon);
        }

        .pc-rail {
          position: relative;
          z-index: 5;
          flex-shrink: 0;
          margin-top: auto;
          padding: 0 6px 6px;
        }

        .pc-rail-clip {
          overflow: hidden;
          border-radius: 1.1rem 1.1rem 1.35rem 1.35rem;
        }

        .pc-rail-inner {
          display: flex;
          flex-direction: column;
          background: rgba(255, 253, 249, 0.78);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(201, 168, 76, 0.28);
          box-shadow:
            0 -10px 36px rgba(42, 21, 24, 0.06),
            inset 0 1px 0 rgba(255, 253, 249, 0.95);
        }

        .pc-rail-drawer {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.52s cubic-bezier(0.33, 1, 0.32, 1);
        }

        .pc-root:hover .pc-rail-drawer,
        .pc-root:focus-within .pc-rail-drawer {
          grid-template-rows: 1fr;
        }

        .pc-rail-drawer > .pc-rail-rest {
          min-height: 0;
          overflow: hidden;
        }

        .pc-rail-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 16px 14px;
          border-bottom: 1px solid rgba(107, 30, 46, 0.08);
        }

        .pc-rail-head-text {
          min-width: 0;
          text-align: left;
        }

        .pc-cat {
          margin: 0 0 6px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--maroon-soft);
          font-family: Outfit, sans-serif;
          text-align: left;
        }

        .pc-prices {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 6px 10px;
        }

        .pc-price {
          font-family: Outfit, sans-serif;
          font-size: clamp(1.15rem, 2.2vw, 1.4rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: var(--maroon-deep);
        }

        .pc-compare {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-old-price);
          text-decoration: line-through;
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        .pc-rail-hint {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        .pc-rail-chev {
          color: var(--maroon);
          opacity: 0.75;
          transition: transform 0.52s cubic-bezier(0.33, 1, 0.32, 1);
        }

        .pc-root:hover .pc-rail-chev,
        .pc-root:focus-within .pc-rail-chev {
          transform: translateY(-3px);
        }

        .pc-rail-rest {
          padding: 4px 16px 16px;
          opacity: 0.88;
          transition: opacity 0.45s cubic-bezier(0.33, 1, 0.32, 1) 0.04s;
        }

        .pc-root:hover .pc-rail-rest,
        .pc-root:focus-within .pc-rail-rest {
          opacity: 1;
        }

        .pc-title {
          margin: 0 0 8px;
          font-family: Outfit, sans-serif;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.35;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-align: left;
        }

        .pc-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .pc-stars {
          display: flex;
          gap: 2px;
          color: var(--cream-mid);
        }

        .pc-star--on {
          color: var(--gold);
        }

        .pc-reviews {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        .pc-actions {
          display: flex;
          gap: 10px;
        }

        .pc-btn {
          flex: 1;
          border: none;
          border-radius: 12px;
          padding: 11px 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
          transition: transform 0.2s ease, filter 0.2s ease, background 0.2s ease;
        }

        .pc-btn--ghost {
          color: var(--maroon-deep);
          background: var(--white);
          border: 1px solid rgba(107, 30, 46, 0.12);
        }

        .pc-btn--ghost:hover {
          background: var(--cream-dark);
        }

        .pc-btn--cart {
          background: var(--gradient-brand);
          color: var(--white);
          box-shadow: 0 8px 20px rgba(107, 30, 46, 0.22);
        }

        .pc-btn--cart:hover:not(:disabled) {
          filter: brightness(1.04);
          transform: translateY(-1px);
        }

        .pc-btn--cart:disabled {
          cursor: not-allowed;
          background: var(--cream-mid);
          color: var(--gray);
          box-shadow: none;
        }

        .pc-card--added .pc-btn--cart {
          background: var(--color-success);
        }

        .pc-cart-check {
          font-size: 14px;
          font-weight: 800;
        }

        @media (max-width: 768px) {
          .pc-root:hover .pc-shell,
          .pc-root:focus-within .pc-shell {
            transform: translateY(-4px);
          }

          .pc-card {
            aspect-ratio: unset;
            min-height: 0;
          }

          .pc-stage {
            height: 200px;
            flex: none;
            min-height: 200px;
          }

          .pc-img {
            transform: none !important;
          }

          .pc-root:hover .pc-img,
          .pc-root:focus-within .pc-img {
            transform: none;
          }

          .pc-rail-inner {
            max-height: none;
          }

          .pc-rail-drawer {
            grid-template-rows: 1fr;
          }

          .pc-rail-hint {
            display: none;
          }

          .pc-rail-head {
            border-bottom: 1px solid rgba(107, 30, 46, 0.08);
            padding-bottom: 12px;
          }

          .pc-rail-rest {
            opacity: 1;
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pc-shell,
          .pc-img,
          .pc-rail-drawer,
          .pc-rail-rest,
          .pc-rail-chev,
          .pc-btn {
            transition: none !important;
          }
          .pc-rail-drawer {
            grid-template-rows: 1fr;
          }
          .pc-root:hover .pc-shell,
          .pc-root:focus-within .pc-shell {
            transform: none;
          }
          .pc-root:hover .pc-img,
          .pc-root:focus-within .pc-img {
            transform: none;
          }
          .pc-root:hover .pc-rail-chev,
          .pc-root:focus-within .pc-rail-chev {
            transform: none;
          }
          .pc-rail-rest {
            opacity: 1;
          }
        }
      `}</style>
    </Link>
  );
}
