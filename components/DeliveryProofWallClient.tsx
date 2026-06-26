"use client";

import { useEffect, useRef } from "react";
import { Star, CheckCircle, Package, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

export type Testimonial = {
  _id: string;
  name: string;
  city?: string;
  rating: number;
  text: string;
  product?: string;
  productImage?: string;
  createdAt: string;
};

export default function DeliveryProofWallClient({ testimonials }: { testimonials: Testimonial[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    
    const cards = document.querySelectorAll(".proof-card-wrapper");
    cards.forEach((card) => observer.observe(card));
    
    return () => observer.disconnect();
  }, []);

  // Use dummy data if none exists yet, so the UI is visible for review
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : [
    {
      _id: "1",
      name: "Ahmed Ali",
      city: "Lahore, Pakistan",
      rating: 5,
      text: "The delivery was surprisingly fast! I ordered a blender and it arrived the very next day. The packaging was secure, and I paid cash on delivery without any hassle.",
      product: "Smart Pro Blender",
      createdAt: new Date().toISOString()
    },
    {
      _id: "2",
      name: "Sara Khan",
      city: "Karachi, Pakistan",
      rating: 5,
      text: "I was skeptical about ordering electronics online, but the COD option gave me peace of mind. The rider even waited while I checked the product!",
      product: "Wireless Earbuds",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
    },
    {
      _id: "3",
      name: "Usman Tariq",
      city: "Islamabad, Pakistan",
      rating: 4,
      text: "The premium feel of the products and the seamless cash on delivery option make this my go-to store. Receipt and packaging were top-notch.",
      product: "Mechanical Keyboard",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      _id: "4",
      name: "Ayesha Malik",
      city: "Faisalabad, Pakistan",
      rating: 5,
      text: "Finding aesthetic and high-quality home decor is usually tough. The delivery was verified with an OTP and I paid right at my doorstep.",
      product: "Ceramic Vase Set",
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
    }
  ];

  return (
    <section className="proof-wall-section">
      <div className="proof-wall-bg-pattern"></div>
      
      <div className="page-container relative z-10">
        <div className="proof-header">
          <h2 className="proof-title">Real Deliveries.<br/>Real Customers.</h2>
          <p className="proof-subtitle">See what our verified customers are saying</p>
          <div className="proof-stats">
            <span className="stats-number">12,000+</span>
            <span className="stats-label">Verified Deliveries</span>
          </div>
        </div>
      </div>
      
      <div className="proof-track-container" ref={containerRef}>
        <div className="proof-track">
          {/* Spacer to align first item */}
          <div className="proof-spacer" />
          
          {displayTestimonials.map((t, index) => {
            // Calculate a pseudo-random rotation between -3 and +3 degrees
            const rotation = ((index * 7) % 7) - 3; 
            // Calculate a staggered Y offset
            const yOffset = index % 2 === 0 ? "15px" : "-15px";
            
            return (
              <div 
                key={t._id} 
                className="proof-card-wrapper" 
                style={{ 
                  '--card-rotation': `${rotation}deg`,
                  '--card-y': yOffset,
                  '--anim-delay': `${index * 150}ms`
                } as React.CSSProperties}
              >
                <div className="proof-card">
                  
                  <div className="receipt-content">
                    {/* The verified rubber stamp */}
                    <div className="rubber-stamp">
                      <CheckCircle size={16} strokeWidth={3} /> VERIFIED DELIVERY
                    </div>
                    
                    <div className="receipt-header">
                      <div className="receipt-date">
                        <Calendar size={14} /> 
                        {format(new Date(t.createdAt), "MMM dd, yyyy")}
                      </div>
                      <div className="receipt-barcode"></div>
                    </div>
                    
                    <div className="receipt-customer">
                      <div className="customer-name">{t.name}</div>
                      <div className="customer-location">
                        <MapPin size={12} /> {t.city || "Pakistan"}
                      </div>
                    </div>
                    
                    <div className="receipt-divider"></div>
                    
                    <div className="receipt-quote">
                      "{t.text}"
                    </div>
                    
                    <div className="receipt-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < t.rating ? "#FF6102" : "none"} 
                          color={i < t.rating ? "#FF6102" : "#CBD5E1"}
                        />
                      ))}
                    </div>
                    
                    <div className="receipt-divider dashed"></div>
                    
                    {t.product && (
                      <div className="receipt-product">
                        <div className="product-icon-wrap">
                          <Package size={16} color="#64748B" />
                        </div>
                        <div className="product-details">
                          <div className="product-label">ITEM DELIVERED</div>
                          <div className="product-name">{t.product}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                </div>
              </div>
            );
          })}
          
          <div className="proof-spacer" />
        </div>
      </div>
      
      <style>{`
        .proof-wall-section {
          position: relative;
          padding: 100px 0;
          background: var(--navy);
          overflow: hidden;
        }

        .proof-wall-bg-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background-image: 
            linear-gradient(#fff 1.5px, transparent 1.5px),
            linear-gradient(90deg, #fff 1.5px, transparent 1.5px);
          background-size: 32px 32px;
          background-position: center;
        }

        .proof-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .proof-title {
          font-family: var(--font-outfit), sans-serif;
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 900;
          color: var(--white);
          line-height: 1.1;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .proof-subtitle {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 32px;
        }

        .proof-stats {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 97, 2, 0.1);
          border: 1px solid rgba(255, 97, 2, 0.3);
          border-radius: 12px;
          padding: 16px 32px;
        }

        .stats-number {
          font-family: var(--font-outfit), sans-serif;
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--orange);
          line-height: 1;
          margin-bottom: 4px;
        }

        .stats-label {
          font-family: var(--font-jakarta), sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .proof-track-container {
          width: 100%;
          overflow: hidden;
        }

        .proof-track {
          display: flex;
          gap: 32px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: 40px 0 80px 0;
          scrollbar-width: none;
          align-items: center;
        }

        .proof-track::-webkit-scrollbar {
          display: none;
        }

        .proof-spacer {
          flex: 0 0 calc(50vw - 400px);
          min-width: 24px;
        }

        .proof-card-wrapper {
          flex: 0 0 340px;
          scroll-snap-align: center;
          /* Animation state (hidden initially) */
          opacity: 0;
          transform: translateY(calc(var(--card-y) + 40px)) rotate(var(--card-rotation));
          filter: drop-shadow(0 15px 30px rgba(0,0,0,0.4));
        }

        .proof-card-wrapper.animate-in {
          opacity: 1;
          transform: translateY(var(--card-y)) rotate(var(--card-rotation));
          transition: opacity 0.8s ease var(--anim-delay), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) var(--anim-delay), filter 0.4s ease;
        }

        .proof-card-wrapper.animate-in:hover {
          transform: translateY(calc(var(--card-y) - 12px)) rotate(0deg);
          filter: drop-shadow(0 25px 40px rgba(0,0,0,0.6));
          z-index: 10;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
        }

        .proof-card {
          background: #FAFAFA;
          color: var(--navy);
          /* Receipt zigzag using clip-path */
          clip-path: polygon(
            0% 5px, 2.5% 0px, 5% 5px, 7.5% 0px, 10% 5px, 12.5% 0px, 15% 5px, 17.5% 0px, 20% 5px, 
            22.5% 0px, 25% 5px, 27.5% 0px, 30% 5px, 32.5% 0px, 35% 5px, 37.5% 0px, 40% 5px, 
            42.5% 0px, 45% 5px, 47.5% 0px, 50% 5px, 52.5% 0px, 55% 5px, 57.5% 0px, 60% 5px, 
            62.5% 0px, 65% 5px, 67.5% 0px, 70% 5px, 72.5% 0px, 75% 5px, 77.5% 0px, 80% 5px, 
            82.5% 0px, 85% 5px, 87.5% 0px, 90% 5px, 92.5% 0px, 95% 5px, 97.5% 0px, 100% 5px, 
            100% calc(100% - 5px), 97.5% 100%, 95% calc(100% - 5px), 92.5% 100%, 90% calc(100% - 5px), 87.5% 100%, 
            85% calc(100% - 5px), 82.5% 100%, 80% calc(100% - 5px), 77.5% 100%, 75% calc(100% - 5px), 72.5% 100%, 
            70% calc(100% - 5px), 67.5% 100%, 65% calc(100% - 5px), 62.5% 100%, 60% calc(100% - 5px), 57.5% 100%, 
            55% calc(100% - 5px), 52.5% 100%, 50% calc(100% - 5px), 47.5% 100%, 45% calc(100% - 5px), 42.5% 100%, 
            40% calc(100% - 5px), 37.5% 100%, 35% calc(100% - 5px), 32.5% 100%, 30% calc(100% - 5px), 27.5% 100%, 
            25% calc(100% - 5px), 22.5% 100%, 20% calc(100% - 5px), 17.5% 100%, 15% calc(100% - 5px), 12.5% 100%, 
            10% calc(100% - 5px), 7.5% 100%, 5% calc(100% - 5px), 2.5% 100%, 0% calc(100% - 5px)
          );
          position: relative;
          padding: 16px 0; /* Space for the jagged edges */
        }

        .receipt-content {
          padding: 24px;
          background: #FAFAFA;
          background-image: radial-gradient(#e5e5e5 1px, transparent 1px);
          background-size: 16px 16px;
          position: relative;
          margin: 0 12px; /* Pull in from edges */
        }

        /* Pure white paper over the dotted background to make text readable */
        .receipt-content::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(250, 250, 250, 0.7);
          z-index: 0;
        }
        
        /* Ensure content stays above the white fade */
        .receipt-content > * {
          position: relative;
          z-index: 1;
        }

        .rubber-stamp {
          position: absolute;
          top: -24px;
          right: -16px;
          color: var(--orange);
          border: 3px solid var(--orange);
          font-family: "Outfit", sans-serif;
          font-weight: 900;
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
          transform: rotate(15deg) scale(0);
          opacity: 0;
          z-index: 10;
          letter-spacing: 1px;
          background: rgba(250, 250, 250, 0.95);
          box-shadow: 0 4px 10px rgba(255, 97, 2, 0.15);
        }

        .proof-card-wrapper.animate-in .rubber-stamp {
          animation: stampIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: calc(var(--anim-delay) + 500ms);
        }

        @keyframes stampIn {
          0% { transform: rotate(25deg) scale(1.5); opacity: 0; }
          100% { transform: rotate(15deg) scale(1); opacity: 0.95; }
        }

        .receipt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #E2E8F0;
        }

        .receipt-date {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: "Plus Jakarta Sans", monospace;
          font-size: 11px;
          color: #64748B;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .receipt-barcode {
          width: 70px;
          height: 18px;
          background-image: repeating-linear-gradient(
            to right,
            var(--navy),
            var(--navy) 2px,
            transparent 2px,
            transparent 4px,
            var(--navy) 4px,
            var(--navy) 5px,
            transparent 5px,
            transparent 7px
          );
          opacity: 0.8;
        }

        .receipt-customer {
          margin-bottom: 20px;
        }

        .customer-name {
          font-family: "Outfit", sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: var(--navy);
          line-height: 1.2;
        }

        .customer-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #64748B;
          margin-top: 4px;
          font-weight: 600;
        }

        .receipt-quote {
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--navy-deep);
          font-weight: 500;
          font-style: italic;
          margin-bottom: 16px;
        }

        .receipt-rating {
          display: flex;
          gap: 4px;
          margin-bottom: 20px;
        }

        .receipt-divider {
          height: 1px;
          background: #E2E8F0;
          margin: 16px 0;
        }
        
        .receipt-divider.dashed {
          background: none;
          border-top: 1.5px dashed #CBD5E1;
        }

        .receipt-product {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(226, 232, 240, 0.4);
          padding: 10px;
          border-radius: 8px;
        }

        .product-icon-wrap {
          width: 32px;
          height: 32px;
          background: var(--white);
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .product-label {
          font-size: 9px;
          font-weight: 800;
          color: #94A3B8;
          letter-spacing: 0.5px;
        }

        .product-name {
          font-size: 12px;
          font-weight: 700;
          color: var(--navy);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 190px;
        }
        
        @media (max-width: 768px) {
          .proof-wall-section {
            padding: 60px 0;
          }
          
          .proof-track {
            padding: 20px 0 40px 0;
          }
          
          .proof-card-wrapper {
            flex: 0 0 300px;
            /* Less stagger on mobile */
            transform: translateY(40px) rotate(0deg) !important;
          }
          
          .proof-card-wrapper.animate-in {
            transform: translateY(0) rotate(0deg) !important;
          }
          
          .proof-spacer {
            flex: 0 0 12px;
            min-width: 12px;
          }
        }
      `}</style>
    </section>
  );
}
