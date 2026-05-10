"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/CartProvider";
import { ShoppingCart, ChevronLeft, Minus, Plus, Package, Zap, ShieldCheck } from "lucide-react";

interface Product {
  _id: string; name: string; slug: string; price: number; comparePrice?: number;
  images: string[]; category: string; description: string; shortDescription: string;
  isFeatured?: boolean; isNewArrival?: boolean; rating?: number;
  reviewCount?: number; stock?: number; tags?: string[]; colors?: string[];
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const cartBtnRef = useRef<HTMLButtonElement>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imgFade, setImgFade] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProduct(data.product);
        if (data.product.colors && data.product.colors.length > 0) {
          setSelectedColor(data.product.colors[0]);
        }
        const relRes = await fetch(`/api/products?category=${data.product.category}&limit=5`);
        const relData = await relRes.json();
        setRelated(relData.products?.filter((p: Product) => p._id !== id) || []);
      } catch { setProduct(null); }
      finally { setLoading(false); }
    }
    if (id) fetchProduct();
  }, [id]);

  const switchImage = (i: number) => {
    setImgFade(false);
    setTimeout(() => { setSelectedImage(i); setImgFade(true); }, 200);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ productId: product._id, name: product.name, price: product.price, quantity, image: images[0] });
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

  const s = { background: "var(--bg-primary)", minHeight: "100vh" };

  if (loading) return (
    <div style={s}><Navbar />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}><div className="spinner" /></div>
      <Footer /></div>
  );

  if (!product) return (
    <div style={s}><Navbar />
      <div style={{ textAlign: "center", padding: "120px 20px" }}>
        <div style={{ fontSize: "64px", marginBottom: "24px" }}>😕</div>
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

  const images = product.images.length > 0
    ? product.images
    : [getFallbackImage(product.category, product.name)];

  return (
    <div style={s}>
      <Navbar />

      <div className="page-container" style={{ padding: "40px 24px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px", fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
          <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}>Home</Link>
          <span>/</span>
          <Link href="/products" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}>Collection</Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", marginBottom: "64px" }} className="product-detail-grid">

          {/* Gallery */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Main Image */}
            <div style={{
              borderRadius: "var(--radius-xl)", overflow: "hidden",
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              aspectRatio: "1",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
              boxShadow: "var(--shadow-sm)"
            }}>
              <Image
                src={images[selectedImage]}
                alt={product.name}
                width={800} height={800}
                style={{ width: "100%", height: "100%", objectFit: "contain", opacity: imgFade ? 1 : 0, transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)", padding: "24px" }}
                unoptimized
              />
              {discount > 0 && (
                <div style={{ position: "absolute", top: "20px", left: "20px", background: "var(--text-primary)", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", color: "white", fontWeight: 700, fontFamily: "Outfit, sans-serif" }}>
                  −{discount}%
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => switchImage(i)}
                    style={{
                      width: "80px", height: "80px", borderRadius: "12px", overflow: "hidden",
                      background: "var(--bg-card)",
                      border: `2px solid ${selectedImage === i ? "var(--text-primary)" : "var(--border-default)"}`,
                      cursor: "pointer", opacity: selectedImage === i ? 1 : 0.6,
                      transition: "all 0.3s ease",
                      padding: "4px"
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--text-primary)"; (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                    onMouseLeave={(e) => {
                      if (selectedImage !== i) {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
                        (e.currentTarget as HTMLElement).style.opacity = "0.6";
                      }
                    }}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} width={80} height={80} style={{ width: "100%", height: "100%", objectFit: "contain" }} unoptimized />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category badge */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
              <span style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", color: "var(--text-secondary)", padding: "4px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", boxShadow: "var(--shadow-sm)" }}>
                <Package size={14} color="var(--color-icon)" /> {product.category}
              </span>
              {product.isNewArrival && <span style={{ background: "var(--color-brand-dim)", color: "var(--color-brand)", padding: "4px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, fontFamily: "Outfit, sans-serif" }}>New Arrival</span>}
              {product.isFeatured && <span style={{ background: "var(--text-primary)", color: "white", padding: "4px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, fontFamily: "Outfit, sans-serif" }}>⭐ Editor&apos;s Pick</span>}
            </div>

            <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px", lineHeight: 1.15, fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em" }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <span style={{ color: "var(--color-warning)", fontSize: "18px", letterSpacing: "2px" }}>{"★".repeat(Math.round(product.rating || 4))}<span style={{ color: "var(--border-hover)"}}>{"★".repeat(5 - Math.round(product.rating || 4))}</span></span>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
              <button ref={cartBtnRef} onClick={handleAddToCart} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "18px", fontSize: "16px" }}>
                <ShoppingCart size={18} color="white" /> Add to Cart — Rs. {(product.price * quantity).toLocaleString()}
              </button>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: "16px", textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Order via WhatsApp
              </a>
            </div>

            {/* Delivery Info Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
              {[
                { icon: <ShieldCheck size={20} color="var(--color-icon)" />, title: "100% Original", sub: "Quality checked" },
                { icon: <Zap size={20} color="var(--color-icon)" />, title: "Fast Shipping", sub: "Free over Rs.1500" },
                { icon: <Package size={20} color="var(--color-icon)" />, title: "Easy Returns", sub: "7-day policy" },
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
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xl)", padding: "40px", marginBottom: "64px", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "24px", fontFamily: "Outfit, sans-serif" }}>Product Details</h2>
            <div style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "15px", fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div>
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
      <style>{`@media(max-width:900px){.product-detail-grid{grid-template-columns:1fr!important; gap: 40px !important;}}`}</style>
    </div>
  );
}
