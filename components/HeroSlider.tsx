"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface Banner { _id: string; title: string; subtitle: string; image: string; link: string; }

const DEFAULT_BANNERS: Banner[] = [
  { 
    _id: "1", 
    title: "Next-Gen\nSmart Devices", 
    subtitle: "Elevate your lifestyle with our ultra-premium collection of intelligent tech.", 
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1200&auto=format&fit=crop", 
    link: "/products" 
  },
  { 
    _id: "2", 
    title: "Pro Audio\nExperience", 
    subtitle: "Immerse yourself in studio-quality sound with our flagship acoustics.", 
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1200&auto=format&fit=crop", 
    link: "/products?category=electronics-gadgets" 
  },
  { 
    _id: "3", 
    title: "Advanced\nFlight Tech", 
    subtitle: "Capture the world from above with state-of-the-art cinematic drones.", 
    image: "https://images.unsplash.com/photo-1507644837895-467ce4af94e6?q=80&w=1200&auto=format&fit=crop", 
    link: "/products?category=electronics-gadgets" 
  },
];

export default function HeroSlider({ banners }: { banners: Banner[] }) {
  const slides = banners.length > 0 ? banners : DEFAULT_BANNERS;
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const interval = 50; 
    const slideDuration = 7000; 
    const steps = slideDuration / interval;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrent((c) => (c + 1) % slides.length);
          return 0;
        }
        return prev + (100 / steps);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [current, slides.length]);

  const goTo = (i: number) => {
    setCurrent(i);
    setProgress(0);
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        
        {/* Animated Tech Grid Background */}
        <div className="hero-grid-bg" />

        {slides.map((slide, index) => {
          const isActive = index === current;
          const titleLines = slide.title.split("\n");

          return (
            <div 
              key={slide._id}
              style={{
                position: "absolute",
                inset: 0,
                opacity: isActive ? 1 : 0,
                visibility: isActive ? "visible" : "hidden",
                transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1), visibility 1s",
                display: "flex",
                alignItems: "center"
              }}
            >
              {/* Product Image Side (Right) */}
              <div style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "65%",
                height: "100%",
                backgroundImage: `url(${slide.image || DEFAULT_BANNERS[index % DEFAULT_BANNERS.length].image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.85,
                transform: isActive ? "scale(1)" : "scale(1.1)",
                transition: "transform 8s cubic-bezier(0.16, 1, 0.3, 1)",
                maskImage: "linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)"
              }} className="hero-image" />

              {/* Glow Behind Text */}
              <div className="hero-glow" aria-hidden />

              {/* Content Area (Left) */}
              <div style={{ 
                position: "relative", 
                zIndex: 10,
                paddingLeft: "clamp(32px, 8vw, 100px)",
                width: "100%",
                maxWidth: "800px",
                transform: isActive ? "translateX(0)" : "translateX(-40px)",
                transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s"
              }} className="hero-content-wrapper">
                {/* Minimalist Card */}
                <div style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  borderRadius: "24px",
                  padding: "56px 48px",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.12)"
                }} className="hero-card">
                  <div style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "8px", 
                    background: "var(--color-brand-dim)", 
                    borderRadius: "100px", 
                    padding: "8px 16px", 
                    fontSize: "13px", 
                    color: "var(--color-brand)", 
                    fontWeight: 700, 
                    marginBottom: "32px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontFamily: "Outfit, sans-serif"
                  }}>
                    <Sparkles size={16} color="var(--color-icon)" fill="var(--color-icon)" /> Premium Selection
                  </div>
                  
                  <h1 style={{ 
                    fontSize: "clamp(3rem, 5vw, 4.5rem)", 
                    fontWeight: 900, 
                    color: "var(--text-primary)", 
                    lineHeight: 1.05, 
                    marginBottom: "24px",
                    letterSpacing: "-0.04em",
                    fontFamily: "Outfit, sans-serif"
                  }}>
                    {titleLines[0]}
                    {titleLines[1] && (
                      <><br /><span style={{
                        background: "var(--gradient-brand)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                      }}>{titleLines[1]}</span></>
                    )}
                  </h1>
                  
                  <p style={{ 
                    fontSize: "18px", 
                    color: "var(--text-secondary)", 
                    marginBottom: "48px", 
                    lineHeight: 1.6,
                    maxWidth: "500px",
                    fontWeight: 500
                  }}>
                    {slide.subtitle}
                  </p>
                  
                  <Link 
                    href={slide.link} 
                    className="hero-btn"
                  >
                    Discover Now <ArrowRight size={20} color="currentColor" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Custom Progress Navigation */}
        <div style={{
          position: "absolute",
          bottom: "48px",
          right: "clamp(32px, 8vw, 100px)",
          display: "flex",
          gap: "12px",
          zIndex: 20
        }} className="hero-progress">
          {slides.map((_, i) => (
            <div 
              key={i} 
              onClick={() => goTo(i)}
              style={{
                width: i === current ? "80px" : "12px",
                height: "6px",
                background: "rgba(255, 255, 255, 0.3)",
                borderRadius: "3px",
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: i === current ? `${progress}%` : (i < current ? "100%" : "0%"),
                background: "#ffffff",
                boxShadow: i === current ? "0 0 12px rgba(255,255,255,0.8)" : "none",
                transition: i === current ? "none" : "width 0.3s ease"
              }} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hero-section {
          background: var(--bg-primary);
          padding: 40px 20px 20px;
          display: flex;
          justify-content: center;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }

        .hero-container {
          max-width: 1400px;
          width: 100%;
          height: 640px;
          border-radius: var(--radius-xl);
          position: relative;
          overflow: hidden;
          border: 1px solid var(--border-default);
          box-shadow: var(--shadow-xl);
          background: var(--maroon);
          box-sizing: border-box;
        }

        .hero-glow {
          position: absolute;
          left: -10%;
          top: 10%;
          width: min(800px, 120vw);
          height: min(800px, 120vw);
          background: radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 60%);
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        .hero-grid-bg {
          position: absolute;
          inset: 0;
          background-size: 60px 60px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          mask-image: radial-gradient(circle at right, black 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at right, black 30%, transparent 80%);
          z-index: 0;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: var(--text-primary);
          color: #ffffff;
          font-weight: 700;
          font-size: 16px;
          padding: 18px 40px;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.2);
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        .hero-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 32px rgba(15, 23, 42, 0.3);
          background: var(--color-brand);
        }

        .hero-btn:active {
          transform: translateY(0) scale(0.98);
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 16px 12px 12px !important;
          }

          .hero-container {
            height: 500px !important;
            border-radius: 16px !important;
          }

          .hero-glow {
            display: none;
          }

          .hero-image {
            width: 100% !important;
            opacity: 0.3 !important;
            mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%) !important;
            -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%) !important;
          }

          .hero-content-wrapper {
            padding-left: 16px !important;
            padding-right: 16px !important;
            max-width: 100% !important;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            height: 100%;
          }

          .hero-card {
            padding: 32px 24px !important;
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border-radius: 20px !important;
          }

          .hero-card > div:first-child {
            padding: 6px 14px !important;
            font-size: 11px !important;
            margin-bottom: 20px !important;
          }

          .hero-card h1 {
            font-size: clamp(1.75rem, 8vw, 2.5rem) !important;
            margin-bottom: 16px !important;
            line-height: 1.1 !important;
          }

          .hero-card p {
            font-size: 14px !important;
            margin-bottom: 28px !important;
            line-height: 1.5 !important;
          }

          .hero-btn {
            padding: 14px 28px !important;
            font-size: 14px !important;
            width: 100%;
            justify-content: center;
          }

          .hero-progress {
            bottom: 24px !important;
            right: 20px !important;
            left: 20px !important;
            justify-content: center;
          }

          .hero-grid-bg { 
            background-size: 30px 30px; 
          }
        }

        @media (max-width: 480px) {
          .hero-container {
            height: 450px !important;
          }

          .hero-card {
            padding: 28px 20px !important;
          }

          .hero-card h1 {
            font-size: clamp(1.5rem, 7vw, 2rem) !important;
          }

          .hero-card p {
            font-size: 13px !important;
            margin-bottom: 24px !important;
          }

          .hero-btn {
            padding: 12px 24px !important;
            font-size: 13px !important;
          }
        }
      `}</style>
    </section>
  );
}
