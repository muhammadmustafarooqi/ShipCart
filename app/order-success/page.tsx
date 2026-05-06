"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Package, Phone, Home, MessageCircle } from "lucide-react";

interface Order {
  orderId: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: string;
  createdAt: string;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((r) => r.json())
        .then((d) => setOrder(d.order))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

  const generateWhatsAppMessage = () => {
    if (!order) return "#";
    const itemsList = order.items.map((i) => `• ${i.name} x${i.quantity}`).join("\n");
    const msg = `🛍️ New Order #${order.orderId}\n\n👤 ${order.customerName}\n📱 ${order.phone}\n📍 ${order.city}\n🏠 ${order.address}\n\n📦 Items:\n${itemsList}\n\n✅ Total: Rs. ${order.total.toLocaleString()}\n💰 Payment: Cash on Delivery`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
        <div style={{ maxWidth: "600px", width: "100%", textAlign: "center" }}>
          {/* Success Animation */}
          <div style={{
            width: "120px",
            height: "120px",
            background: "var(--color-success)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
            boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)",
            animation: "bounce 0.6s ease cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}>
            <CheckCircle size={64} color="white" strokeWidth={2.5} />
          </div>

          <h1 style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", fontWeight: 900, color: "var(--text-primary)", marginBottom: "12px", fontFamily: "Outfit, sans-serif" }}>
            Order Confirmed! 🎉
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "32px", fontWeight: 500 }}>
            Thank you for your purchase. We are processing your order.
          </p>
          {orderId && (
            <div style={{
              display: "inline-block",
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              borderRadius: "100px",
              padding: "12px 32px",
              marginBottom: "40px",
              boxShadow: "var(--shadow-sm)"
            }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500 }}>Order ID: </span>
              <span style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "18px", fontFamily: "Outfit, sans-serif" }}>#{orderId}</span>
            </div>
          )}

          {/* Order Details Card */}
          {!loading && order && (
            <div style={{
              background: "var(--bg-card)",
              borderRadius: "24px",
              padding: "32px",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-md)",
              marginBottom: "32px",
              textAlign: "left",
            }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "24px", color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>
                Order Details
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", background: "var(--bg-primary)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--border-default)" }}>
                    <Phone size={18} color="var(--text-primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Customer</div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{order.customerName} • {order.phone}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", background: "var(--bg-primary)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--border-default)" }}>
                    <Home size={18} color="var(--text-primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Delivery Address</div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{order.address}, {order.city}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", background: "var(--bg-primary)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--border-default)" }}>
                    <Package size={18} color="var(--text-primary)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{order.items.length} Item(s)</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 500, display: "flex", justifyContent: "space-between" }}>
                          <span>{item.quantity}x {item.name}</span>
                          <span style={{ fontWeight: 700 }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border-default)", paddingTop: "24px", marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "4px" }}>Total Amount</div>
                  <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>Rs. {order.total.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "4px" }}>Payment</div>
                  <div style={{ fontWeight: 800, color: "var(--color-success)", display: "flex", alignItems: "center", gap: "6px" }}><span style={{ fontSize: "18px" }}>💰</span> COD</div>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div style={{
            background: "var(--bg-card)",
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "40px",
            textAlign: "left",
            border: "1px solid var(--border-default)"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "24px", color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>
              What happens next?
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { step: "1", text: "Our team will confirm your order within 1-2 hours", icon: "📞" },
                { step: "2", text: "Your order will be packed and shipped within 1-2 days", icon: "📦" },
                { step: "3", text: "Delivery in 3-5 business days to your address", icon: "🚚" },
                { step: "4", text: "Pay cash when the order arrives at your door", icon: "💵" },
              ].map((item) => (
                <div key={item.step} style={{ display: "flex", gap: "16px", alignItems: "center", background: "var(--bg-primary)", padding: "16px", borderRadius: "12px" }}>
                  <span style={{ fontSize: "24px", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}>{item.icon}</span>
                  <span style={{ fontSize: "15px", color: "var(--text-primary)", fontWeight: 500 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <a
              href={generateWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ width: "100%", justifyContent: "center", fontSize: "16px", padding: "18px" }}
            >
              <MessageCircle size={20} /> Receive Updates on WhatsApp
            </a>
            <Link href="/products" className="btn-secondary" style={{ width: "100%", justifyContent: "center", fontSize: "16px", padding: "18px" }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        @keyframes bounce {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", padding: "150px" }}><div className="spinner" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
