"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  _id: string;
  title?: string;
  subtitle?: string;
  image: string;
  link: string;
}

const DEFAULT_BANNERS: Banner[] = [
  {
    _id: "1",
    title: "MEGA SUMMER SALE 2026",
    subtitle: "Up to 50% Off on Premium Home & Kitchen Accessories",
    image: "/banner1.png",
    link: "/products?category=kitchen-cooking"
  },
  {
    _id: "2",
    title: "PREMIUM BEAUTY CARE",
    subtitle: "Discover Your Natural Glow With Our Latest Tech Gadgets",
    image: "/banner2.png",
    link: "/products?category=personal-care-beauty"
  },
  {
    _id: "3",
    title: "SMART HOME GADGETS",
    subtitle: "Revolutionize Your Daily Life with Smart Technology",
    image: "/banner3.png",
    link: "/products?category=electronics-gadgets"
  },
];

export default function HeroSlider({ banners }: { banners: Banner[] }) {
  const slides = banners && banners.length > 0 ? banners : DEFAULT_BANNERS;
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 6000;
  const INTERVAL_MS = 50;
  const steps = SLIDE_DURATION / INTERVAL_MS;

  const nextSlide = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 100 / steps;
      });
    }, INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, isPaused, nextSlide, steps]);

  const goTo = (i: number) => {
    setCurrent(i);
    setProgress(0);
  };

  return (
    <section 
      className="hs-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hs-track">
        {slides.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={slide._id || index}
              className={`hs-slide${isActive ? " hs-slide--active" : ""}`}
            >
              {/* Image Background */}
              <img
                src={slide.image}
                alt={slide.title || "Banner"}
                className="hs-img"
                draggable={false}
              />
              
              {/* Gradient overlay for readability */}
              <div className="hs-overlay" />

              {/* Dynamic text and CTA button overlays */}
              <div className="hs-content-container">
                <div className="hs-content">
                  {slide.subtitle && (
                    <span className="hs-badge">
                      {slide.subtitle}
                    </span>
                  )}
                  {slide.title && (
                    <h1 className="hs-title">
                      {slide.title}
                    </h1>
                  )}
                  <div className="hs-actions">
                    <Link 
                      href={slide.link || "/products"} 
                      className="btn-primary hs-btn"
                    >
                      Shop Collection
                    </Link>
                    <Link 
                      href="/products" 
                      className="btn-secondary hs-btn hs-btn--secondary"
                    >
                      Browse All
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Prev & Next arrows */}
        <button
          className="hs-nav-btn hs-nav-btn--prev"
          onClick={prevSlide}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="hs-nav-btn hs-nav-btn--next"
          onClick={nextSlide}
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dynamic Dots Indicator */}
        <div className="hs-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hs-dot${i === current ? " hs-dot--active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === current && (
                <span className="hs-dot-fill" style={{ width: `${progress}%` }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}