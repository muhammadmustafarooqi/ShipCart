import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import AnnouncementBar from "@/components/AnnouncementBar";
import MarqueeBanner from "@/components/MarqueeBanner";
import StatsSection from "@/components/StatsSection";
import CategoryShowcase from "@/components/CategoryShowcase";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import PromoBanner from "@/components/PromoBanner";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Banner from "@/models/Banner";

async function getProducts(query: Record<string, unknown>, limit = 8) {
  try {
    await connectDB();
    const products = await Product.find({ ...query, isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getBanners() {
  try {
    await connectDB();
    const banners = await Banner.find({ isActive: true })
      .sort({ order: 1 })
      .lean();
    return JSON.parse(JSON.stringify(banners));
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

type Product = {
  _id: string; name: string; slug: string; price: number;
  comparePrice?: number; images: string[]; category: string;
  isFeatured?: boolean; isNewArrival?: boolean;
  rating?: number; reviewCount?: number; stock?: number;
};

export default async function HomePage() {
  const [featuredProducts, newArrivals, banners] = await Promise.all([
    getProducts({ isFeatured: true }, 8),
    getProducts({ isNewArrival: true }, 8),
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
              <h2 className="section-title">
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

      {/* FAQ */}
      <FAQ />

      {/* Promo Banner */}
      <PromoBanner />

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
