import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";
import TrustBadges from "@/components/TrustBadges";
import ProductCard from "@/components/ProductCard";
import AnnouncementBar from "@/components/AnnouncementBar";
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
      <HeroSlider banners={banners} />
      <TrustBadges />
      <CategoryGrid />

      {/* Featured Products */}
      <section style={{ padding: "80px 0", background: "var(--bg-primary)" }}>
        <div className="page-container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="section-tag">⭐ Editor&apos;s Choice</div>
              <h2 className="section-title" style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Featured Collection</h2>
            </div>
            <Link href="/products?featured=true" style={{ fontSize: "14px", color: "var(--color-brand)", textDecoration: "none", fontWeight: 600, fontFamily: "Plus Jakarta Sans, sans-serif" }}>View Collection &rarr;</Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((p: { _id: string; name: string; slug: string; price: number; comparePrice?: number; images: string[]; category: string; isFeatured?: boolean; isNewArrival?: boolean; rating?: number; reviewCount?: number; stock?: number }) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-secondary)", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-hover)" }}>
              <p style={{ fontSize: "16px", fontWeight: 500 }}>No featured products yet.</p>
              <p style={{ fontSize: "14px", marginTop: "8px" }}>Add products from the admin panel and mark them as featured.</p>
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", padding: "80px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(37,99,235,.15) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-100px", left: "5%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(16,185,129,.15) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="page-container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", padding: "6px 20px", fontSize: "13px", color: "#ffffff", fontWeight: 600, marginBottom: "20px", backdropFilter: "blur(8px)" }}>
            🎉 Limited Time Offer
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, color: "#ffffff", marginBottom: "16px", fontFamily: "Outfit, sans-serif", letterSpacing: "-0.03em" }}>Elevate Your Lifestyle.</h2>
          <p style={{ color: "#94a3b8", fontSize: "16px", marginBottom: "36px", maxWidth: "500px", margin: "0 auto 36px", lineHeight: 1.6 }}>
            Experience premium quality with free nationwide delivery on all orders above Rs. 1,500. Zero advance payment required.
          </p>
          <Link href="/products" className="btn-primary" style={{ fontSize: "16px", padding: "16px 36px", background: "#ffffff", color: "#0f172a", border: "none" }}>
            Explore Collection
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section style={{ padding: "80px 0", background: "var(--bg-primary)" }}>
        <div className="page-container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="section-tag">⚡ Fresh Drops</div>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link href="/products?newArrival=true" style={{ fontSize: "14px", color: "var(--color-brand)", textDecoration: "none", fontWeight: 600, fontFamily: "Plus Jakarta Sans, sans-serif" }}>View All &rarr;</Link>
          </div>
          {newArrivals.length > 0 ? (
            <div className="products-grid">
              {newArrivals.map((p: { _id: string; name: string; slug: string; price: number; comparePrice?: number; images: string[]; category: string; isFeatured?: boolean; isNewArrival?: boolean; rating?: number; reviewCount?: number; stock?: number }) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-secondary)", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-hover)" }}>
              <p style={{ fontSize: "16px", fontWeight: 500 }}>No new arrivals yet.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
