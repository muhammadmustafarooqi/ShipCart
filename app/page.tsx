import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";
import TrustBadges from "@/components/TrustBadges";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight, Zap, Star } from "lucide-react";

async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/products?featured=true&limit=8`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

async function getNewArrivals() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/products?newArrival=true&limit=8`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

async function getBanners() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/banners`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.banners || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, newArrivals, banners] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getBanners(),
  ]);

  return (
    <main>
      <Navbar />

      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span>🚚 Free Delivery on Orders Above PKR 1,500 &nbsp;|&nbsp; 💰 Cash on Delivery Available Nationwide &nbsp;|&nbsp; ✅ 100% Original Products</span>
      </div>

      {/* Hero Slider */}
      <HeroSlider banners={banners} />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Category Grid */}
      <CategoryGrid />

      {/* Featured Products */}
      <section style={{ padding: "60px 0", background: "white" }}>
        <div className="page-container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Star size={18} color="#ff6b00" fill="#ff6b00" />
                <span style={{ color: "#ff6b00", fontWeight: 600, fontSize: "14px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  Hand Picked
                </span>
              </div>
              <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#1f2937" }}>
                Featured Products
              </h2>
              <div className="section-divider" style={{ margin: "12px 0 0" }} />
            </div>
            <Link href="/products?featured=true" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((product: {_id: string; name: string; slug: string; price: number; comparePrice?: number; images: string[]; category: string; isFeatured?: boolean; isNewArrival?: boolean; rating?: number; reviewCount?: number; stock?: number}) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
              <p style={{ fontSize: "18px" }}>No featured products yet.</p>
              <p style={{ fontSize: "14px", marginTop: "8px" }}>Add products from the admin panel and mark them as featured.</p>
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: "60px 32px",
        margin: "0",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "300px",
          height: "300px",
          background: "rgba(255,107,0,0.1)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-80px",
          left: "10%",
          width: "200px",
          height: "200px",
          background: "rgba(255,107,0,0.05)",
          borderRadius: "50%",
        }} />
        <div className="page-container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(255,107,0,0.15)",
            border: "1px solid rgba(255,107,0,0.3)",
            borderRadius: "20px",
            padding: "6px 20px",
            fontSize: "13px",
            color: "#ff6b00",
            fontWeight: 600,
            marginBottom: "16px",
          }}>
            🎉 Special Offer
          </div>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 900, color: "white", marginBottom: "16px" }}>
            Shop Smart. Save More.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
            Get free delivery on all orders above Rs. 1,500. Pay cash on delivery - no advance payment required!
          </p>
          <Link href="/products" className="btn-primary" style={{ fontSize: "16px", padding: "16px 36px" }}>
            Shop Now — No Advance Payment
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section style={{ padding: "60px 0", background: "#f9fafb" }}>
        <div className="page-container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Zap size={18} color="#ff6b00" />
                <span style={{ color: "#ff6b00", fontWeight: 600, fontSize: "14px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  Just Arrived
                </span>
              </div>
              <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#1f2937" }}>
                New Arrivals
              </h2>
              <div className="section-divider" style={{ margin: "12px 0 0" }} />
            </div>
            <Link href="/products?newArrival=true" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {newArrivals.length > 0 ? (
            <div className="products-grid">
              {newArrivals.map((product: {_id: string; name: string; slug: string; price: number; comparePrice?: number; images: string[]; category: string; isFeatured?: boolean; isNewArrival?: boolean; rating?: number; reviewCount?: number; stock?: number}) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
              <p style={{ fontSize: "18px" }}>No new arrivals yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
