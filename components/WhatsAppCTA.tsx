"use client";

import { MessageCircle, Clock, Shield, Headphones } from "lucide-react";

export default function WhatsAppCTA() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const message = "Hi! I'd like to know more about your products and latest offers.";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <section style={{
      padding: "80px 0",
      background: "linear-gradient(135deg, var(--maroon-deep) 0%, var(--maroon) 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative elements */}
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

      {/* Pattern */}
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
          textAlign: "center"
        }}>
          {/* Badge */}
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            background: "rgba(201,168,76,0.2)", 
            border: "1px solid rgba(201,168,76,0.4)", 
            borderRadius: "100px", 
            padding: "8px 20px", 
            marginBottom: "24px" 
          }}>
            <div style={{ 
              width: "8px", 
              height: "8px", 
              borderRadius: "50%", 
              background: "var(--gold)", 
              animation: "pulse 2s infinite" 
            }} />
            <span style={{ 
              fontSize: "12px", 
              color: "var(--gold)", 
              fontWeight: 700, 
              fontFamily: "Outfit, sans-serif", 
              letterSpacing: "1.5px", 
              textTransform: "uppercase" 
            }}>
              24/7 Support Available
            </span>
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.1,
            marginBottom: "16px",
            fontFamily: "Outfit, sans-serif",
            letterSpacing: "-0.03em",
          }}>
            Need Help?
            <br />
            <span style={{ 
              background: "linear-gradient(135deg, var(--gold) 0%, #f0d98f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>Chat With Us!</span>
          </h2>

          {/* Description */}
          <p style={{ 
            color: "rgba(255,255,255,0.85)", 
            fontSize: "17px", 
            lineHeight: 1.7, 
            marginBottom: "40px", 
            fontWeight: 500, 
            maxWidth: "600px",
            margin: "0 auto 40px"
          }}>
            Our friendly team is available on WhatsApp to help you find the perfect product, track your order, or answer any questions.
          </p>

          {/* WhatsApp Button */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              background: "white",
              color: "var(--maroon)",
              padding: "18px 40px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "16px",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
              marginBottom: "56px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
              e.currentTarget.style.background = "var(--gold)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)";
              e.currentTarget.style.background = "white";
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>

          {/* Features Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            maxWidth: "900px",
            margin: "0 auto"
          }} className="whatsapp-features">
            {[
              { icon: MessageCircle, title: "Instant Reply", desc: "Get answers in minutes" },
              { icon: Clock, title: "24/7 Available", desc: "Always here to help" },
              { icon: Shield, title: "Secure Chat", desc: "Your privacy matters" },
              { icon: Headphones, title: "Expert Support", desc: "Friendly assistance" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "16px",
                  padding: "24px 20px",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(201,168,76,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px"
                  }}>
                    <Icon size={24} color="var(--gold)" strokeWidth={2} />
                  </div>
                  <div style={{ 
                    color: "white", 
                    fontWeight: 700, 
                    fontSize: "15px", 
                    fontFamily: "Outfit, sans-serif", 
                    marginBottom: "4px" 
                  }}>
                    {item.title}
                  </div>
                  <div style={{ 
                    color: "rgba(255,255,255,0.7)", 
                    fontSize: "13px", 
                    fontWeight: 500 
                  }}>
                    {item.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 
          0%, 100% { opacity: 1; } 
          50% { opacity: 0.5; } 
        }
        
        @media(max-width: 768px) {
          .whatsapp-features {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media(max-width: 480px) {
          .whatsapp-features {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
