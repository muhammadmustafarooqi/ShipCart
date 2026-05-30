"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Banner {
  _id: string;
  title?: string;
  subtitle?: string;
  image: string;
  link: string;
}

const DEFAULT_BANNERS: Banner[] = [
  { _id: "1", image: "/banner1.png", link: "/products" },
  { _id: "2", image: "/banner2.png", link: "/products" },
  { _id: "3", image: "/banner3.png", link: "/products?category=kitchen-cooking" },
];

export default function HeroSlider({ banners }: { banners: Banner[] }) {
  const slides = banners && banners.length > 0 ? banners : DEFAULT_BANNERS;
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const INTERVAL_MS = 50;
    const SLIDE_DURATION = 5000;
    const steps = SLIDE_DURATION / INTERVAL_MS;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrent((c) => (c + 1) % slides.length);
          return 0;
        }
        return prev + 100 / steps;
      });
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  const goTo = (i: number) => {
    setCurrent(i);
    setProgress(0);
  };

  return (
    <section className="hs-section">
      <div className="hs-track">
        {slides.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={slide._id || index}
              className={`hs-slide${isActive ? " hs-slide--active" : ""}`}
            >
              <Link
                href={slide.link || "/products"}
                className="hs-link"
                aria-label={slide.title || "Shop now"}
              >
                <img
                  src={slide.image}
                  alt={slide.title || "Banner"}
                  className="hs-img"
                  draggable={false}
                />
              </Link>
            </div>
          );
        })}

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