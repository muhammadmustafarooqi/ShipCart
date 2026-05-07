import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import TrustBadges from "@/components/TrustBadges";
import ProductCard from "@/components/ProductCard";
import AnnouncementBar from "@/components/AnnouncementBar";
import MarqueeBanner from "@/components/MarqueeBanner";
import StatsSection from "@/components/StatsSection";
import CategoryShowcase from "@/components/CategoryShowcase";
import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import Link from "next/link";

async function getProducts(params: string) {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/products?${params}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch { return []; }
}

async function getBanners() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/banners`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.banners || [];
  } catch { return []; }
}

type Product = {
  _id: string; name: string; slug: string; price: number;
  comparePrice?: number; images: string[]; category: string;
  isFeatured?: boolean; isNewArrival?: boolean;
  rating?: number; reviewCount?: number; stock?: number;
};

export default async function HomePage() {
  const [featuredProducts, newArrivals, banners] = await Promise.all([
    getProducts("featured=true&limit=8"),
    getProducts("newArrival=true&limit=8"),
    getBanners(),
  ]);

  return (
    <main style={{ minHeight: "100vh" }}>
      {/* Announcement Bar */}
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <HeroSlider banners={banners} />

      {/* Scrolling Marquee */}
      <MarqueeBanner />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Stats */}
      <StatsSection />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Featured Products */}
      <section style={{ padding: "80px 0", background: "var(--bg-card)", borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)" }}>
        <div className="page-container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="section-tag">⭐ Editor&apos;s Choice</div>
              <h2 className="section-title" style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Featured Collection
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginTop: "8px", fontWeight: 500 }}>
                Hand-picked premium products loved by our customers
              </p>
            </div>
            <Link href="/products?featured=true" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontSize: "14px", color: "var(--color-brand)", textDecoration: "none",
              fontWeight: 700, fontFamily: "Plus Jakarta Sans, sans-serif",
              background: "var(--color-brand-dim)", padding: "10px 20px",
              borderRadius: "100px", transition: "all 0.2s ease",
            }}>
              View All →
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((p: Product) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-secondary)", background: "var(--bg-primary)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-hover)" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
              <p style={{ fontSize: "16px", fontWeight: 600 }}>Products loading...</p>
              <p style={{ fontSize: "14px", marginTop: "8px" }}>Check back shortly or seed the database.</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Promo Banner */}
      <section style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", padding: "80px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(37,99,235,.15) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-100px", left: "5%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(16,185,129,.1) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="page-container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", padding: "6px 20px", fontSize: "13px", color: "#ffffff", fontWeight: 600, marginBottom: "24px", backdropFilter: "blur(8px)", fontFamily: "Outfit, sans-serif" }}>
            🎉 Limited Time Offer
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, color: "#ffffff", marginBottom: "16px", fontFamily: "Outfit, sans-serif", letterSpacing: "-0.03em" }}>
            Elevate Your Lifestyle.
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "16px", marginBottom: "40px", maxWidth: "500px", margin: "0 auto 40px", lineHeight: 1.7, fontWeight: 500 }}>
            Experience premium quality with free nationwide delivery on all orders above Rs. 1,500. Zero advance payment required.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "16px", padding: "16px 36px", background: "#ffffff", color: "#0f172a", border: "none", borderRadius: "100px", fontWeight: 700, fontFamily: "Plus Jakarta Sans, sans-serif", textDecoration: "none", boxShadow: "0 8px 32px rgba(255,255,255,0.15)", transition: "all 0.3s ease" }}>
              🛒 Shop Now
            </Link>
            <Link href="/cart" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "16px", padding: "16px 36px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", fontWeight: 700, fontFamily: "Plus Jakarta Sans, sans-serif", textDecoration: "none", backdropFilter: "blur(8px)" }}>
              View Cart →
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section style={{ padding: "80px 0", background: "var(--bg-primary)" }}>
        <div className="page-container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="section-tag">⚡ Fresh Drops</div>
              <h2 className="section-title">New Arrivals</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginTop: "8px", fontWeight: 500 }}>
                The latest additions to our premium collection
              </p>
            </div>
            <Link href="/products?newArrival=true" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontSize: "14px", color: "var(--color-brand)", textDecoration: "none",
              fontWeight: 700, fontFamily: "Plus Jakarta Sans, sans-serif",
              background: "var(--color-brand-dim)", padding: "10px 20px",
              borderRadius: "100px",
            }}>
              View All →
            </Link>
          </div>
          {newArrivals.length > 0 ? (
            <div className="products-grid">
              {newArrivals.map((p: Product) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-secondary)", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-hover)" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🆕</div>
              <p style={{ fontSize: "16px", fontWeight: 600 }}>New arrivals coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* WhatsApp CTA */}
      <WhatsAppCTA />

      <Footer />
    </main>
  );
}
