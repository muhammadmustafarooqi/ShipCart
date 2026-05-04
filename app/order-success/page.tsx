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
    <div>
      <Navbar />

      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
        <div style={{ maxWidth: "560px", width: "100%", textAlign: "center" }}>
          {/* Success Animation */}
          <div style={{
            width: "100px",
            height: "100px",
            background: "linear-gradient(135deg, #10b981, #059669)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 12px 40px rgba(16,185,129,0.35)",
            animation: "bounce 0.6s ease",
          }}>
            <CheckCircle size={52} color="white" strokeWidth={2.5} />
          </div>

          <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#1f2937", marginBottom: "8px" }}>
            Order Placed! 🎉
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "8px" }}>
            Thank you for shopping with ALLInONE Store
          </p>
          {orderId && (
            <div style={{
              display: "inline-block",
              background: "rgba(255,107,0,0.1)",
              border: "1px solid rgba(255,107,0,0.3)",
              borderRadius: "12px",
              padding: "10px 24px",
              marginBottom: "32px",
            }}>
              <span style={{ color: "#6b7280", fontSize: "14px" }}>Order ID: </span>
              <span style={{ color: "#ff6b00", fontWeight: 800, fontSize: "18px" }}>#{orderId}</span>
            </div>
          )}

          {/* Order Details Card */}
          {!loading && order && (
            <div style={{
              background: "white",
              borderRadius: "20px",
              padding: "28px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              marginBottom: "24px",
              textAlign: "left",
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px", color: "#1f2937" }}>
                Order Details
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", background: "#f9fafb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Phone size={16} color="#ff6b00" />
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "2px" }}>Customer</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#1f2937" }}>{order.customerName} • {order.phone}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", background: "#f9fafb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Home size={16} color="#ff6b00" />
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "2px" }}>Delivery Address</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#1f2937" }}>{order.address}, {order.city}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", background: "#f9fafb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Package size={16} color="#ff6b00" />
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>{order.items.length} Item(s)</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ fontSize: "13px", color: "#374151" }}>
                          {item.name} × {item.quantity} — Rs. {(item.price * item.quantity).toLocaleString()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px", marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>Total Amount</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#ff6b00" }}>Rs. {order.total.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>Payment</div>
                  <div style={{ fontWeight: 700, color: "#10b981" }}>💰 Cash on Delivery</div>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div style={{
            background: "#f9fafb",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "28px",
            textAlign: "left",
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px", color: "#1f2937" }}>
              What happens next?
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { step: "1", text: "Our team will confirm your order within 1-2 hours", icon: "📞" },
                { step: "2", text: "Your order will be packed and shipped within 1-2 days", icon: "📦" },
                { step: "3", text: "Delivery in 3-5 business days to your address", icon: "🚚" },
                { step: "4", text: "Pay cash when the order arrives at your door", icon: "💰" },
              ].map((item) => (
                <div key={item.step} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ fontSize: "18px" }}>{item.icon}</span>
                  <span style={{ fontSize: "13px", color: "#4b5563" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <a
              href={generateWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ width: "100%", justifyContent: "center", fontSize: "15px", padding: "15px" }}
            >
              <MessageCircle size={18} /> Confirm via WhatsApp
            </a>
            <Link href="/products" className="btn-secondary" style={{ width: "100%", justifyContent: "center", fontSize: "15px", padding: "13px" }}>
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
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", padding: "100px" }}><div className="spinner" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
