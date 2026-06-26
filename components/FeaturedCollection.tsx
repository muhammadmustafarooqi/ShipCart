import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export type FeaturedProduct = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  previewVideoUrl?: string;
  shortDescription?: string;
};

export default function FeaturedCollection({ products }: { products: FeaturedProduct[] }) {
  return (
    <section className="editorial-fc-section" aria-labelledby="featured-collection-heading">
      <div className="page-container editorial-fc-inner">
        
        {/* Left Side: Sticky Description */}
        <div className="editorial-fc-sticky">
          <div className="fc-sticky-content">
            <h2 id="featured-collection-heading" className="fc-title">
              Our Top Picks.
            </h2>
            <div className="fc-title-underline" />
            <p className="fc-sub">
              A curated selection of our most loved, premium products. Hand-picked for quality and performance.
            </p>
            <Link href="/products?featured=true" className="fc-catalog-link">
              Shop the Collection
              <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden />
            </Link>
          </div>
        </div>

        {/* Right Side: Horizontal Scrolling List */}
        <div className="editorial-fc-scroll">
          {products.length > 0 ? (
            <div className="fc-scroll-track" role="list" aria-label="Featured products">
              {products.slice(0, 8).map((p) => (
                <div key={p._id} className="fc-card-slot" role="listitem">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="fc-empty" role="status">
              <p className="fc-empty-title">Featured picks are on the way</p>
              <p className="fc-empty-text">Check back soon for our curated selections.</p>
            </div>
          )}
        </div>

      </div>

      <style>{`
        .editorial-fc-section {
          padding: 120px 0;
          background: var(--cream);
          position: relative;
        }

        .editorial-fc-inner {
          display: flex;
          gap: 60px;
          align-items: flex-start;
        }

        /* --- Left Side --- */
        .editorial-fc-sticky {
          flex: 0 0 340px;
          position: sticky;
          top: 140px;
        }

        .fc-sticky-content {
          padding-right: 20px;
        }

        .fc-title {
          font-family: var(--font-outfit), sans-serif;
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 900;
          color: var(--navy-deep);
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin: 0 0 16px;
        }

        .fc-title-underline {
          width: 80px;
          height: 5px;
          background: var(--orange);
          border-radius: 4px;
          margin-bottom: 24px;
        }

        .fc-sub {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 1.15rem;
          color: var(--slate);
          line-height: 1.6;
          margin: 0 0 32px;
        }

        .fc-catalog-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 32px;
          border-radius: 999px;
          font-family: var(--font-jakarta), sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: var(--white);
          background: var(--orange);
          text-decoration: none;
          box-shadow: 0 10px 25px -5px rgba(255, 97, 2, 0.4);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .fc-catalog-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px -5px rgba(255, 97, 2, 0.5);
          background: #ff7825;
        }

        /* --- Right Side --- */
        .editorial-fc-scroll {
          flex: 1;
          min-width: 0; /* allows flex item to shrink below content size if needed */
        }

        .fc-scroll-track {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding: 20px 20px 40px 0; /* padding bottom for shadow room */
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .fc-scroll-track::-webkit-scrollbar {
          display: none;
        }

        .fc-card-slot {
          flex: 0 0 calc(50% - 12px); /* Show exactly 2 cards desktop */
          min-width: 280px;
          max-width: 320px;
          scroll-snap-align: start;
        }

        .fc-empty {
          text-align: center;
          padding: 60px;
          background: var(--white);
          border-radius: var(--radius-lg);
          border: 1px dashed var(--border-default);
        }

        .fc-empty-title {
          font-family: var(--font-outfit), sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--navy);
        }

        .fc-empty-text {
          color: var(--slate);
          margin-top: 8px;
        }

        /* --- Responsive --- */
        @media (max-width: 1024px) {
          .editorial-fc-inner {
            flex-direction: column;
            gap: 40px;
          }
          .editorial-fc-sticky {
            flex: none;
            position: relative;
            top: 0;
            max-width: 600px;
          }
          .fc-scroll-track {
            padding-left: 20px; /* full bleed on mobile edge */
            margin-left: -20px;
            margin-right: -20px;
          }
          .fc-card-slot {
            flex: 0 0 280px;
          }
        }
      `}</style>
    </section>
  );
}
