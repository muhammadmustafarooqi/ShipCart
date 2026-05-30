"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Package, Phone, Home, MessageCircle, PartyPopper, Banknote, Truck } from "lucide-react";
import { fbq } from "@/lib/fpq";

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

const playSuccessSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq: number, type: OscillatorType, startTime: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Ascending high-end melodic chime (C5 -> E5 -> G5 -> C6 -> E6)
    playTone(523.25, "sine", now, 0.4, 0.12);
    playTone(523.25 * 2, "triangle", now, 0.15, 0.03);

    playTone(659.25, "sine", now + 0.08, 0.4, 0.12);

    playTone(783.99, "sine", now + 0.16, 0.4, 0.12);

    playTone(1046.50, "sine", now + 0.24, 0.6, 0.15);
    playTone(1046.50 * 1.5, "triangle", now + 0.24, 0.3, 0.04);

    playTone(1318.51, "sine", now + 0.32, 0.8, 0.15);
    playTone(1318.51 * 2, "triangle", now + 0.32, 0.4, 0.05);
  } catch (error) {
    console.warn("Failed to play success ringtone:", error);
  }
};

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      playSuccessSound();
      fetch(`/api/orders/${orderId}`)
        .then((r) => r.json())
        .then((d) => {
          setOrder(d.order);
          fbq("track", "Purchase", {
            value: d.order.total,
            currency: "PKR"
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

  const generateWhatsAppMessage = () => {
    if (!order) return "#";
    const itemsList = order.items.map((i) => `• ${i.name} x${i.quantity}`).join("\n");
    const msg = `*NEW ORDER #${order.orderId}*

*Customer:* ${order.customerName}
*Phone:* ${order.phone}
*City:* ${order.city}
*Address:* ${order.address}

*Items:*
${itemsList}

*Total:* Rs. ${order.total.toLocaleString()}
*Payment:* Cash on Delivery`;
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
            background: "var(--gradient-brand)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
            border: "3px solid rgba(201, 168, 76, 0.45)",
            boxShadow: "0 20px 48px rgba(74, 16, 32, 0.35)",
            animation: "bounce 0.6s ease cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}>
            <CheckCircle size={64} color="var(--white)" strokeWidth={2.5} />
          </div>

          <h1 style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", fontWeight: 900, color: "var(--text-primary)", marginBottom: "12px", fontFamily: "Outfit, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <span>Order Confirmed!</span>
            <PartyPopper size={36} color="var(--maroon)" strokeWidth={2} aria-hidden />
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
                    <Phone size={18} color="var(--color-icon)" />
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Customer</div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{order.customerName} • {order.phone}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", background: "var(--bg-primary)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--border-default)" }}>
                    <Home size={18} color="var(--color-icon)" />
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Delivery Address</div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{order.address}, {order.city}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", background: "var(--bg-primary)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--border-default)" }}>
                    <Package size={18} color="var(--color-icon)" />
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
                  <div style={{ fontWeight: 800, color: "var(--maroon)", display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end" }}>
                    <Banknote size={22} color="var(--gold)" strokeWidth={2.25} aria-hidden />
                    COD
                  </div>
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
                { step: "1", text: "Our team will confirm your order within 1-2 hours", Icon: Phone },
                { step: "2", text: "Your order will be packed and shipped within 1-2 days", Icon: Package },
                { step: "3", text: "Delivery in 3-5 business days to your address", Icon: Truck },
                { step: "4", text: "Pay cash when the order arrives at your door", Icon: Banknote },
              ].map(({ step, text, Icon }) => (
                <div key={step} style={{ display: "flex", gap: "16px", alignItems: "center", background: "var(--bg-primary)", padding: "16px", borderRadius: "12px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "var(--white)", border: "1px solid var(--cream-mid)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "var(--shadow-sm)" }}>
                    <Icon size={22} color="var(--maroon)" strokeWidth={2.25} aria-hidden style={{ flexShrink: 0 }} />
                  </div>
                  <span style={{ fontSize: "15px", color: "var(--text-primary)", fontWeight: 500 }}>{text}</span>
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
              <MessageCircle size={20} color="var(--icon-on-brand)" strokeWidth={2.25} /> Receive Updates on WhatsApp
            </a>
            <Link href="/products" className="btn-secondary" style={{ width: "100%", justifyContent: "center", fontSize: "16px", padding: "18px" }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
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
