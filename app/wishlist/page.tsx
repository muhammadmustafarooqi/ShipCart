"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight, Sparkles } from "lucide-react";
import { useWishlist } from "@/components/WishlistProvider";
import { useCart } from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      slug: item.slug,
    });
  };

  const discount = (item: typeof items[0]) =>
    item.comparePrice && item.comparePrice > item.price
      ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)
      : 0;

  return (
    <>
      <Navbar />
      <main className="wl-main">
        {/* ── Header ── */}
        <div className="wl-header">
          <div className="wl-header-inner">
            <div className="wl-header-icon">
              <Heart size={28} strokeWidth={2} fill="currentColor" />
            </div>
            <div>
              <h1 className="wl-title">My Wishlist</h1>
              <p className="wl-subtitle">
                {items.length === 0
                  ? "Your wishlist is empty"
                  : `${items.length} item${items.length !== 1 ? "s" : ""} saved`}
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearWishlist}
                className="wl-clear-btn"
                aria-label="Clear wishlist"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="wl-container">
          {items.length === 0 ? (
            /* ── Empty State ── */
            <div className="wl-empty">
              <div className="wl-empty-heart" aria-hidden>
                <Heart size={64} strokeWidth={1.2} />
              </div>
              <h2 className="wl-empty-title">Nothing saved yet</h2>
              <p className="wl-empty-desc">
                Browse our collection and tap the heart icon on any product to save it here.
              </p>
              <Link href="/products" className="wl-shop-btn">
                <Sparkles size={18} />
                Explore Products
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <>
              {/* ── Product Grid ── */}
              <div className="wl-grid">
                {items.map((item) => {
                  const disc = discount(item);
                  return (
                    <div key={item.productId} className="wl-card">
                      {/* Image */}
                      <Link href={`/products/${item.slug || item.productId}`} className="wl-card-img-wrap">
                        <Image
                          src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="wl-card-img"
                          
                        />
                        {disc > 0 && (
                          <span className="wl-disc-badge">-{disc}%</span>
                        )}
                      </Link>

                      {/* Remove button */}
                      <button
                        className="wl-remove-btn"
                        onClick={() => removeItem(item.productId)}
                        aria-label="Remove from wishlist"
                      >
                        <Heart size={18} fill="currentColor" />
                      </button>

                      {/* Info */}
                      <div className="wl-card-body">
                        <p className="wl-card-cat">
                          {item.category.split("-").slice(0, 2).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" · ")}
                        </p>
                        <Link href={`/products/${item.slug || item.productId}`} className="wl-card-name">
                          {item.name}
                        </Link>
                        <div className="wl-card-prices">
                          {item.comparePrice && item.comparePrice > item.price && (
                            <span className="wl-compare">Rs. {item.comparePrice.toLocaleString()}</span>
                          )}
                          <span className="wl-price">Rs. {item.price.toLocaleString()}</span>
                        </div>
                        <button
                          className="wl-cart-btn"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Footer CTA ── */}
              <div className="wl-cta">
                <Link href="/products" className="wl-continue-btn">
                  Continue Shopping
                  <ArrowRight size={18} />
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />

      <style>{`
        .wl-main {
          min-height: 100vh;
          background: var(--cream, #fdf8f0);
        }

        /* ── Header ── */
        .wl-header {
          background: linear-gradient(135deg, var(--navy-deep, #102857) 0%, var(--orange, #FF6102) 60%, #173673 100%);
          padding: 48px 0 52px;
          position: relative;
          overflow: hidden;
        }
        .wl-header::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .wl-header-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .wl-header-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 2px solid rgba(201,168,76,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f9b8c0;
          flex-shrink: 0;
          backdrop-filter: blur(8px);
        }
        .wl-title {
          margin: 0;
          font-family: Outfit, sans-serif;
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
        }
        .wl-subtitle {
          margin: 4px 0 0;
          font-size: 15px;
          color: rgba(255,255,255,0.65);
          font-family: "Plus Jakarta Sans", sans-serif;
        }
        .wl-clear-btn {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 99px;
          border: 1px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.85);
          font-size: 13px;
          font-weight: 600;
          font-family: "Plus Jakarta Sans", sans-serif;
          cursor: pointer;
          transition: all 0.22s ease;
          backdrop-filter: blur(8px);
          white-space: nowrap;
        }
        .wl-clear-btn:hover {
          background: rgba(220,38,38,0.35);
          border-color: rgba(220,38,38,0.5);
          color: #fff;
          transform: translateY(-1px);
        }

        /* ── Container ── */
        .wl-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 48px 32px 80px;
        }

        /* ── Empty State ── */
        .wl-empty {
          text-align: center;
          padding: 80px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .wl-empty-heart {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fff0f3, #ffe4e8);
          border: 2px solid rgba(220,38,38,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc2626;
          animation: wl-pulse 2.5s ease-in-out infinite;
        }
        @keyframes wl-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220,38,38,0.15); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 16px rgba(220,38,38,0); }
        }
        .wl-empty-title {
          margin: 0;
          font-family: Outfit, sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: var(--navy-deep, #102857);
        }
        .wl-empty-desc {
          margin: 0;
          max-width: 380px;
          font-size: 15px;
          line-height: 1.7;
          color: #666;
          font-family: "Plus Jakarta Sans", sans-serif;
        }
        .wl-shop-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          border-radius: 99px;
          background: linear-gradient(135deg, var(--orange, #FF6102), var(--navy-deep, #102857));
          color: #fff;
          text-decoration: none;
          font-weight: 700;
          font-size: 15px;
          font-family: "Plus Jakarta Sans", sans-serif;
          transition: all 0.25s ease;
          box-shadow: 0 6px 24px rgba(107,30,46,0.35);
          margin-top: 8px;
        }
        .wl-shop-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(107,30,46,0.45);
          filter: brightness(1.08);
        }

        /* ── Product Grid ── */
        .wl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 28px;
        }

        .wl-card {
          position: relative;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.05);
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .wl-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
        }

        .wl-card-img-wrap {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #f7f7f7;
        }
        .wl-card-img {
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .wl-card:hover .wl-card-img {
          transform: scale(1.06);
        }
        .wl-disc-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #dc2626;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 99px;
          font-family: Outfit, sans-serif;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(220,38,38,0.4);
        }

        /* Remove (heart) button */
        .wl-remove-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background: rgba(220,38,38,0.92);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.22s ease;
          box-shadow: 0 2px 10px rgba(220,38,38,0.4);
        }
        .wl-remove-btn:hover {
          background: #b91c1c;
          transform: scale(1.12);
          box-shadow: 0 4px 16px rgba(220,38,38,0.5);
        }

        /* Card body */
        .wl-card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .wl-card-cat {
          margin: 0;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--orange, #FF6102);
          font-family: "Plus Jakarta Sans", sans-serif;
        }
        .wl-card-name {
          font-size: 14px;
          font-weight: 700;
          color: #111;
          text-decoration: none;
          font-family: "Plus Jakarta Sans", sans-serif;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 0.2px;
          transition: color 0.2s ease;
        }
        .wl-card-name:hover { color: var(--orange, #FF6102); }
        .wl-card-prices {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 4px 0;
        }
        .wl-compare {
          font-size: 13px;
          color: #999;
          text-decoration: line-through;
          font-family: "Plus Jakarta Sans", sans-serif;
        }
        .wl-price {
          font-size: 16px;
          font-weight: 800;
          color: #dc2626;
          font-family: Outfit, sans-serif;
        }
        .wl-cart-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px;
          margin-top: 6px;
          border: none;
          border-radius: 10px;
          background: #111;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          font-family: "Plus Jakarta Sans", sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          cursor: pointer;
          transition: all 0.22s ease;
        }
        .wl-cart-btn:hover {
          background: var(--orange, #FF6102);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(107,30,46,0.35);
        }

        /* ── CTA ── */
        .wl-cta {
          display: flex;
          justify-content: center;
          margin-top: 56px;
        }
        .wl-continue-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 36px;
          border-radius: 99px;
          border: 2px solid var(--orange, #FF6102);
          color: var(--orange, #FF6102);
          text-decoration: none;
          font-weight: 700;
          font-size: 15px;
          font-family: "Plus Jakarta Sans", sans-serif;
          transition: all 0.25s ease;
        }
        .wl-continue-btn:hover {
          background: var(--orange, #FF6102);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(107,30,46,0.3);
        }

        @media (max-width: 640px) {
          .wl-header-inner { padding: 0 16px; }
          .wl-container { padding: 28px 16px 60px; }
          .wl-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .wl-clear-btn { padding: 8px 14px; font-size: 12px; }
          .wl-title { font-size: 26px; }
        }
      `}</style>
    </>
  );
}
