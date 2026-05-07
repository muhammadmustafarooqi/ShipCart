"use client";

import { MessageSquare, Star, Package, CheckCircle } from "lucide-react";

const testimonials = [
  {
    name: "Ayesha Khan",
    city: "Lahore",
    rating: 5,
    text: "Absolutely amazing quality! The kitchen gadgets I ordered were exactly as described. Fast delivery and the packaging was superb. Will definitely order again!",
    product: "Rechargeable Coffee Beater",
    avatar: "AK",
    color: "#3b82f6",
  },
  {
    name: "Muhammad Ali",
    city: "Karachi",
    rating: 5,
    text: "Best online store in Pakistan! I was skeptical about online shopping, but the cash on delivery option and the authentic products changed my mind completely.",
    product: "Mini Jet Fan",
    avatar: "MA",
    color: "#10b981",
  },
  {
    name: "Fatima Zahra",
    city: "Islamabad",
    rating: 5,
    text: "The product quality is top-notch. Received my order in 3 days to Islamabad. The team is very responsive on WhatsApp. Highly recommended!",
    product: "Silicone Ice Roller",
    avatar: "FZ",
    color: "#f59e0b",
  },
  {
    name: "Hassan Raza",
    city: "Faisalabad",
    rating: 5,
    text: "I've ordered 5 times now and every single time the experience has been flawless. Great products, great prices, and excellent customer service.",
    product: "Air Humidifier USB",
    avatar: "HR",
    color: "#8b5cf6",
  },
  {
    name: "Sana Malik",
    city: "Rawalpindi",
    rating: 5,
    text: "The IPL hair removal device works exactly as promised. Saved so much money compared to salon visits. Very happy with my purchase!",
    product: "IPL Laser Hair Removal",
    avatar: "SM",
    color: "#ec4899",
  },
  {
    name: "Bilal Ahmed",
    city: "Multan",
    rating: 5,
    text: "Ordered a massage device for my elderly father. The delivery was on time and the product quality exceeded my expectations. 10/10!",
    product: "Shoulder & Back Massager",
    avatar: "BA",
    color: "#14b8a6",
  },
];

export default function Testimonials() {
  // Duplicate array to create a seamless infinite scroll effect
  const scrollItems = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section style={{ padding: "100px 0", background: "var(--bg-primary)", overflow: "hidden" }}>
      <div className="page-container">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div className="section-tag" style={{ justifyContent: "center" }}>
            <MessageSquare size={14} color="var(--color-icon)" /> Customer Stories
          </div>
          <h2 className="section-title">Loved by Thousands</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "500px", margin: "12px auto 0", fontWeight: 500 }}>
            Real reviews from our verified buyers across Pakistan.
          </p>
        </div>
      </div>

      {/* Infinite Scrolling Marquee */}
      <div style={{ width: "100%", position: "relative", padding: "20px 0" }}>
        {/* Left/Right fading edges */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "15vw", background: "linear-gradient(to right, var(--bg-primary), transparent)", zIndex: 10, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "15vw", background: "linear-gradient(to left, var(--bg-primary), transparent)", zIndex: 10, pointerEvents: "none" }} />

        <div className="testimonial-track">
          {scrollItems.map((t, index) => (
            <div key={index} className="testimonial-dark-card">
              {/* Quote Icon Background */}
              <div style={{ position: "absolute", top: "20px", right: "20px", fontSize: "100px", color: "rgba(255,255,255,0.03)", fontFamily: "Georgia, serif", lineHeight: 1, pointerEvents: "none" }}>
                "
              </div>

              {/* Stars */}
              <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} color="#fbbf24" fill="#fbbf24" />
                ))}
              </div>

              {/* Review Text */}
              <p style={{ color: "#e2e8f0", fontSize: "15px", lineHeight: 1.7, marginBottom: "24px", fontWeight: 500, flex: 1, position: "relative", zIndex: 1 }}>
                "{t.text}"
              </p>

              {/* Product Tag */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.1)", color: "#f8fafc", borderRadius: "100px", padding: "6px 12px", fontSize: "12px", fontWeight: 600, marginBottom: "24px", width: "fit-content" }}>
                <Package size={14} /> {t.product}
              </div>

              {/* Author Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  background: `linear-gradient(135deg, ${t.color}, #1e293b)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: 800, fontSize: "15px", fontFamily: "Outfit, sans-serif"
                }}>
                  {t.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "15px", color: "white", fontFamily: "Outfit, sans-serif" }}>{t.name}</div>
                  <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 500 }}>{t.city}</div>
                </div>
                <div style={{ color: "#10b981", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", background: "rgba(16,185,129,0.1)", padding: "4px 8px", borderRadius: "6px" }}>
                  <CheckCircle size={12} color="currentColor" /> Verified
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-33.333333%)); } /* Scroll one full original set */
        }

        .testimonial-track {
          display: flex;
          width: max-content;
          gap: 24px;
          padding: 0 24px;
          animation: scroll-left 40s linear infinite;
        }

        .testimonial-track:hover {
          animation-play-state: paused;
        }

        .testimonial-dark-card {
          width: 380px;
          flex-shrink: 0;
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(15,23,42,0.1);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s;
        }

        .testimonial-dark-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(15,23,42,0.2);
          border-color: rgba(255,255,255,0.2);
        }

        @media (max-width: 768px) {
          .testimonial-dark-card {
            width: 320px;
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
}
