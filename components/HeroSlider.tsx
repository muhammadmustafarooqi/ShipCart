"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

interface BannerData {
  _id: string;
  image: string;
  link?: string;
  title?: string;
  subtitle?: string;
  mobileSrc?: string;
}

export default function HeroSlider({ banners = [] }: { banners?: BannerData[] }) {
  const [current, setCurrent] = useState(0);

  const STATIC_BANNERS = [
    { 
      _id: "1", 
      image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=1200&q=80", 
      title: "Elevate Your Lifestyle Today.",
      subtitle: "Discover our curated collection of premium electronics, smart home essentials, and modern kitchenware designed to transform your everyday routine.",
      link: "/products?category=electronics-gadgets" 
    },
    { 
      _id: "2", 
      image: "https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&w=1200&q=80", 
      title: "The Modern Kitchen.",
      subtitle: "Elevate your culinary experience with top-tier appliances.",
      link: "/products?category=kitchen-cooking" 
    },
    { 
      _id: "3", 
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80", 
      title: "Smart Living.",
      subtitle: "Technology that understands you.",
      link: "/products" 
    },
  ];

  const displayBanners = banners.length > 0 ? banners : STATIC_BANNERS;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % displayBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayBanners.length]);

  return (
    <section className="overlap-hero-section">
      <div className="overlap-hero-bg">
        {displayBanners.map((banner, index) => (
          <div 
            key={banner._id}
            className={`hero-bg-slide ${current === index ? "active" : ""}`}
            style={{ backgroundImage: `url(${banner.image})` }}
          >
            <div className="hero-bg-overlay" />
          </div>
        ))}
      </div>

      <div className="page-container hero-content-container">
        <div className="hero-content-card">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            New Arrivals 2026
          </div>
          
          <h1 className="hero-title">
            {displayBanners[current].title || "Premium Selection."}
          </h1>
          
          <p className="hero-description">
            {displayBanners[current].subtitle || "Discover the best products tailored for you."}
          </p>
          
          <div className="hero-actions">
            <Link href={displayBanners[current].link || "/products"} className="btn-primary">
              Shop Collection
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-num">50k+</span>
              <span className="stat-label">Customers</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-num">24/7</span>
              <span className="stat-label">Support</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-num">Fast</span>
              <span className="stat-label">Delivery</span>
            </div>
          </div>
        </div>

        <div className="visual-indicators">
          {displayBanners.map((_, i) => (
            <button
              key={i}
              className={`indicator-dot ${current === i ? "active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .overlap-hero-section {
          position: relative;
          width: 100%;
          min-height: calc(100vh - 100px);
          display: flex;
          align-items: flex-end;
          padding-bottom: 60px;
        }

        .overlap-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .hero-bg-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1s ease-in-out, transform 6s cubic-bezier(0.25, 1, 0.5, 1);
          transform: scale(1.05);
        }

        .hero-bg-slide.active {
          opacity: 1;
          transform: scale(1);
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom right,
            rgba(16, 40, 87, 0.6) 0%,
            rgba(0, 0, 0, 0.2) 50%,
            transparent 100%
          );
        }

        .hero-content-container {
          position: relative;
          z-index: 10;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .hero-content-card {
          background: rgba(16, 40, 87, 0.65);
          color: var(--white);
          padding: 56px;
          border-radius: 24px;
          max-width: 580px;
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          position: relative;
        }

        .hero-content-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 24px;
          background: radial-gradient(circle at top left, rgba(255, 97, 2, 0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(16, 40, 87, 0.5);
          border: 1px solid rgba(255, 97, 2, 0.3);
          box-shadow: 0 0 12px rgba(255, 97, 2, 0.15);
          padding: 6px 16px;
          border-radius: 100px;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 24px;
        }

        .badge-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--orange);
          box-shadow: 0 0 0 0 rgba(255, 97, 2, 0.7);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 97, 2, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 97, 2, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 97, 2, 0); }
        }

        .hero-title {
          font-family: "Outfit", sans-serif;
          font-size: clamp(2.25rem, 3.5vw, 3.25rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 0 0 20px;
          color: var(--white);
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .hero-description {
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 1.15rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          margin: 0 0 40px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 48px;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-num {
          font-family: "Outfit", sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--white);
          text-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .stat-label {
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .stat-divider {
          width: 1px;
          height: 28px;
          background: rgba(255, 255, 255, 0.2);
        }

        .visual-indicators {
          display: flex;
          gap: 12px;
          padding-bottom: 24px;
        }

        .indicator-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .indicator-dot:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .indicator-dot.active {
          background: var(--orange);
          transform: scale(1.3);
        }

        @media (max-width: 1024px) {
          .overlap-hero-section {
            align-items: center;
            padding-top: 60px;
          }
          .hero-content-container {
            flex-direction: column;
            align-items: center;
            gap: 40px;
          }
          .hero-content-card {
            margin-top: 20px;
            padding: 32px;
          }
          .visual-indicators {
            padding-bottom: 0;
          }
        }
      `}</style>
    </section>
  );
}