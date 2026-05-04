"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { PAKISTANI_CITIES, validatePakistaniPhone, calculateShipping } from "@/lib/utils";
import { ShoppingBag, CheckCircle, Truck } from "lucide-react";
import Link from "next/link";

interface FormData {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
}

interface FormErrors {
  customerName?: string;
  phone?: string;
  city?: string;
  address?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState<FormData>({
    customerName: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const shippingFee = calculateShipping(subtotal);
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div>
        <Navbar />
        <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛒</div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>Cart is Empty</h2>
          <Link href="/products" className="btn-primary">Go Shopping</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.customerName.trim()) newErrors.customerName = "Full name is required";
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePakistaniPhone(form.phone)) {
      newErrors.phone = "Enter valid Pakistani number (03XXXXXXXXX)";
    }
    if (!form.city) newErrors.city = "Please select your city";
    if (!form.address.trim() || form.address.trim().length < 10) {
      newErrors.address = "Please enter complete delivery address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const orderData = {
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        city: form.city,
        address: form.address.trim(),
        notes: form.notes.trim(),
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        shippingFee,
        total,
        paymentMethod: "COD",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      clearCart();
      router.push(`/order-success?orderId=${data.order.orderId}`);
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="page-container" style={{ padding: "40px 16px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#1f2937", marginBottom: "8px" }}>
          Checkout
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "32px" }}>
          Fill in your details below to complete your order
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "32px" }} className="checkout-grid">
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Personal Details */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px",
              border: "1px solid #f0f0f0",
              marginBottom: "20px",
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px", color: "#1f2937", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ background: "#ff6b00", color: "white", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700 }}>1</span>
                Personal Information
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Muhammad Ali"
                    value={form.customerName}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, customerName: e.target.value }));
                      if (errors.customerName) setErrors((er) => ({ ...er, customerName: undefined }));
                    }}
                    className={errors.customerName ? "error" : ""}
                  />
                  {errors.customerName && <p className="form-error">{errors.customerName}</p>}
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="03001234567"
                    value={form.phone}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, phone: e.target.value }));
                      if (errors.phone) setErrors((er) => ({ ...er, phone: undefined }));
                    }}
                    className={errors.phone ? "error" : ""}
                    maxLength={11}
                  />
                  {errors.phone && <p className="form-error">{errors.phone}</p>}
                  <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Format: 03XXXXXXXXX</p>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px",
              border: "1px solid #f0f0f0",
              marginBottom: "20px",
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px", color: "#1f2937", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ background: "#ff6b00", color: "white", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700 }}>2</span>
                Delivery Address
              </h2>

              <div className="form-group">
                <label>City *</label>
                <select
                  value={form.city}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, city: e.target.value }));
                    if (errors.city) setErrors((er) => ({ ...er, city: undefined }));
                  }}
                  className={errors.city ? "error" : ""}
                >
                  <option value="">Select your city</option>
                  {PAKISTANI_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <p className="form-error">{errors.city}</p>}
              </div>

              <div className="form-group">
                <label>Full Address *</label>
                <textarea
                  rows={3}
                  placeholder="House/Flat No, Street, Area, City"
                  value={form.address}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, address: e.target.value }));
                    if (errors.address) setErrors((er) => ({ ...er, address: undefined }));
                  }}
                  className={errors.address ? "error" : ""}
                />
                {errors.address && <p className="form-error">{errors.address}</p>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Order Notes (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Any special instructions for delivery..."
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px",
              border: "1px solid #f0f0f0",
              marginBottom: "24px",
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", color: "#1f2937", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ background: "#ff6b00", color: "white", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700 }}>3</span>
                Payment Method
              </h2>

              <div style={{
                border: "2px solid #10b981",
                borderRadius: "12px",
                padding: "16px",
                background: "rgba(16,185,129,0.05)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle size={14} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "15px", color: "#1f2937" }}>💰 Cash on Delivery (COD)</div>
                  <div style={{ fontSize: "13px", color: "#6b7280" }}>Pay when your order arrives. No advance payment.</div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", fontSize: "17px", padding: "18px" }}
              disabled={loading}
            >
              {loading ? "Placing Order..." : `Place Order — Rs. ${total.toLocaleString()}`}
            </button>
          </form>

          {/* Order Summary */}
          <div style={{ alignSelf: "flex-start", position: "sticky", top: "80px" }}>
            <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #f0f0f0", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", color: "#1f2937", display: "flex", alignItems: "center", gap: "8px" }}>
                <ShoppingBag size={20} color="#ff6b00" /> Order Summary
              </h2>

              {/* Items */}
              <div style={{ maxHeight: "280px", overflowY: "auto", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {items.map((item) => (
                  <div key={item.productId} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "8px",
                      background: "#f5f5f5",
                      overflow: "hidden",
                      flexShrink: 0,
                      position: "relative",
                    }}>
                      <span style={{
                        position: "absolute",
                        top: "-4px",
                        right: "-4px",
                        background: "#ff6b00",
                        color: "white",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        fontSize: "10px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#1f2937", lineHeight: 1.3 }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: "13px", color: "#ff6b00", fontWeight: 700 }}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#6b7280" }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600, color: "#1f2937" }}>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280" }}>
                    <Truck size={14} /> Shipping
                  </span>
                  <span style={{ fontWeight: 600, color: shippingFee === 0 ? "#10b981" : "#1f2937" }}>
                    {shippingFee === 0 ? "FREE" : `Rs. ${shippingFee}`}
                  </span>
                </div>
                <div style={{ borderTop: "2px solid #f0f0f0", paddingTop: "12px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700, fontSize: "17px" }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: "20px", color: "#ff6b00" }}>
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        @media (max-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
