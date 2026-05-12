"use client";

import Link from "next/link";

export default function PromoBanner() {
  return (
    <section style={{ 
      background: "linear-gradient(135deg, var(--maroon-deep) 0%, var(--maroon) 100%)", 
      padding: "100px 20px", 
      position: "relative", 
      overflow: "hidden" 
    }} className="promo-banner-section">
      {/* Decorative Elements */}
      <div style={{ 
        position: "absolute", 
        top: "-100px", 
        right: "-100px", 
        width: "400px", 
        height: "400px", 
        background: "radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)", 
        borderRadius: "50%",
        filter: "blur(60px)"
      }} />
      <div style={{ 
        position: "absolute", 
        bottom: "-100px", 
        left: "-100px", 
        width: "350px", 
        height: "350px", 
        background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)", 
        borderRadius: "50%",
        filter: "blur(60px)"
      }} />
      
      {/* Pattern Overlay */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.3
      }} />

      <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ 
          maxWidth: "900px", 
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "60px",
          alignItems: "center"
        }} className="promo-grid">
          {/* Left Content */}
          <div>
            <div style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "8px",
              background: "rgba(255,255,255,0.15)", 
              border: "1px solid rgba(255,255,255,0.2)", 
              borderRadius: "100px", 
              padding: "8px 20px", 
              fontSize: "12px", 
              color: "var(--gold)", 
              fontWeight: 700, 
              marginBottom: "28px", 
              backdropFilter: "blur(10px)", 
              fontFamily: "Outfit, sans-serif",
              letterSpacing: "1.5px",
              textTransform: "uppercase"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              Limited Time Offer
            </div>
            
            <h2 style={{ 
              fontSize: "clamp(2.5rem, 5vw, 4rem)", 
              fontWeight: 900, 
              color: "#ffffff", 
              marginBottom: "20px", 
              fontFamily: "Outfit, sans-serif", 
              letterSpacing: "-0.03em",
              lineHeight: 1.1
            }}>
              Elevate Your
              <br />
              <span style={{ 
                background: "linear-gradient(135deg, var(--gold) 0%, #f0d98f 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>Lifestyle</span>
            </h2>
            
            <p style={{ 
              color: "rgba(255,255,255,0.85)", 
              fontSize: "17px", 
              marginBottom: "40px", 
              lineHeight: 1.7, 
              fontWeight: 500,
              maxWidth: "500px"
            }}>
              Experience premium quality with free nationwide delivery on all orders above Rs. 1,500. Zero advance payment required.
            </p>
            
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }} className="promo-buttons">
              <Link 
                href="/products" 
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "10px", 
                  fontSize: "16px", 
                  padding: "18px 36px", 
                  background: "#ffffff", 
                  color: "var(--maroon)", 
                  border: "none", 
                  borderRadius: "12px", 
                  fontWeight: 700, 
                  fontFamily: "Plus Jakarta Sans, sans-serif", 
                  textDecoration: "none", 
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)", 
                  transition: "all 0.3s ease" 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.3)";
                  e.currentTarget.style.background = "var(--gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
                  e.currentTarget.style.background = "#ffffff";
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Shop Now
              </Link>
              
              <Link 
                href="/products?featured=true" 
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "10px", 
                  fontSize: "16px", 
                  padding: "18px 36px", 
                  background: "rgba(255,255,255,0.1)", 
                  color: "#fff", 
                  border: "2px solid rgba(255,255,255,0.2)", 
                  borderRadius: "12px", 
                  fontWeight: 700, 
                  fontFamily: "Plus Jakarta Sans, sans-serif", 
                  textDecoration: "none", 
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                View Featured
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Stats Card */}
          <div style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "20px",
            padding: "40px 32px",
            minWidth: "240px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
          }} className="promo-stats">
            <div style={{ marginBottom: "32px", textAlign: "center" }}>
              <div style={{ 
                fontSize: "56px", 
                fontWeight: 900, 
                color: "var(--gold)", 
                fontFamily: "Outfit, sans-serif", 
                lineHeight: 1,
                marginBottom: "8px"
              }}>
                FREE
              </div>
              <div style={{ 
                fontSize: "14px", 
                color: "rgba(255,255,255,0.8)", 
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                Shipping
              </div>
              <div style={{ 
                fontSize: "13px", 
                color: "rgba(255,255,255,0.6)", 
                marginTop: "4px"
              }}>
                Orders above Rs. 1,500
              </div>
            </div>
            
            <div style={{ 
              borderTop: "1px solid rgba(255,255,255,0.15)", 
              paddingTop: "28px",
              textAlign: "center"
            }}>
              <div style={{ 
                fontSize: "40px", 
                fontWeight: 900, 
                color: "white", 
                fontFamily: "Outfit, sans-serif", 
                lineHeight: 1,
                marginBottom: "8px"
              }}>
                COD
              </div>
              <div style={{ 
                fontSize: "14px", 
                color: "rgba(255,255,255,0.8)", 
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                Available
              </div>
              <div style={{ 
                fontSize: "13px", 
                color: "rgba(255,255,255,0.6)", 
                marginTop: "4px"
              }}>
                Pay on delivery
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .promo-banner-section {
            padding: 60px 20px !important;
          }

          .promo-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }

          .promo-grid h2 {
            font-size: clamp(2rem, 8vw, 3rem) !important;
          }

          .promo-grid p {
            font-size: 15px !important;
            margin-left: auto;
            margin-right: auto;
          }

          .promo-buttons {
            justify-content: center;
          }

          .promo-buttons a {
            flex: 1;
            min-width: 140px;
            justify-content: center;
          }

          .promo-stats {
            margin: 0 auto;
            max-width: 280px;
          }
        }

        @media (max-width: 480px) {
          .promo-buttons {
            flex-direction: column;
          }

          .promo-buttons a {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
