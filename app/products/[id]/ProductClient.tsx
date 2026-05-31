"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/CartProvider";
import { useSettings } from "@/lib/useSettings";
import { fbq } from "@/lib/fpq";
import { ShoppingCart, Minus, Plus, Package, Zap, ShieldCheck, Frown, Truck, RefreshCcw, Play } from "lucide-react";

interface Product {
  _id: string; name: string; slug: string; price: number; comparePrice?: number;
  images: string[]; previewVideoUrl?: string; category: string; description: string; shortDescription: string;
  isFeatured?: boolean; isNewArrival?: boolean; rating?: number;
  reviewCount?: number; stock?: number; tags?: string[]; colors?: string[];
}

type MediaMode = "video" | "photos";

export default function ProductClient({ initialProduct, initialRelated }: { initialProduct: Product; initialRelated: Product[] }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { settings, loading: settingsLoading } = useSettings();
  const cartBtnRef = useRef<HTMLButtonElement>(null);

  const imageCount = Math.max(initialProduct.images.length, 1);

  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [related, setRelated] = useState<Product[]>(initialRelated);
  const [loading, setLoading] = useState(false);
  const [mediaMode, setMediaMode] = useState<MediaMode>("photos");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imgFade, setImgFade] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>(initialProduct?.colors?.[0] || "");
  const [isHovered, setIsHovered] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const detailVideoRef = useRef<HTMLVideoElement>(null);

  const advancePhoto = () => {
    setImgFade(false);
    setTimeout(() => {
      setPhotoIndex((prev) => (prev + 1) % imageCount);
      setImgFade(true);
    }, 200);
  };

  const switchMediaMode = (mode: MediaMode) => {
    setAutoRotate(false);
    if (mode === "photos" && mediaMode === "photos" && imageCount > 1) {
      advancePhoto();
      return;
    }
    setMediaMode(mode);
    setImgFade(false);
    if (mode === "video" && detailVideoRef.current) {
      detailVideoRef.current.currentTime = 0;
      void detailVideoRef.current.play().catch(() => {});
    }
    setTimeout(() => setImgFade(true), 200);
  };

  useEffect(() => {
    if (imageCount <= 1 || !autoRotate || mediaMode !== "photos" || isHovered) {
      return;
    }

    const interval = setInterval(advancePhoto, 4000);
    return () => clearInterval(interval);
  }, [imageCount, isHovered, autoRotate, mediaMode]);

  useEffect(() => {
    if (imageCount <= 1 || !isHovered || mediaMode !== "photos") {
      return;
    }

    advancePhoto();
    const interval = setInterval(advancePhoto, 1200);
    return () => clearInterval(interval);
  }, [imageCount, isHovered, mediaMode]);

  useEffect(() => {
    if (product) {
      fbq("track", "ViewContent", {
        content_ids: [product._id],
        content_name: product.name,
        value: product.price,
        currency: "PKR"
      });
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    fbq("track", "AddToCart", {
      content_ids: [product._id],
      content_name: product.name,
      value: product.price,
      currency: "PKR"
    });
    addItem({ productId: product._id, name: product.name, price: product.price, quantity, image: allImages[0] });
    if (cartBtnRef.current) {
      cartBtnRef.current.style.background = "var(--color-success)";
      cartBtnRef.current.style.borderColor = "var(--color-success)";
      cartBtnRef.current.style.color = "white";
      setTimeout(() => {
        if (cartBtnRef.current) {
          cartBtnRef.current.style.background = "";
          cartBtnRef.current.style.borderColor = "";
          cartBtnRef.current.style.color = "";
        }
      }, 500);
    }
  };

  const handleDirectCheckout = () => {
    if (!product) return;
    fbq("track", "AddToCart", {
      content_ids: [product._id],
      content_name: product.name,
      value: product.price,
      currency: "PKR"
    });
    addItem({ productId: product._id, name: product.name, price: product.price, quantity, image: allImages[0] });
    router.push('/checkout');
  };

  const s = { background: "var(--bg-primary)", minHeight: "100vh" };

  if (loading) return (
    <div style={s}><Navbar />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}><div className="spinner" /></div>
      <Footer /></div>
  );

  if (!product) return (
    <div style={s}><Navbar />
      <div style={{ textAlign: "center", padding: "120px 20px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px", color: "var(--text-secondary)" }}>
          <Frown size={64} strokeWidth={1.5} aria-hidden />
        </div>
        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px", fontFamily: "Outfit, sans-serif" }}>Product Not Found</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "16px" }}>This product doesn&apos;t exist or has been removed from our catalog.</p>
        <Link href="/products" className="btn-primary">Browse Collection</Link>
      </div>
      <Footer /></div>
  );

  const discount = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const waMsg = `Hi! I want to order:\n*${product.name}*\nPrice: Rs. ${product.price.toLocaleString()}\n\nPlease confirm availability.`;
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}`;

  const getFallbackImage = (category: string, name: string) => {
    const fallbacks: Record<string, string[]> = {
      "kitchen-cooking": [
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&q=80&w=400",
      ],
      "personal-care-beauty": [
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400",
      ],
      "home-cleaning": [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1584820927498-cafe2c1c9699?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1527515637-67c2dd43d411?auto=format&fit=crop&q=80&w=400",
      ],
      "fitness-health": [
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400",
      ],
      "electronics-gadgets": [
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=400",
      ],
      "baby-kids": [
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400",
      ]
    };
    const catImages = fallbacks[category] || fallbacks["electronics-gadgets"];
    const index = name.length % catImages.length;
    return catImages[index];
  };

  const allImages = product.images.length > 0
    ? product.images
    : [getFallbackImage(product.category, product.name)];

  const previewVideoUrl = product.previewVideoUrl?.trim() ?? "";
  const hasVideo =
    Boolean(previewVideoUrl) &&
    (/^https?:\/\//i.test(previewVideoUrl) || previewVideoUrl.startsWith("/"));
  const showMediaToggle = hasVideo || allImages.length > 1;
  const currentPhoto = allImages[photoIndex] ?? allImages[0];

  return (
    <div style={s}>
      <Navbar />

      <div className="page-container pd-page">
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500, overflowX: "auto", whiteSpace: "nowrap", paddingBottom: "4px" }}>
          <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}>Home</Link>
          <span>/</span>
          <Link href="/products" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}>Collection</Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", marginBottom: "64px" }} className="product-detail-grid">

          {/* Gallery */}
          <div
            className="pd-gallery-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Main viewer */}
            <div className="pd-main-viewer">
              {mediaMode === "video" && hasVideo ? (
                <video
                  ref={detailVideoRef}
                  key={previewVideoUrl}
                  src={previewVideoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="pd-main-media"
                  style={{
                    opacity: imgFade ? 1 : 0,
                    transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              ) : (
                <Image
                  src={currentPhoto}
                  alt={product.name}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className="pd-main-media"
                  style={{
                    opacity: imgFade ? 1 : 0,
                    transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  unoptimized
                />
              )}
              {discount > 0 && (
                <div style={{ position: "absolute", top: "20px", left: "20px", background: "var(--text-primary)", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", color: "white", fontWeight: 700, fontFamily: "Outfit, sans-serif", zIndex: 2 }}>
                  −{discount}%
                </div>
              )}
            </div>

            {showMediaToggle && (
              <div className="pd-media-toggle-wrap">
                <div
                  className={`pd-media-toggle${hasVideo ? "" : " pd-media-toggle--solo"} pd-media-toggle--mode-${mediaMode}`}
                  role="group"
                  aria-label="Product media"
                >
                  <span className="pd-media-toggle-slider" aria-hidden />
                  {hasVideo && (
                    <button
                      type="button"
                      className={`pd-media-toggle-seg${mediaMode === "video" ? " pd-media-toggle-seg--active" : ""}`}
                      aria-pressed={mediaMode === "video"}
                      onClick={() => switchMediaMode("video")}
                    >
                      Video
                    </button>
                  )}
                  <button
                    type="button"
                    className={`pd-media-toggle-seg${mediaMode === "photos" ? " pd-media-toggle-seg--active" : ""}`}
                    aria-pressed={mediaMode === "photos"}
                    onClick={() => switchMediaMode("photos")}
                  >
                    Photos {photoIndex + 1}/{allImages.length}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="pd-product-info">
            {/* Category badge */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
              <span style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", color: "var(--text-secondary)", padding: "4px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", boxShadow: "var(--shadow-sm)" }}>
                <Package size={14} color="var(--color-icon)" /> {product.category}
              </span>
              {product.isNewArrival && <span style={{ background: "var(--color-brand-dim)", color: "var(--color-brand)", padding: "4px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, fontFamily: "Outfit, sans-serif" }}>New Arrival</span>}
              {/* {product.isFeatured && (
                <span style={{ background: "var(--text-primary)", color: "white", padding: "4px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, fontFamily: "Outfit, sans-serif", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <Star size={14} fill="white" aria-hidden /> Editor&apos;s Pick
                </span>
              )} */}
            </div>

            <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px", lineHeight: 1.15, fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em" }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <span style={{ color: "var(--color-warning)", fontSize: "18px", letterSpacing: "2px" }}>{"★".repeat(Math.round(product.rating || 4))}<span style={{ color: "var(--border-hover)" }}>{"★".repeat(5 - Math.round(product.rating || 4))}</span></span>
              <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>{product.rating || 4.5} ({product.reviewCount || 0} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px" }}>
              <span style={{ fontSize: "36px", fontWeight: 800, color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>Rs. {product.price.toLocaleString()}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span style={{ fontSize: "18px", color: "var(--text-old-price)", textDecoration: "line-through", fontWeight: 500 }}>Rs. {product.comparePrice.toLocaleString()}</span>
              )}
            </div>

            <div style={{ borderTop: "1px solid var(--border-default)", marginBottom: "24px" }} />

            {/* Short description */}
            {product.shortDescription && (
              <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.7, marginBottom: "32px", fontWeight: 500 }}>{product.shortDescription}</p>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
                {product.tags.slice(0, 4).map((tag) => (
                  <span key={tag} style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", color: "var(--text-secondary)", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit, sans-serif" }}>Select Color</label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "100px",
                        border: selectedColor === color ? "2px solid var(--text-primary)" : "2px solid var(--border-default)",
                        background: selectedColor === color ? "var(--text-primary)" : "var(--bg-card)",
                        color: selectedColor === color ? "white" : "var(--text-primary)",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: selectedColor === color ? 700 : 500,
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        transition: "all 0.2s ease",
                        boxShadow: selectedColor === color ? "0 4px 12px rgba(15,23,42,0.15)" : "var(--shadow-sm)"
                      }}
                      onMouseEnter={(e) => {
                        if (selectedColor !== color) {
                          (e.currentTarget as HTMLElement).style.borderColor = "var(--text-primary)";
                          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedColor !== color) {
                          (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
                          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        }
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit, sans-serif" }}>Quantity</label>
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <div className="qty-control" style={{ background: "var(--bg-card)" }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} color="var(--color-icon)" /></button>
                  <span style={{ minWidth: "48px", fontSize: "16px" }}>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}><Plus size={16} color="var(--color-icon)" /></button>
                </div>
                {product.stock !== undefined && product.stock <= 5 && (
                  <span style={{ marginLeft: "16px", fontSize: "14px", color: "var(--color-warning)", fontWeight: 700, fontFamily: "Outfit, sans-serif" }}><Zap size={16} color="var(--color-icon)" style={{ display: "inline", verticalAlign: "text-bottom" }} /> Only {product.stock} units left!</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              <button ref={cartBtnRef} onClick={handleAddToCart} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "18px", fontSize: "16px" }}>
                <ShoppingCart size={18} color="white" /> Add to Cart
              </button>
              <button onClick={handleDirectCheckout} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "18px", fontSize: "16px" }}>
                <Zap size={18} color="white" style={{ marginRight: "6px" }} /> Buy Now
              </button>
            </div>

            {/* Delivery & returns */}
            <div className="pd-delivery-panel">
              <div className="pd-delivery-col">
                <div className="pd-delivery-icon" aria-hidden>
                  <Truck size={28} color="var(--maroon)" strokeWidth={1.75} />
                </div>
                <h3 className="pd-delivery-heading">Estimate Delivery Times</h3>
                <p className="pd-delivery-line">1-2 days karachi</p>
                <p className="pd-delivery-line">3-5 days pakistan</p>
              </div>
              <div className="pd-delivery-divider" aria-hidden />
              <div className="pd-delivery-col">
                <div className="pd-delivery-icon" aria-hidden>
                  <RefreshCcw size={28} color="var(--maroon)" strokeWidth={1.75} />
                </div>
                <h3 className="pd-delivery-heading">Return And Exchange Within</h3>
                <p className="pd-delivery-line">
                  <strong>7 Days</strong> Of Purchase.
                </p>
                <p className="pd-delivery-line pd-delivery-line--muted">
                  Duties, Taxes &amp; Shipping Are Non-Refundable.
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="pd-trust-badges">
              {[
                { icon: <ShieldCheck size={20} color="var(--color-icon)" />, title: "100% Original", sub: "Quality checked" },
                { icon: <Zap size={20} color="var(--color-icon)" />, title: "Fast Shipping", sub: settings ? `Free over Rs.${settings.freeDeliveryAbove.toLocaleString()}` : "Free over Rs.3000" },
              ].map((item) => (
                <div key={item.title} style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "16px", padding: "16px 12px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>{item.icon}</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px", fontFamily: "Outfit, sans-serif" }}>{item.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 500 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="pd-page-section" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xl)", padding: "40px", marginBottom: "64px", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "24px", fontFamily: "Outfit, sans-serif" }}>Product Details</h2>
            <div style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "15px", fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div className="pd-page-section">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px" }}>
              <h2 className="section-title">Similar Products</h2>
              <Link href={`/products?category=${product.category}`} style={{ fontSize: "14px", color: "var(--color-brand)", textDecoration: "none", fontWeight: 600, fontFamily: "Plus Jakarta Sans, sans-serif" }}>See All &rarr;</Link>
            </div>
            <div className="products-grid">
              {related.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <style>{`
        .pd-page {
          padding: 40px 24px;
          box-sizing: border-box;
        }

        .pd-main-viewer {
          border-radius: 0;
          overflow: hidden;
          background: var(--gradient-card-img);
          border: 1px solid var(--border-default);
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: var(--shadow-sm);
        }

        .pd-main-media,
        .pd-main-viewer img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 24px;
          box-sizing: border-box;
          border-radius: 0;
        }

        @media (max-width: 900px) {
          .pd-page {
            padding: 20px 16px 32px;
          }

          .product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            margin-bottom: 40px !important;
          }

          .pd-main-viewer {
            width: 100%;
            border-radius: 0 !important;
            aspect-ratio: 1;
            background: var(--gradient-card-img);
          }

          .pd-main-media,
          .pd-main-viewer img,
          .pd-main-viewer video {
            object-fit: cover !important;
            padding: 0 !important;
            border-radius: 0 !important;
          }

          .pd-media-toggle-wrap {
            padding: 0 16px;
          }

          .pd-product-info {
            padding: 0 16px;
          }

          .pd-page-section {
            margin-left: 16px;
            margin-right: 16px;
          }
        }

        .pd-media-toggle-wrap {
          display: flex;
          justify-content: center;
          margin-top: 14px;
          padding-bottom: 4px;
        }

        .pd-media-toggle {
          position: relative;
          width: fit-content;
          max-width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          min-width: 180px;
          padding: 4px;
          border-radius: 999px;
          background: var(--maroon-deep);
          border: 1px solid rgba(201, 168, 76, 0.35);
          box-shadow: 0 4px 14px rgba(86, 18, 40, 0.35);
          pointer-events: none;
        }

        .pd-media-toggle--solo {
          grid-template-columns: 1fr;
          min-width: 128px;
        }

        .pd-media-toggle-slider {
          position: absolute;
          top: 4px;
          bottom: 4px;
          left: 4px;
          width: calc((100% - 8px) / 2);
          border-radius: 999px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: 0;
        }

        .pd-media-toggle--solo .pd-media-toggle-slider {
          width: calc(100% - 8px);
          transform: none !important;
        }

        .pd-media-toggle--mode-video .pd-media-toggle-slider {
          transform: translateX(0);
        }

        .pd-media-toggle--mode-photos .pd-media-toggle-slider {
          transform: translateX(100%);
        }

        .pd-media-toggle-seg {
          position: relative;
          z-index: 1;
          border: none;
          background: transparent;
          color: var(--white);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.2;
          padding: 9px 14px;
          border-radius: 999px;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.22s ease;
          pointer-events: auto;
        }

        .pd-media-toggle-seg--active {
          color: var(--text);
        }

        .pd-media-toggle-seg:not(.pd-media-toggle-seg--active):hover {
          color: var(--white);
        }

        .pd-delivery-panel {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: stretch;
          margin-bottom: 24px;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .pd-delivery-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px 16px;
          gap: 6px;
        }

        .pd-delivery-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .pd-delivery-heading {
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px;
          line-height: 1.35;
        }

        .pd-delivery-line {
          margin: 0;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .pd-delivery-line strong {
          font-weight: 800;
          color: var(--text-primary);
        }

        .pd-delivery-line--muted {
          font-size: 11px;
          line-height: 1.45;
        }

        .pd-delivery-divider {
          width: 1px;
          background: var(--border-default);
          margin: 12px 0;
        }

        .pd-trust-badges {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 520px) {
          .pd-delivery-panel {
            grid-template-columns: 1fr;
          }

          .pd-delivery-divider {
            width: auto;
            height: 1px;
            margin: 0 12px;
          }
        }
      `}</style>
    </div>
  );
}
