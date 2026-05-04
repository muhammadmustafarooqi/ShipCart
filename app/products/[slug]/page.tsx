"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/CartProvider";
import { ShoppingCart, MessageCircle, Star, ChevronLeft, Truck, Shield, RotateCcw, Minus, Plus } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  description: string;
  shortDescription: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  tags?: string[];
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProduct(data.product);

        // Fetch related
        const relRes = await fetch(`/api/products?category=${data.product.category}&limit=4`);
        const relData = await relRes.json();
        setRelated(relData.products?.filter((p: Product) => p.slug !== slug) || []);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div className="spinner" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>😕</div>
          <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Product Not Found</h2>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>This product doesn&apos;t exist or has been removed.</p>
          <Link href="/products" className="btn-primary">Browse Products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercent = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const whatsappMsg = `Hi! I want to order:\n*${product.name}*\nPrice: Rs. ${product.price.toLocaleString()}\n\nPlease confirm availability.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

  const images = product.images.length > 0
    ? product.images
    : [`https://placehold.co/600x600/f5f5f5/ff6b00?text=${encodeURIComponent(product.name.slice(0, 20))}`];

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: images[0],
      slug: product.slug,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  return (
    <div>
      <Navbar />

      <div className="page-container" style={{ padding: "32px 16px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", fontSize: "13px", color: "#6b7280" }}>
          <Link href="/" style={{ color: "#6b7280", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link href="/products" style={{ color: "#6b7280", textDecoration: "none" }}>Products</Link>
          <span>/</span>
          <span style={{ color: "#1f2937", fontWeight: 500 }}>{product.name}</span>
        </div>

        {/* Back Button */}
        <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#6b7280", textDecoration: "none", fontSize: "14px", marginBottom: "24px" }}>
          <ChevronLeft size={16} /> Back to Products
        </Link>

        {/* Main Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", marginBottom: "60px" }}
          className="product-detail-grid">
          {/* Gallery */}
          <div>
            <div className="gallery-main" style={{ marginBottom: "16px" }}>
              <Image
                src={images[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                unoptimized
              />
            </div>
            {images.length > 1 && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`gallery-thumb ${selectedImage === i ? "active" : ""}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} width={80} height={80} style={{ width: "100%", height: "100%", objectFit: "cover" }} unoptimized />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Badges */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              {product.isNewArrival && <span className="badge-new">New Arrival</span>}
              {discountPercent > 0 && <span className="badge-sale">-{discountPercent}% OFF</span>}
              {product.isFeatured && (
                <span style={{ background: "rgba(255,107,0,0.1)", color: "#ff6b00", padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>
                  ⭐ Featured
                </span>
              )}
            </div>

            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937", marginBottom: "12px", lineHeight: 1.3 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill={star <= Math.round(product.rating || 4.5) ? "#fbbf24" : "none"} color={star <= Math.round(product.rating || 4.5) ? "#fbbf24" : "#d1d5db"} />
                ))}
              </div>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                {product.rating || 4.5} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <span className="price-current" style={{ fontSize: "32px" }}>
                Rs. {product.price.toLocaleString()}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="price-original" style={{ fontSize: "18px" }}>
                  Rs. {product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: 1.7, marginBottom: "24px" }}>
                {product.shortDescription}
              </p>
            )}

            {/* Category & Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
              <span style={{ background: "#f3f4f6", color: "#4b5563", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                📦 {product.category}
              </span>
              {product.tags?.slice(0, 3).map((tag) => (
                <span key={tag} style={{ background: "#fff3e8", color: "#ff6b00", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "14px", marginBottom: "10px" }}>Quantity</label>
              <div className="qty-control" style={{ display: "inline-flex" }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}>
                  <Plus size={16} />
                </button>
              </div>
              {product.stock !== undefined && product.stock <= 5 && (
                <span style={{ marginLeft: "12px", fontSize: "13px", color: "#f59e0b", fontWeight: 600 }}>
                  ⚡ Only {product.stock} left!
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
              <button onClick={handleAddToCart} className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "15px" }}>
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button onClick={handleBuyNow} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: "16px" }}>
                Buy Now — Rs. {(product.price * quantity).toLocaleString()}
              </button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ width: "100%", justifyContent: "center", padding: "15px" }}>
                <MessageCircle size={18} /> Order on WhatsApp
              </a>
            </div>

            {/* Trust Row */}
            <div style={{
              background: "#f9fafb",
              borderRadius: "12px",
              padding: "16px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              textAlign: "center",
            }}>
              {[
                { icon: <Truck size={20} color="#ff6b00" />, label: "Fast Delivery" },
                { icon: <Shield size={20} color="#ff6b00" />, label: "100% Original" },
                { icon: <RotateCcw size={20} color="#ff6b00" />, label: "Easy Returns" },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>{item.icon}</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* COD Note */}
            <div style={{
              marginTop: "16px",
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "10px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <span style={{ fontSize: "20px" }}>💰</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#065f46" }}>Cash on Delivery</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  Pay when you receive • Free delivery above Rs. 1,500
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px",
            border: "1px solid #f0f0f0",
            marginBottom: "48px",
          }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "16px", color: "#1f2937" }}>
              Product Details
            </h2>
            <div
              style={{ color: "#4b5563", lineHeight: 1.8, fontSize: "15px" }}
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: "26px", fontWeight: 800, marginBottom: "24px", color: "#1f2937" }}>
              Related Products
            </h2>
            <div className="products-grid">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      <style jsx global>{`
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
