"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { useSettings } from "@/lib/useSettings";
import { PAKISTANI_CITIES, validatePakistaniPhone, calculateShipping } from "@/lib/utils";
import { CheckCircle, Truck, ShoppingBag, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FormData { customerName: string; phone: string; city: string; address: string; notes: string; }
interface FormErrors { customerName?: string; phone?: string; city?: string; address?: string; }

const inputStyle = {
  width: "100%", background: "var(--bg-card)",
  border: "1px solid var(--border-default)", borderRadius: "12px",
  color: "var(--text-primary)", padding: "14px 16px", fontSize: "15px",
  fontFamily: "Plus Jakarta Sans, sans-serif", outline: "none",
  transition: "all 0.2s ease",
  boxShadow: "var(--shadow-sm)"
};

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const { settings, loading: settingsLoading } = useSettings();
  const [form, setForm] = useState<FormData>({ customerName: "", phone: "", city: "", address: "", notes: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [total, setTotal] = useState(0);

  // Update shipping when settings or subtotal changes
  useEffect(() => {
    if (settings) {
      const fee = subtotal >= settings.freeDeliveryAbove ? 0 : settings.deliveryFee;
      setShippingFee(fee);
      setTotal(subtotal + fee);
    }
  }, [subtotal, settings]);

  // Fetch user data if logged in
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email && !userDataLoaded) {
        try {
          const res = await fetch(`/api/user/profile`);
          if (res.ok) {
            const data = await res.json();
            setForm(prev => ({
              ...prev,
              customerName: data.user.name || prev.customerName,
              phone: data.user.phone || prev.phone,
              city: data.user.city || prev.city,
              address: data.user.address || prev.address,
            }));
            setUserDataLoaded(true);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    fetchUserData();
  }, [session, userDataLoaded]);

  if (items.length === 0) {
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px", color: "var(--text-secondary)" }}>
            <ShoppingBag size={64} strokeWidth={1.35} aria-hidden />
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px", fontFamily: "Outfit, sans-serif" }}>Cart is Empty</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "16px", fontWeight: 500 }}>You need to add products to your cart before checking out.</p>
          <Link href="/products" className="btn-primary" style={{ padding: "16px 32px", fontSize: "16px" }}>Explore Collection</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.customerName.trim()) e.customerName = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!validatePakistaniPhone(form.phone)) e.phone = "Enter valid Pakistani number (03XXXXXXXXX)";
    if (!form.city) e.city = "Please select your city";
    if (!form.address.trim() || form.address.trim().length < 10) e.address = "Please enter your complete delivery address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const orderData = { customerName: form.customerName.trim(), phone: form.phone.trim(), city: form.city, address: form.address.trim(), notes: form.notes.trim(), items: items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, image: i.image })), subtotal, shippingFee, total, paymentMethod: "COD" };
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderData) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");
      clearCart();
      router.push(`/order-success?orderId=${data.order.orderId}`);
    } catch (error) { console.error("Order error:", error); alert("Failed to place order. Please try again."); }
    finally { setLoading(false); }
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "var(--text-primary)";
    e.target.style.boxShadow = "0 0 0 4px rgba(15, 23, 42, 0.05)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "var(--border-default)";
    e.target.style.boxShadow = "var(--shadow-sm)";
  };

  const stepNum = (n: string) => (
    <span style={{ background: "var(--text-primary)", color: "white", width: "28px", height: "28px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, marginRight: "12px", fontFamily: "Outfit, sans-serif" }}>{n}</span>
  );

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />
      <div className="page-container" style={{ padding: "48px 24px" }}>
        <h1 style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px", fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em" }}>Secure Checkout</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", marginBottom: "40px", fontSize: "14px", fontWeight: 600 }}>
          <ShieldCheck size={16} color="var(--color-icon)" /> SSL Encrypted secure connection
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "48px" }} className="checkout-grid">
          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            <div className="summary-card" style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "24px", display: "flex", alignItems: "center", fontFamily: "Outfit, sans-serif" }}>{stepNum("1")} Personal Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="form-grid">
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit, sans-serif" }}>Full Name *</label>
                  <input type="text" placeholder="Muhammad Ali" value={form.customerName}
                    onChange={(e) => { setForm((f) => ({ ...f, customerName: e.target.value })); setErrors((er) => ({ ...er, customerName: undefined })); }}
                    style={{ ...inputStyle, borderColor: errors.customerName ? "var(--color-error)" : "var(--border-default)" }}
                    onFocus={onFocus} onBlur={onBlur} />
                  {errors.customerName && <p style={{ color: "var(--color-error)", fontSize: "12px", marginTop: "6px", fontWeight: 500 }}>{errors.customerName}</p>}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit, sans-serif" }}>Phone Number *</label>
                  <input type="tel" placeholder="03001234567" value={form.phone} maxLength={11}
                    onChange={(e) => { setForm((f) => ({ ...f, phone: e.target.value })); setErrors((er) => ({ ...er, phone: undefined })); }}
                    style={{ ...inputStyle, borderColor: errors.phone ? "var(--color-error)" : "var(--border-default)" }}
                    onFocus={onFocus} onBlur={onBlur} />
                  {errors.phone && <p style={{ color: "var(--color-error)", fontSize: "12px", marginTop: "6px", fontWeight: 500 }}>{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="summary-card" style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "24px", display: "flex", alignItems: "center", fontFamily: "Outfit, sans-serif" }}>{stepNum("2")} Shipping Information</h2>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit, sans-serif" }}>City *</label>
                <select value={form.city}
                  onChange={(e) => { setForm((f) => ({ ...f, city: e.target.value })); setErrors((er) => ({ ...er, city: undefined })); }}
                  style={{ ...inputStyle, borderColor: errors.city ? "var(--color-error)" : "var(--border-default)", cursor: "pointer", appearance: "none" }}
                  onFocus={onFocus} onBlur={onBlur}
                >
                  <option value="">Select your city</option>
                  {PAKISTANI_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <p style={{ color: "var(--color-error)", fontSize: "12px", marginTop: "6px", fontWeight: 500 }}>{errors.city}</p>}
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit, sans-serif" }}>Delivery Address *</label>
                <textarea rows={3} placeholder="House/Flat No, Street, Area, Phase" value={form.address}
                  onChange={(e) => { setForm((f) => ({ ...f, address: e.target.value })); setErrors((er) => ({ ...er, address: undefined })); }}
                  style={{ ...inputStyle, borderColor: errors.address ? "var(--color-error)" : "var(--border-default)", resize: "vertical", lineHeight: 1.5 }}
                  onFocus={onFocus} onBlur={onBlur} />
                {errors.address && <p style={{ color: "var(--color-error)", fontSize: "12px", marginTop: "6px", fontWeight: 500 }}>{errors.address}</p>}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit, sans-serif" }}>Order Notes (Optional)</label>
                <textarea rows={2} placeholder="Any special delivery instructions..." value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  style={{ ...inputStyle, borderColor: "var(--border-default)", resize: "vertical" }}
                  onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="summary-card" style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "20px", display: "flex", alignItems: "center", fontFamily: "Outfit, sans-serif" }}>{stepNum("3")} Payment Method</h2>
              <div style={{ border: "2px solid var(--text-primary)", borderRadius: "12px", padding: "20px", background: "var(--bg-card)", display: "flex", alignItems: "center", gap: "16px", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><CheckCircle size={14} color="#ffffff" /></div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "16px", color: "var(--text-primary)", fontFamily: "Outfit, sans-serif", marginBottom: "4px" }}>Cash on Delivery (COD)</div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>Pay securely with cash upon delivery.</div>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "18px", padding: "20px", opacity: loading ? 0.7 : 1, transition: "all 0.3s ease" }} disabled={loading}>
              {loading ? "Processing..." : `Complete Order — Rs. ${total.toLocaleString()}`}
            </button>
          </form>

          {/* Summary */}
          <div style={{ alignSelf: "flex-start", position: "sticky", top: "100px" }}>
            <div className="summary-card" style={{ border: "none", boxShadow: "var(--shadow-md)" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "24px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "10px", fontFamily: "Outfit, sans-serif" }}>
                <ShoppingBag size={20} color="var(--color-icon)" /> Order Summary
              </h2>
              <div style={{ maxHeight: "320px", overflowY: "auto", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "16px", paddingRight: "8px" }}>
                {items.map((item) => (
                  <div key={item.productId} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border-default)", overflow: "hidden", flexShrink: 0, position: "relative", padding: "4px" }}>
                      <Image src={item.image || `https://placehold.co/64x64/ffffff/2563eb?text=P`} alt={item.name} width={64} height={64} style={{ width: "100%", height: "100%", objectFit: "contain" }} unoptimized />
                      <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "var(--text-primary)", color: "white", borderRadius: "50%", width: "20px", height: "20px", fontSize: "11px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--bg-card)" }}>{item.quantity}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: "4px", fontFamily: "Outfit, sans-serif" }}>{item.name}</div>
                      <div style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 600 }}>Rs. {(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid var(--border-default)", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 500 }}><span style={{ color: "var(--text-secondary)" }}>Subtotal</span><span style={{ color: "var(--text-primary)", fontWeight: 700, fontFamily: "Outfit, sans-serif" }}>Rs. {subtotal.toLocaleString()}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 500 }}><span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}><Truck size={14} color="var(--color-icon)" /> Delivery</span><span style={{ fontWeight: 700, color: shippingFee === 0 ? "var(--color-success)" : "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>{shippingFee === 0 ? "FREE" : `Rs. ${shippingFee}`}</span></div>
                <div style={{ borderTop: "1px solid var(--border-default)", paddingTop: "16px", marginTop: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: "18px", color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>Total</span>
                  <span style={{ fontWeight: 900, fontSize: "24px", color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        @media(max-width:900px){
          .checkout-grid{grid-template-columns:1fr!important; gap: 40px !important;}
          .form-grid{grid-template-columns:1fr!important;}
        }
      `}</style>
    </div>
  );
}
