"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ShoppingCart, Eye, Heart, Star, Sparkles } from "lucide-react";
import { useCart } from "./CartProvider";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  /** Optional MP4/WebM URL — plays on card image hover (muted, max ~5s per hover) */
  previewVideoUrl?: string;
  category: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  rating?: number;
  reviewCount?: number;
  stock?: number;
}

function getFallbackImage(category: string, name: string) {
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

  const galleryUrls = useMemo(() => {
    const raw = (product.images || []).filter((u) => typeof u === "string" && u.trim().length > 0);
    if (raw.length > 0) return raw;
    return [getFallbackImage(product.category, product.name)];
  }, [product.images, product.category, product.name]);

  const previewVideoUrl = product.previewVideoUrl?.trim() ?? "";
  const hasVideo =
    Boolean(previewVideoUrl) &&
    (/^https?:\/\//i.test(previewVideoUrl) || previewVideoUrl.startsWith("/"));
  const hasGalleryCycle = galleryUrls.length >= 2 && !hasVideo;

  const [stageHover, setStageHover] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const galleryIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoCapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearGalleryInterval = () => {
    if (galleryIntervalRef.current) {
      clearInterval(galleryIntervalRef.current);
      galleryIntervalRef.current = null;
    }
  };

  const clearVideoCap = () => {
    if (videoCapTimerRef.current) {
      clearTimeout(videoCapTimerRef.current);
      videoCapTimerRef.current = null;
    }
  };

  const stopVideo = () => {
    clearVideoCap();
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  const hoverMediaAllowed = () => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (!window.matchMedia("(hover: hover)").matches) return false;
    return true;
  };

  const handleStageEnter = () => {
    if (!hoverMediaAllowed()) return;
    setStageHover(true);

    if (hasVideo) {
      clearGalleryInterval();
      const v = videoRef.current;
      if (v) {
        v.currentTime = 0;
        void v.play().catch(() => {});
        clearVideoCap();
        videoCapTimerRef.current = setTimeout(() => {
          v.pause();
        }, 5000);
      }
      return;
    }

    if (hasGalleryCycle) {
      clearGalleryInterval();
      galleryIntervalRef.current = setInterval(() => {
        setGalleryIndex((i) => (i + 1) % galleryUrls.length);
      }, 900);
    }
  };

  const handleStageLeave = () => {
    setStageHover(false);
    clearGalleryInterval();
    clearVideoCap();
    setGalleryIndex(0);
    stopVideo();
  };

  useEffect(() => {
    return () => {
      clearGalleryInterval();
      clearVideoCap();
      const v = videoRef.current;
      if (v) {
        v.pause();
      }
    };
  }, []);

  return (
    <Link href={`/products/${product._id}`} className="pc-root">
      <div className="pc-shell">
        <article
          className={`pc-card${isOutOfStock ? " pc-card--oos" : ""}${added ? " pc-card--added" : ""}`}
        >
          <div
            className="pc-stage"
            onMouseEnter={handleStageEnter}
            onMouseLeave={handleStageLeave}
          >
            <div className={`pc-media${isOutOfStock ? " pc-media--oos" : ""}`}>
              {galleryUrls.map((src, i) => (
                <Image
                  key={`${src}-${i}`}
                  src={src}
                  alt={i === 0 ? product.name : ""}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`pc-img-layer${i === galleryIndex ? " pc-img-layer--active" : ""}`}
                  unoptimized
                />
              ))}
              {hasVideo ? (
                <video
                  ref={videoRef}
                  className={`pc-preview-video${stageHover ? " pc-preview-video--visible" : ""}`}
                  src={previewVideoUrl}
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={`${product.name} preview clip`}
                />
              ) : null}
            </div>

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

          <div className="pc-body">
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

            <div className="pc-prices">
              <span className="pc-price">Rs. {product.price.toLocaleString()}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="pc-compare">Rs. {product.comparePrice.toLocaleString()}</span>
              )}
            </div>

            <div className="pc-actions">
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
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} strokeWidth={2} aria-hidden />
                    Add to Cart
                  </>
                )}
              </button>
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
          border-radius: 16px;
          background: var(--white);
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .pc-root:hover .pc-shell,
        .pc-root:focus-within .pc-shell {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          border-color: rgba(0,0,0,0.08);
        }

        .pc-card {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 300px;
          border-radius: inherit;
          overflow: hidden;
          background: var(--white);
          cursor: pointer;
        }

        @media (min-width: 769px) {
          .pc-card {
            aspect-ratio: 3 / 4.25;
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
          margin: 0;
          background: #f8f9fa;
          border-bottom: 1px solid rgba(0,0,0,0.03);
          overflow: hidden;
        }

        @media (min-width: 769px) {
          .pc-stage {
            min-height: 0;
          }
        }

        .pc-media {
          position: absolute;
          inset: 0;
          transition: transform 0.45s cubic-bezier(0.33, 1, 0.32, 1);
        }

        .pc-root:hover .pc-media,
        .pc-root:focus-within .pc-media {
          transform: scale(1.05);
        }

        .pc-img-layer {
          object-fit: contain;
          padding: 16px 14px;
          z-index: 2;
          opacity: 0;
          transition: opacity 0.45s ease;
          pointer-events: none;
        }

        .pc-img-layer--active {
          opacity: 1;
          z-index: 3;
        }

        .pc-preview-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 14px;
          z-index: 4;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          background: linear-gradient(180deg, var(--cream) 0%, rgba(250, 243, 232, 0.5) 100%);
        }

        .pc-preview-video--visible {
          opacity: 1;
          z-index: 7;
        }

        .pc-media--oos {
          filter: grayscale(1) opacity(0.52);
        }

        .pc-oos-ribbon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-7deg);
          z-index: 10;
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
          z-index: 8;
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
          padding: 4px 8px;
          border-radius: 4px;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          box-shadow: none;
        }

        .pc-badge--sale {
          background: #ffebee;
          color: #c62828;
        }

        .pc-badge--featured {
          background: #fff8e1;
          color: #f57f17;
        }

        .pc-badge--new {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .pc-wish {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 9;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: var(--white);
          color: var(--gray);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: transform 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
        }

        .pc-wish:hover {
          transform: scale(1.05);
          color: #e53935;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }

        .pc-wish--on {
          color: #e53935;
        }

        .pc-wish--on svg {
          fill: #e53935;
        }

        .pc-body {
          flex-shrink: 0;
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 0;
          text-align: left;
          background: var(--white);
        }

        .pc-cat {
          margin: 0 0 4px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gray);
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        .pc-title {
          margin: 0 0 6px;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.4;
          color: #111;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pc-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 12px;
        }

        .pc-stars {
          display: flex;
          gap: 2px;
          color: #e0e0e0;
        }

        .pc-star--on {
          color: #fbc02d;
        }

        .pc-reviews {
          font-size: 12px;
          color: var(--gray);
        }

        .pc-prices {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 16px;
        }

        .pc-price {
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .pc-compare {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-old-price);
          text-decoration: line-through;
        }

        .pc-actions {
          display: flex;
          gap: 10px;
          margin-top: auto;
        }

        .pc-btn {
          flex: 1;
          border: none;
          border-radius: 8px;
          padding: 12px 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .pc-btn--cart {
          background: var(--white);
          color: var(--text-primary);
          border: 1px solid var(--border-default);
          box-shadow: none;
        }

        .pc-btn--cart:hover:not(:disabled) {
          background: var(--maroon);
          color: var(--white);
          border-color: var(--maroon);
          transform: translateY(-1px);
        }

        .pc-btn--cart:disabled {
          cursor: not-allowed;
          background: #f5f5f5;
          color: #bdbdbd;
          border-color: #e0e0e0;
        }

        .pc-card--added .pc-btn--cart {
          background: #4caf50;
          color: white;
          border-color: #4caf50;
        }

        .pc-cart-check {
          font-size: 14px;
          font-weight: 800;
        }

        @media (max-width: 768px) {
          .pc-root:hover .pc-shell,
          .pc-root:focus-within .pc-shell {
            transform: translateY(-3px);
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

          .pc-root:hover .pc-media,
          .pc-root:focus-within .pc-media {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pc-shell,
          .pc-media,
          .pc-img-layer,
          .pc-preview-video,
          .pc-btn {
            transition: none !important;
          }
          .pc-root:hover .pc-shell,
          .pc-root:focus-within .pc-shell {
            transform: none;
          }
          .pc-root:hover .pc-media,
          .pc-root:focus-within .pc-media {
            transform: none;
          }
        }
      `}</style>
    </Link>
  );
}
