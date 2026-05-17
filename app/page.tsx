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
import FeaturedCollection from "@/components/FeaturedCollection";
import { LucideByName } from "@/components/LucideByName";
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

      {/* Trust ticker — directly under header, above hero */}
      <MarqueeBanner />

      {/* Hero */}
      <HeroSlider banners={banners} />

      {/* Category Showcase */}
      <CategoryShowcase />

      <FeaturedCollection products={featuredProducts} />

      {/* Promo Banner */}
      <PromoBanner />

      {/* New Arrivals */}
      <section style={{ padding: "80px 0", background: "var(--bg-primary)" }}>
        <div className="page-container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div
              className="section
              
              
              
              -tag"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
            >
              <LucideByName name="zap" size={14} color="var(--color-icon)" />
              Fresh Drops
            </div>
            <h2 className="section-title" style={{ marginTop: "10px" }}>
              New Arrivals
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "15px",
                marginTop: "8px",
                fontWeight: 500,
                maxWidth: "540px",
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: 1.6,
              }}
            >
              The latest additions to our premium collection
            </p>
            <Link
              href="/products?newArrival=true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "22px",
                fontSize: "14px",
                color: "var(--color-brand)",
                textDecoration: "none",
                fontWeight: 700,
                fontFamily: "Plus Jakarta Sans, sans-serif",
                background: "var(--color-brand-dim)",
                padding: "10px 20px",
                borderRadius: "100px",
              }}
            >
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
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px", color: "var(--text-secondary)" }}>
                <LucideByName name="sparkles" size={48} strokeWidth={1.75} />
              </div>
              <p style={{ fontSize: "16px", fontWeight: 600 }}>New arrivals coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* Trust stats — after social proof */}
      <StatsSection />

      {/* WhatsApp CTA */}
      {/* <WhatsAppCTA /> */}

      <Footer />
    </main>
  );
}
