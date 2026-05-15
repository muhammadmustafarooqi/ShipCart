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
};

export default function FeaturedCollection({ products }: { products: FeaturedProduct[] }) {
  const loopProducts =
    products.length > 0
      ? [...products, ...products, ...products, ...products]
      : [];

  return (
    <section className="fc-section" aria-labelledby="featured-collection-heading">
      <div className="fc-bg" aria-hidden />
      <div className="page-container fc-inner">
        <header className="fc-header">
          <div className="fc-header-copy">
            <div className="section-tag fc-kicker">Editor&apos;s choice</div>
            <h2 id="featured-collection-heading" className="fc-title">
              Featured Collection
            </h2>
            <p className="fc-sub">
              Hand-picked premium products our customers reorder most — quality-checked
              for your home and daily routine.
            </p>
            <Link href="/products?featured=true" className="fc-catalog-link">
              View all
              <ArrowUpRight size={17} strokeWidth={2.25} aria-hidden />
            </Link>
          </div>
        </header>

        {products.length > 0 ? (
          <div className="fc-marquee-rule" aria-hidden />
        ) : (
          <div className="fc-empty" role="status">
            <div className="fc-empty-icon" aria-hidden>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
              </svg>
            </div>
            <p className="fc-empty-title">Featured picks are on the way</p>
            <p className="fc-empty-text">Seed the catalog or mark products as featured in admin.</p>
          </div>
        )}
      </div>

      {products.length > 0 ? (
        <div className="fc-marquee-wrap">
          <div className="fc-marquee-edge fc-marquee-edge--left" aria-hidden />
          <div className="fc-marquee-edge fc-marquee-edge--right" aria-hidden />
          <div className="fc-track" role="list" aria-label="Featured products">
            {loopProducts.map((p, index) => (
              <div key={`${p._id}-${index}`} className="fc-card-slot" role="listitem">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <style>{`
        .fc-section {
          position: relative;
          padding: clamp(72px, 10vw, 104px) 0;
          background: var(--white);
          border-top: 1px solid var(--border-default);
          border-bottom: 1px solid var(--border-default);
          overflow: hidden;
        }

        .fc-bg {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 40% at 100% 0%, rgba(201, 168, 76, 0.08), transparent 58%),
            radial-gradient(ellipse 50% 42% at 0% 100%, rgba(107, 30, 46, 0.04), transparent 55%);
        }

        .fc-inner {
          position: relative;
          z-index: 1;
        }

        .fc-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: clamp(20px, 3vw, 28px);
        }

        .fc-header-copy {
          max-width: 720px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .fc-kicker {
          margin-bottom: 0;
        }

        .fc-title {
          margin: 10px 0 0;
          font-family: "Outfit", sans-serif;
          font-size: clamp(1.9rem, 4.2vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.1;
          background: linear-gradient(
            118deg,
            var(--maroon-deep) 0%,
            var(--maroon) 45%,
            var(--maroon-soft) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .fc-sub {
          margin-top: 12px;
          font-size: clamp(15px, 1.55vw, 17px);
          font-weight: 500;
          line-height: 1.65;
          max-width: 50ch;
          margin-left: auto;
          margin-right: auto;
          color: var(--text-secondary);
        }

        .fc-catalog-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 22px;
          padding: 11px 20px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          font-family: "Plus Jakarta Sans", sans-serif;
          color: var(--maroon);
          text-decoration: none;
          background: var(--white);
          border: 1px solid var(--cream-mid);
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.3s ease,
            border-color 0.25s ease,
            background 0.25s ease;
          white-space: nowrap;
        }

        .fc-catalog-link:hover {
          transform: translateY(-2px);
          border-color: rgba(201, 168, 76, 0.5);
          box-shadow: var(--shadow-md);
          background: linear-gradient(135deg, var(--white), var(--cream-dark));
        }

        .fc-marquee-rule {
          display: block;
          height: 3px;
          width: 64px;
          border-radius: 99px;
          background: linear-gradient(90deg, var(--gold), var(--maroon-soft));
          margin: 0 auto 20px;
        }

        .fc-marquee-wrap {
          position: relative;
          z-index: 1;
          width: 100%;
          overflow: hidden;
          padding: 0 0 8px;
        }

        .fc-marquee-edge {
          position: absolute;
          top: 0;
          bottom: 0;
          width: min(120px, 12vw);
          z-index: 4;
          pointer-events: none;
        }

        .fc-marquee-edge--left {
          left: 0;
          background: linear-gradient(to right, var(--white), transparent);
        }

        .fc-marquee-edge--right {
          right: 0;
          background: linear-gradient(to left, var(--white), transparent);
        }

        @keyframes fc-scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }

        .fc-track {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          width: max-content;
          gap: 20px;
          padding: 0 24px 8px;
          animation: fc-scroll-left 90s linear infinite;
        }

        .fc-track:hover {
          animation-play-state: paused;
        }

        .fc-card-slot {
          width: min(300px, calc(100vw - 48px));
          flex-shrink: 0;
        }

        @media (min-width: 480px) {
          .fc-card-slot {
            width: min(300px, 78vw);
          }
        }

        @media (min-width: 640px) {
          .fc-card-slot {
            width: 300px;
          }
        }

        .fc-empty {
          text-align: center;
          padding: clamp(48px, 7vw, 72px) 24px;
          border-radius: var(--radius-lg);
          background: var(--cream);
          border: 1px dashed var(--border-hover);
          color: var(--text-secondary);
        }

        .fc-empty-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          margin-bottom: 16px;
          border-radius: 16px;
          color: var(--maroon-soft);
          background: var(--color-brand-dim);
          border: 1px solid var(--cream-mid);
        }

        .fc-empty-title {
          font-family: "Outfit", sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .fc-empty-text {
          margin-top: 8px;
          font-size: 14px;
          font-weight: 500;
          max-width: 360px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.55;
        }

        @media (prefers-reduced-motion: reduce) {
          .fc-track {
            animation: none !important;
            overflow-x: auto;
            overflow-y: hidden;
            padding-bottom: 12px;
            scrollbar-width: thin;
          }

          .fc-track:hover {
            animation-play-state: running;
          }
        }
      `}</style>
    </section>
  );
}
