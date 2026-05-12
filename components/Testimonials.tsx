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
  // Duplicate array multiple times for truly infinite scroll
  const allScrollItems = [...testimonials, ...testimonials, ...testimonials, ...testimonials];
  
  // Split into two rows for alternating scroll
  const row1 = allScrollItems.filter((_, i) => i % 2 === 0);
  const row2 = allScrollItems.filter((_, i) => i % 2 === 1);

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

      {/* Dual Scrolling Marquee */}
      <div style={{ width: "100%", overflow: "hidden", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Row 1 - Scrolling Left */}
        <div style={{ width: "100%", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "15vw", background: "linear-gradient(to right, var(--bg-primary), transparent)", zIndex: 10, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "15vw", background: "linear-gradient(to left, var(--bg-primary), transparent)", zIndex: 10, pointerEvents: "none" }} />

          <div className="testimonial-track-left">
            {row1.map((t, index) => (
              <div key={index} className="testimonial-dark-card">
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  background: `linear-gradient(135deg, ${t.color}, #2a0f1a)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#FEF5E7", fontWeight: 900, fontSize: "18px", fontFamily: "Outfit, sans-serif",
                  flexShrink: 0
                }}>
                  {t.avatar}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ fontWeight: 800, fontSize: "15px", color: "#FEF5E7", fontFamily: "Outfit, sans-serif" }}>{t.name}</div>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} color="#FEF5E7" fill="#FEF5E7" />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: "#FEF5E7", fontSize: "14px", lineHeight: 1.5, fontWeight: 500, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {t.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Scrolling Right */}
        <div style={{ width: "100%", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "15vw", background: "linear-gradient(to right, var(--bg-primary), transparent)", zIndex: 10, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "15vw", background: "linear-gradient(to left, var(--bg-primary), transparent)", zIndex: 10, pointerEvents: "none" }} />

          <div className="testimonial-track-right">
            {row2.map((t, index) => (
              <div key={index} className="testimonial-dark-card">
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  background: `linear-gradient(135deg, ${t.color}, #2a0f1a)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#FEF5E7", fontWeight: 900, fontSize: "18px", fontFamily: "Outfit, sans-serif",
                  flexShrink: 0
                }}>
                  {t.avatar}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ fontWeight: 800, fontSize: "15px", color: "#FEF5E7", fontFamily: "Outfit, sans-serif" }}>{t.name}</div>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} color="#FEF5E7" fill="#FEF5E7" />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: "#FEF5E7", fontSize: "14px", lineHeight: 1.5, fontWeight: 500, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {t.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-25%)); }
        }

    @keyframes scroll-right {
  0% { transform: translateX(-25%); }
  100% { transform: translateX(0); }
}

        .testimonial-track-left {
          display: flex;
          width: max-content;
          gap: 24px;
          padding: 0 24px;
          animation: scroll-left 60s linear infinite;
        }

        .testimonial-track-left:hover {
          animation-play-state: paused;
        }

        .testimonial-track-right {
          display: flex;
          width: max-content;
          gap: 24px;
          padding: 0 24px;
          animation: scroll-right 60s linear infinite;
        }

        .testimonial-track-right:hover {
          animation-play-state: paused;
        }

        .testimonial-dark-card {
          width: 420px;
          flex-shrink: 0;
          background: #7E1A35;
          border: none;
          border-radius: 100px;
          padding: 20px 24px;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 12px 32px rgba(126,26,53,0.15);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s;
        }

        .testimonial-dark-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 48px rgba(126,26,53,0.25);
        }

        @media (max-width: 768px) {
          .testimonial-dark-card {
            width: 380px;
            min-width: 380px;
            padding: 18px 22px;
            border-radius: 100px;
          }
          
          .testimonial-dark-card > div:first-child {
            width: 52px !important;
            height: 52px !important;
            font-size: 17px !important;
          }
          
          .testimonial-dark-card p {
            font-size: 13px !important;
          }
        }
      `}</style>
    </section>
  );
}
