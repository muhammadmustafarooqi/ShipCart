"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Package, CheckCircle, Truck, MapPin, XCircle, Clock } from "lucide-react";
import Image from "next/image";

interface TrackedOrder {
  orderId: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  customerName: string;
  createdAt: string;
  total: number;
  trackingNumber: string | null;
  courierName: string | null;
  items: { name: string; quantity: number; image: string }[];
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phone) {
      setError("Please enter both Order ID and Phone Number.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to track order");
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending": return <Clock size={32} color="var(--color-warning)" />;
      case "Confirmed": return <Package size={32} color="var(--color-brand)" />;
      case "Shipped": return <Truck size={32} color="var(--color-brand)" />;
      case "Delivered": return <CheckCircle size={32} color="var(--color-success)" />;
      case "Cancelled": return <XCircle size={32} color="var(--color-error)" />;
      default: return <Package size={32} color="var(--text-secondary)" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Pending": return "We are reviewing your order.";
      case "Confirmed": return "Your order is confirmed and being packed.";
      case "Shipped": return "Your order has been handed over to the courier.";
      case "Delivered": return "Your order has been delivered successfully.";
      case "Cancelled": return "Your order has been cancelled.";
      default: return "Unknown status.";
    }
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <div className="page-container" style={{ padding: "60px 24px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ textAlign: "center", marginBottom: "40px", maxWidth: "600px", width: "100%" }}>
          <div style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", width: "64px", height: "64px", background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "16px", marginBottom: "20px", boxShadow: "var(--shadow-sm)" }}>
            <MapPin size={28} color="var(--orange)" />
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px", fontFamily: "Outfit, sans-serif" }}>Track Your Order</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", fontWeight: 500 }}>Enter your Order ID and the phone number used during checkout to see live updates.</p>
        </div>

        <div style={{ width: "100%", maxWidth: "500px", background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xl)", padding: "32px", boxShadow: "var(--shadow-md)" }}>
          <form onSubmit={handleTrack} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit, sans-serif" }}>Order ID</label>
              <input 
                type="text" 
                placeholder="e.g. ORD-12345678" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                style={{ width: "100%", background: "var(--bg-primary)", border: "1px solid var(--border-default)", borderRadius: "12px", padding: "14px 16px", fontSize: "15px", fontFamily: "Plus Jakarta Sans, sans-serif", outline: "none" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit, sans-serif" }}>Phone Number</label>
              <input 
                type="tel" 
                placeholder="03XXXXXXXXX" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: "100%", background: "var(--bg-primary)", border: "1px solid var(--border-default)", borderRadius: "12px", padding: "14px 16px", fontSize: "15px", fontFamily: "Plus Jakarta Sans, sans-serif", outline: "none" }}
              />
            </div>
            {error && (
              <div style={{ padding: "12px", background: "rgba(229, 57, 53, 0.1)", color: "var(--color-error)", borderRadius: "8px", fontSize: "14px", fontWeight: 600, textAlign: "center" }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: "16px", marginTop: "8px" }}>
              {loading ? "Searching..." : <><Search size={18} style={{ marginRight: "8px" }} /> Track Order</>}
            </button>
          </form>
        </div>

        {order && (
          <div style={{ width: "100%", maxWidth: "600px", marginTop: "40px", background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xl)", padding: "32px", boxShadow: "var(--shadow-md)", animation: "fadeIn 0.5s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", borderBottom: "1px solid var(--border-default)", paddingBottom: "24px" }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px", fontFamily: "Outfit, sans-serif" }}>Order Found</div>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>{order.orderId}</h2>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>{new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>Rs. {order.total.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px", background: "var(--bg-primary)", padding: "24px", borderRadius: "16px", border: "1px solid var(--border-default)", marginBottom: "32px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-sm)", flexShrink: 0 }}>
                {getStatusIcon(order.status)}
              </div>
              <div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px", fontFamily: "Outfit, sans-serif" }}>
                  {order.status}
                </div>
                <div style={{ fontSize: "15px", color: "var(--text-secondary)", fontWeight: 500, lineHeight: 1.5 }}>
                  {getStatusText(order.status)}
                </div>
              </div>
            </div>

            {order.trackingNumber && (
              <div style={{ background: "var(--navy-dim)", border: "1px dashed var(--orange)", borderRadius: "12px", padding: "20px", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px", fontFamily: "Outfit, sans-serif" }}>Courier Tracking ({order.courierName || "Standard"})</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>{order.trackingNumber}</div>
                </div>
                <button className="btn-primary" style={{ padding: "10px 20px", fontSize: "14px" }}>Copy</button>
              </div>
            )}

            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px", fontFamily: "Outfit, sans-serif" }}>Items Ordered</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "16px", background: "var(--bg-primary)", padding: "12px", borderRadius: "12px", border: "1px solid var(--border-default)" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "8px", overflow: "hidden", background: "var(--bg-card)", position: "relative" }}>
                      <Image src={item.image || `https://placehold.co/64x64/ffffff/2563eb?text=P`} alt={item.name} fill style={{ objectFit: "contain" }}  />
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>{item.name}</div>
                      <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
