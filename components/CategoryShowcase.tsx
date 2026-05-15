"use client";

import Link from "next/link";
import { ChefHat, Sparkles, Home, Dumbbell, Zap, Baby, ArrowUpRight } from "lucide-react";

const unsplash = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;

type Cat = {
  name: string;
  slug: string;
  icon: typeof ChefHat;
  image: string;
  imagePosition: string;
};

const categories: Cat[] = [
  {
    name: "Kitchen & Cooking",
    slug: "kitchen-cooking",
    icon: ChefHat,
    image: unsplash("photo-1556911220-e15b29be8c8f", 1200),
    imagePosition: "center 60%",
  },
  {
    name: "Personal Care & Beauty",
    slug: "personal-care-beauty",
    icon: Sparkles,
    image: unsplash("photo-1596462502278-27bfdc403348", 700),
    imagePosition: "center 42%",
  },
  {
    name: "Home & Cleaning",
    slug: "home-cleaning",
    icon: Home,
    image: unsplash("photo-1581578731548-c64695cc6952", 700),
    imagePosition: "center 55%",
  },
  {
    name: "Fitness & Health",
    slug: "fitness-health",
    icon: Dumbbell,
    image: unsplash("photo-1517836357463-d25dfeac3438", 700),
    imagePosition: "center 45%",
  },
  {
    name: "Electronics & Gadgets",
    slug: "electronics-gadgets",
    icon: Zap,
    image: unsplash("photo-1498049794561-7780e7231661", 700),
    imagePosition: "center 50%",
  },
  {
    name: "Baby & Kids",
    slug: "baby-kids",
    icon: Baby,
    image: unsplash("photo-1515488042361-ee00e0ddd4e4", 900),
    imagePosition: "center 48%",
  },
];

function CategoryCard({ cat, featured }: { cat: Cat; featured?: boolean }) {
  const Icon = cat.icon;
  const iconSize = featured ? 34 : 22;
  const ctaSize = featured ? 17 : 14;

  return (
    <Link
      href={`/products?category=${cat.slug}`}
      className={`category-showcase-link ${featured ? "is-featured" : "is-compact"}`}
    >
      <article className={`category-showcase-card ${featured ? "category-showcase-card-featured" : ""}`}>
        <div
          className="category-showcase-bg"
          style={{
            backgroundImage: `url(${cat.image})`,
            backgroundPosition: cat.imagePosition,
          }}
        />
        <div className="category-showcase-scrim" aria-hidden />
        <div className="category-showcase-frame" aria-hidden />
        <div className="category-showcase-inner">
          <div className="category-showcase-icon">
            <Icon size={iconSize} strokeWidth={featured ? 2 : 2.2} aria-hidden />
          </div>
          <div className="category-showcase-copy">
            <h3 className="category-showcase-title">{cat.name}</h3>
            {featured ? (
              <p className="category-showcase-tagline">Cookware, prep tools & smart kitchen picks</p>
            ) : null}
            <span className="category-showcase-cta">
              Explore
              <ArrowUpRight size={ctaSize} strokeWidth={2.5} aria-hidden />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function CategoryShowcase() {
  const [hero, ...rail] = categories;

  return (
    <section
      className="category-showcase-section"
      style={{
        padding: "88px 0 96px",
        background: "linear-gradient(180deg, var(--cream) 0%, var(--cream-dark) 45%, var(--cream) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(107, 30, 46, 0.08), transparent 55%)",
          pointerEvents: "none",
        }}
      />

      <div className="category-showcase-wrap" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <div className="section-tag" style={{ justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--maroon)" strokeWidth="2.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            Browse Collections
          </div>
          <h2 className="section-title">Shop by Category</h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "16px",
              maxWidth: "520px",
              margin: "12px auto 0",
              fontWeight: 500,
              lineHeight: 1.55,
            }}
          >
            Curated looks for every room and routine — tap a mood and explore products that fit your life.
          </p>
        </div>

        <div className="category-showcase-bento">
          <div className="category-showcase-hero-slot">
            <CategoryCard cat={hero} featured />
          </div>
          <div className="category-showcase-rail">{rail.map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}</div>
        </div>
      </div>

      <style>{`
        .category-showcase-wrap {
          width: 100%;
          max-width: min(1520px, 100%);
          margin-left: auto;
          margin-right: auto;
          padding-left: clamp(16px, 4vw, 48px);
          padding-right: clamp(16px, 4vw, 48px);
          box-sizing: border-box;
        }

        .category-showcase-bento {
          display: grid;
          grid-template-columns: minmax(0, 1.22fr) minmax(0, 1fr);
          gap: 22px;
          width: 100%;
          max-width: none;
          margin: 0 auto;
          align-items: stretch;
        }

        .category-showcase-hero-slot {
          display: flex;
          min-height: 0;
        }

        .category-showcase-hero-slot .category-showcase-link {
          flex: 1;
          display: flex;
        }

        .category-showcase-hero-slot .category-showcase-card {
          flex: 1;
          min-height: 460px;
        }

        .category-showcase-hero-slot .category-showcase-inner {
          min-height: 460px;
          padding: 28px 28px 26px;
        }

        .category-showcase-rail {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-auto-rows: minmax(0, 1fr);
          gap: 16px;
          min-height: 460px;
        }

        .category-showcase-rail > .category-showcase-link:last-child {
          grid-column: 1 / -1;
        }

        .category-showcase-link {
          text-decoration: none;
          color: inherit;
          border-radius: var(--radius-lg);
          outline-offset: 4px;
        }

        .category-showcase-card {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid rgba(107, 30, 46, 0.18);
          box-shadow: var(--shadow-md);
          background: var(--maroon-deep);
          transition: box-shadow 0.35s ease, transform 0.35s ease, border-color 0.35s ease;
          height: 100%;
        }

        .is-compact .category-showcase-card {
          min-height: 0;
        }

        .is-compact .category-showcase-inner {
          min-height: 132px;
          padding: 14px 16px 14px;
          justify-content: space-between;
        }

        .category-showcase-rail > .category-showcase-link:last-child .category-showcase-inner {
          min-height: 112px;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .category-showcase-rail > .category-showcase-link:last-child .category-showcase-copy {
          text-align: right;
          flex: 1;
        }

        .category-showcase-rail > .category-showcase-link:last-child .category-showcase-title {
          margin-bottom: 6px;
        }

        .category-showcase-rail > .category-showcase-link:last-child .category-showcase-icon {
          flex-shrink: 0;
        }

        .category-showcase-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-repeat: no-repeat;
          transform: scale(1.02);
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .category-showcase-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            165deg,
            rgba(42, 21, 24, 0.25) 0%,
            rgba(74, 16, 32, 0.55) 45%,
            rgba(42, 21, 24, 0.88) 100%
          );
          transition: opacity 0.35s ease;
        }

        .category-showcase-card-featured .category-showcase-scrim {
          background: linear-gradient(
            125deg,
            rgba(42, 21, 24, 0.2) 0%,
            rgba(74, 16, 32, 0.35) 38%,
            rgba(42, 21, 24, 0.82) 72%,
            rgba(26, 10, 18, 0.92) 100%
          );
        }

        .category-showcase-frame {
          position: absolute;
          inset: 10px;
          border-radius: calc(var(--radius-lg) - 10px);
          border: 1px solid rgba(255, 253, 249, 0.12);
          pointer-events: none;
          opacity: 0.85;
        }

        .is-compact .category-showcase-frame {
          inset: 8px;
          border-radius: calc(var(--radius-lg) - 8px);
        }

        .category-showcase-inner {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
        }

        .category-showcase-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          background: rgba(255, 253, 249, 0.14);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 253, 249, 0.22);
          box-shadow: 0 8px 24px rgba(42, 21, 24, 0.2);
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease, color 0.3s ease;
        }

        .is-compact .category-showcase-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
        }

        .is-featured .category-showcase-icon {
          width: 62px;
          height: 62px;
          border-radius: 16px;
        }

        .category-showcase-copy {
          width: 100%;
        }

        .category-showcase-title {
          font-family: Outfit, sans-serif;
          font-size: clamp(0.95rem, 1.6vw, 1.05rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.22;
          color: var(--white);
          margin: 0 0 8px;
          text-shadow: 0 2px 16px rgba(42, 21, 24, 0.45);
          max-width: 16rem;
        }

        .is-featured .category-showcase-title {
          font-size: clamp(1.45rem, 3.2vw, 2.05rem);
          max-width: 12ch;
          margin-bottom: 10px;
        }

        .category-showcase-tagline {
          margin: 0 0 14px;
          font-size: clamp(0.88rem, 1.4vw, 0.98rem);
          font-weight: 500;
          color: rgba(255, 253, 249, 0.82);
          line-height: 1.45;
          max-width: 22rem;
        }

        .category-showcase-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          font-family: "Plus Jakarta Sans", sans-serif;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--gold);
          opacity: 0.95;
          transition: gap 0.25s ease, color 0.25s ease;
        }

        .is-featured .category-showcase-cta {
          font-size: 13px;
        }

        .category-showcase-link:hover .category-showcase-card,
        .category-showcase-link:focus-visible .category-showcase-card {
          transform: translateY(-5px);
          box-shadow: var(--shadow-xl);
          border-color: rgba(201, 168, 76, 0.45);
        }

        .category-showcase-link:hover .category-showcase-bg,
        .category-showcase-link:focus-visible .category-showcase-bg {
          transform: scale(1.08);
        }

        .category-showcase-link:hover .category-showcase-scrim,
        .category-showcase-link:focus-visible .category-showcase-scrim {
          opacity: 0.92;
          background: linear-gradient(
            165deg,
            rgba(42, 21, 24, 0.35) 0%,
            rgba(74, 16, 32, 0.62) 42%,
            rgba(42, 21, 24, 0.9) 100%
          );
        }

        .category-showcase-link:hover .category-showcase-card-featured .category-showcase-scrim,
        .category-showcase-link:focus-visible .category-showcase-card-featured .category-showcase-scrim {
          background: linear-gradient(
            125deg,
            rgba(42, 21, 24, 0.32) 0%,
            rgba(74, 16, 32, 0.48) 40%,
            rgba(42, 21, 24, 0.88) 78%,
            rgba(26, 10, 18, 0.94) 100%
          );
        }

        .category-showcase-link:hover .category-showcase-icon,
        .category-showcase-link:focus-visible .category-showcase-icon {
          background: rgba(201, 168, 76, 0.22);
          border-color: rgba(201, 168, 76, 0.55);
          color: var(--gold);
          transform: scale(1.05);
        }

        .category-showcase-link:hover .category-showcase-cta,
        .category-showcase-link:focus-visible .category-showcase-cta {
          gap: 10px;
          color: #e4cf7a;
        }

        @media (max-width: 960px) {
          .category-showcase-bento {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .category-showcase-hero-slot .category-showcase-card,
          .category-showcase-hero-slot .category-showcase-inner {
            min-height: 300px;
          }

          .category-showcase-rail {
            min-height: 0;
            grid-template-columns: repeat(2, 1fr);
          }

          .category-showcase-rail > .category-showcase-link:last-child {
            grid-column: 1 / -1;
          }

          .category-showcase-rail > .category-showcase-link:last-child .category-showcase-inner {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }

          .category-showcase-rail > .category-showcase-link:last-child .category-showcase-copy {
            text-align: left;
          }
        }

        @media (max-width: 520px) {
          .category-showcase-rail {
            grid-template-columns: 1fr;
          }

          .category-showcase-rail > .category-showcase-link:last-child {
            grid-column: 1;
          }

          .is-compact .category-showcase-inner {
            min-height: 148px;
          }

          .is-featured .category-showcase-title {
            max-width: none;
          }

          .category-showcase-hero-slot .category-showcase-card,
          .category-showcase-hero-slot .category-showcase-inner {
            min-height: 132px;
          }

          .category-showcase-hero-slot .category-showcase-inner {
            padding: 14px 16px 14px;
          }

          .category-showcase-hero-slot .is-featured .category-showcase-icon {
            width: 42px;
            height: 42px;
            border-radius: 12px;
          }

          .category-showcase-hero-slot .is-featured .category-showcase-title {
            font-size: 0.95rem;
            margin-bottom: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .category-showcase-card,
          .category-showcase-bg,
          .category-showcase-scrim,
          .category-showcase-icon,
          .category-showcase-cta {
            transition: none !important;
          }
          .category-showcase-link:hover .category-showcase-card,
          .category-showcase-link:focus-visible .category-showcase-card {
            transform: none;
          }
          .category-showcase-link:hover .category-showcase-bg,
          .category-showcase-link:focus-visible .category-showcase-bg {
            transform: scale(1.02);
          }
        }
      `}</style>
    </section>
  );
}
