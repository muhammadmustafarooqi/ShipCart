"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

interface HeroSliderProps {
  banners: Banner[];
}

const DEFAULT_BANNERS = [
  {
    _id: "1",
    title: "Smart Gadgets for Every Home",
    subtitle: "Free delivery on orders above Rs. 1,500 | Cash on Delivery",
    image: "https://placehold.co/1400x550/ff6b00/ffffff?text=ALLInONE+Store",
    link: "/products",
  },
  {
    _id: "2",
    title: "Kitchen Tools & Accessories",
    subtitle: "Cook smarter with our premium kitchen gadgets",
    image: "https://placehold.co/1400x550/1a1a2e/ff6b00?text=Kitchen+Collection",
    link: "/products?category=kitchen-cooking",
  },
  {
    _id: "3",
    title: "Personal Care Devices",
    subtitle: "Look and feel your best with our personal care range",
    image: "https://placehold.co/1400x550/e55a00/ffffff?text=Personal+Care",
    link: "/products?category=personal-care-beauty",
  },
];

export default function HeroSlider({ banners }: HeroSliderProps) {
  const slides = banners.length > 0 ? banners : DEFAULT_BANNERS;
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goPrev = () => goTo((current - 1 + slides.length) % slides.length);
  const goNext = () => goTo((current + 1) % slides.length);

  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      borderRadius: "0",
      background: "#1a1a2e",
    }}>
      {/* Slides */}
      <div style={{
        display: "flex",
        transform: `translateX(-${current * 100}%)`,
        transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        {slides.map((banner, index) => (
          <div
            key={banner._id}
            style={{
              minWidth: "100%",
              position: "relative",
              height: "480px",
              display: "flex",
              alignItems: "center",
              background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`,
            }}
          >
            {/* Background Image */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${banner.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.4,
            }} />

            {/* Overlay gradient */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, rgba(26,26,46,0.95) 0%, rgba(26,26,46,0.6) 50%, rgba(26,26,46,0.3) 100%)",
            }} />

            {/* Content */}
            <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
              <div style={{ maxWidth: "600px" }}>
                <div style={{
                  display: "inline-block",
                  background: "rgba(255,107,0,0.15)",
                  border: "1px solid rgba(255,107,0,0.3)",
                  borderRadius: "20px",
                  padding: "6px 16px",
                  fontSize: "13px",
                  color: "#ff6b00",
                  fontWeight: 600,
                  marginBottom: "16px",
                  letterSpacing: "0.5px",
                }}>
                  🇵🇰 Pakistan&apos;s #1 Gadget Store
                </div>
                <h1 style={{
                  fontSize: "clamp(28px, 5vw, 52px)",
                  fontWeight: 900,
                  color: "white",
                  lineHeight: 1.15,
                  marginBottom: "16px",
                  letterSpacing: "-0.5px",
                }}>
                  {banner.title}
                </h1>
                <p style={{
                  fontSize: "clamp(14px, 2vw, 18px)",
                  color: "rgba(255,255,255,0.75)",
                  marginBottom: "32px",
                  lineHeight: 1.6,
                }}>
                  {banner.subtitle}
                </p>
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <Link href={banner.link} className="btn-primary" style={{ fontSize: "15px", padding: "14px 28px" }}>
                    Shop Now →
                  </Link>
                  <Link href="/products" className="btn-secondary" style={{
                    color: "white",
                    borderColor: "rgba(255,255,255,0.4)",
                    fontSize: "15px",
                    padding: "12px 26px",
                  }}>
                    Browse All
                  </Link>
                </div>

                {/* Badges */}
                <div style={{ display: "flex", gap: "16px", marginTop: "32px", flexWrap: "wrap" }}>
                  {["💳 Cash on Delivery", "🚚 Free Delivery Rs.1500+", "✅ 100% Original"].map((badge) => (
                    <div key={badge} style={{
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      padding: "8px 14px",
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: 500,
                      backdropFilter: "blur(4px)",
                    }}>
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Slide number */}
            <div style={{
              position: "absolute",
              bottom: "20px",
              right: "32px",
              color: "rgba(255,255,255,0.3)",
              fontSize: "13px",
              fontWeight: 600,
            }}>
              {index + 1} / {slides.length}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        style={{
          position: "absolute",
          left: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(8px)",
          color: "white",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,107,0,0.7)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={goNext}
        style={{
          position: "absolute",
          right: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(8px)",
          color: "white",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,107,0,0.7)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "8px",
        zIndex: 10,
      }}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            style={{
              width: index === current ? "28px" : "10px",
              height: "10px",
              borderRadius: "5px",
              background: index === current ? "#ff6b00" : "rgba(255,255,255,0.4)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
