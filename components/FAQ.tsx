"use client";

import { useState, useEffect } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const MOBILE_FAQ_MAX = 5;
const MOBILE_MQ = "(max-width: 768px)";

const faqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We currently accept Cash on Delivery (COD) only. You can pay with cash when your order is delivered to your doorstep. No advance payment or online transaction is required."
  },
  {
    question: "Do you offer free shipping?",
    answer: "Yes! We offer FREE shipping on all orders above Rs. 1,500. For orders below Rs. 1,500, a standard delivery fee of Rs. 200 applies to anywhere in Pakistan."
  },
  {
    question: "How long does delivery take?",
    answer: "Orders are typically delivered within 3-5 business days for major cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad). Remote areas may take 5-7 business days. We dispatch orders within 1-2 business days."
  },
  {
    question: "Can I return or exchange a product?",
    answer: "Yes, we have a 7-day return and exchange policy. If you're not satisfied with your purchase, you can return it within 7 days of delivery for a full refund or exchange. The product must be unused and in original packaging."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is dispatched, you'll receive a WhatsApp message with tracking details. You can also contact our customer support team on WhatsApp for real-time order updates."
  },
  {
    question: "Are the products original and authentic?",
    answer: "Absolutely! We guarantee 100% original and authentic products. All items are sourced directly from authorized distributors and come with proper warranties where applicable."
  },
  {
    question: "Do I need to create an account to place an order?",
    answer: "No, you don't need to create an account. You can checkout as a guest by simply providing your delivery details. However, creating an account helps you track orders and speeds up future checkouts."
  },
  {
    question: "What if I receive a damaged or defective product?",
    answer: "If you receive a damaged or defective product, please contact us immediately via WhatsApp with photos. We'll arrange a free replacement or full refund within 24-48 hours."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const update = () => setIsMobileLayout(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const displayedFaqs = isMobileLayout ? faqs.slice(0, MOBILE_FAQ_MAX) : faqs;

  useEffect(() => {
    if (isMobileLayout && openIndex !== null && openIndex >= MOBILE_FAQ_MAX) {
      setOpenIndex(null);
    }
  }, [isMobileLayout, openIndex]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section style={{
      padding: "80px 0",
      background: "var(--cream)",
      position: "relative"
    }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div className="section-tag" style={{ justifyContent: "center" }}>
            <HelpCircle size={14} color="var(--color-icon)" /> From cart to doorstep
          </div>
          <h2 className="section-title">Everything You Need to Know</h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "clamp(15px, 2.8vw, 17px)",
              maxWidth: "640px",
              margin: "16px auto 0",
              fontWeight: 500,
              lineHeight: 1.65,
              padding: "0 8px",
            }}
          >
            <span
              style={{
                display: "block",
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: "clamp(16px, 2.9vw, 18px)",
                lineHeight: 1.45,
                marginBottom: "12px",
                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Shopping should feel effortless—never a guessing game.
            </span>
            {/* <span style={{ display: "block" }}>
              Tap a topic for crystal-clear answers on{" "}
              <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>cash on delivery</strong>
              ,{" "}
              <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>fast delivery</strong>{" "}
              anywhere in Pakistan,{" "}
              <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>free shipping</strong>{" "}
              when your order qualifies,{" "}
              <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>returns and exchanges</strong>
              , and how we keep every product{" "}
              <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>100% authentic</strong>.
            </span> */}
          </p>
        </div>

        {/* FAQ Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto"
        }} className="faq-grid">
          {displayedFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                style={{
                  background: "var(--white)",
                  border: "2px solid",
                  borderColor: isOpen ? "var(--maroon)" : "var(--cream-mid)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  boxShadow: isOpen ? "var(--shadow-lg)" : "var(--shadow-sm)",
                  height: "fit-content"
                }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  style={{
                    width: "100%",
                    padding: "24px",
                    background: isOpen ? "var(--cream)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "16px",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: isOpen ? "var(--maroon)" : "var(--text-primary)",
                      fontFamily: "Outfit, sans-serif",
                      lineHeight: 1.5,
                      transition: "color 0.2s ease",
                      flex: 1
                    }}
                  >
                    {faq.question}
                  </h3>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: isOpen ? "var(--maroon)" : "var(--cream-dark)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.3s ease",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <ChevronDown size={18} color={isOpen ? "var(--white)" : "var(--gray)"} strokeWidth={2.5} />
                  </div>
                </button>

                <div
                  style={{
                    maxHeight: isOpen ? "400px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.4s ease, padding 0.4s ease",
                    padding: isOpen ? "0 24px 24px 24px" : "0 24px",
                  }}
                >
                  <div
                    style={{
                      paddingTop: "12px",
                      borderTop: isOpen ? "1px solid var(--cream-mid)" : "none",
                    }}
                  >
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "15px",
                        lineHeight: 1.7,
                        fontWeight: 500,
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .faq-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
