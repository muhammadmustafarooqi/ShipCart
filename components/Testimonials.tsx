"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageSquare, Star } from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  rating: number;
  text: string;
  product: string;
  image: string;
  avatarColor: string;
  isActive: boolean;
  order: number;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setTestimonials(data);
          }
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading || testimonials.length === 0) return null;
  
  const allScrollItems = [...testimonials, ...testimonials, ...testimonials, ...testimonials];
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

      <div style={{ width: "100%", overflow: "hidden", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ width: "100%", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "15vw", background: "linear-gradient(to right, var(--bg-primary), transparent)", zIndex: 10, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "15vw", background: "linear-gradient(to left, var(--bg-primary), transparent)", zIndex: 10, pointerEvents: "none" }} />

          <div className="testimonial-track-left">
            {row1.map((t, index) => (
              <div key={index} className="testimonial-dark-card">
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  background: t.image ? "transparent" : `linear-gradient(135deg, ${t.avatarColor}, #2a0f1a)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#FEF5E7", fontWeight: 900, fontSize: "18px", fontFamily: "Outfit, sans-serif",
                  flexShrink: 0, overflow: "hidden", position: "relative"
                }}>
                  {t.image ? (
                    <Image src={t.image} alt={t.name} fill style={{ objectFit: "cover" }} unoptimized />
                  ) : (
                    getInitials(t.name)
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ fontWeight: 800, fontSize: "15px", color: "#FEF5E7", fontFamily: "Outfit, sans-serif" }}>{t.name}</div>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {Array.from({ length: t.rating }).map((_, i) => (
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

        <div style={{ width: "100%", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "15vw", background: "linear-gradient(to right, var(--bg-primary), transparent)", zIndex: 10, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "15vw", background: "linear-gradient(to left, var(--bg-primary), transparent)", zIndex: 10, pointerEvents: "none" }} />

          <div className="testimonial-track-right">
            {row2.map((t, index) => (
              <div key={index} className="testimonial-dark-card">
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  background: t.image ? "transparent" : `linear-gradient(135deg, ${t.avatarColor}, #2a0f1a)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#FEF5E7", fontWeight: 900, fontSize: "18px", fontFamily: "Outfit, sans-serif",
                  flexShrink: 0, overflow: "hidden", position: "relative"
                }}>
                  {t.image ? (
                    <Image src={t.image} alt={t.name} fill style={{ objectFit: "cover" }} unoptimized />
                  ) : (
                    getInitials(t.name)
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ fontWeight: 800, fontSize: "15px", color: "#FEF5E7", fontFamily: "Outfit, sans-serif" }}>{t.name}</div>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {Array.from({ length: t.rating }).map((_, i) => (
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
            width: min(380px, calc(100vw - 40px));
            min-width: min(380px, calc(100vw - 40px));
            max-width: calc(100vw - 40px);
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
