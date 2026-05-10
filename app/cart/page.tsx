"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { Trash2, Plus, Minus, ShoppingBag, Truck, CreditCard } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const shippingFee = subtotal >= 1500 ? 0 : 200;
  const total = subtotal + shippingFee;

  const s = { background: "var(--bg-primary)", minHeight: "100vh" };

  if (items.length === 0) {
    return (
      <div style={s}>
        <Navbar />
        <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
          <div style={{ fontSize: "64px", marginBottom: "24px", opacity: 0.8 }}>🛍️</div>
          <h2 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px", fontFamily: "Outfit, sans-serif" }}>Your Cart is Empty</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "16px", fontWeight: 500 }}>Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link href="/products" className="btn-primary" style={{ padding: "16px 32px", fontSize: "16px" }}><ShoppingBag size={18} color="white" /> Explore Collection</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={s}>
      <Navbar />
      <div className="page-container" style={{ padding: "48px 24px" }}>
        <h1 style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px", fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em" }}>Shopping Cart</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "40px", fontSize: "15px", fontWeight: 500 }}>{totalItems} {totalItems === 1 ? "item" : "items"} in your cart</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px" }} className="cart-grid">
          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {items.map((item) => (
              <div key={item.productId} className="cart-item">
                <Link href={`/products/${item.productId}`}>
                  <div style={{ width: "100px", height: "100px", borderRadius: "12px", overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border-default)", flexShrink: 0, padding: "8px" }}>
                    <Image src={item.image || `https://placehold.co/100x100/ffffff/2563eb?text=P`} alt={item.name} width={100} height={100} style={{ width: "100%", height: "100%", objectFit: "contain" }} unoptimized />
                  </div>
                </Link>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "4px 0" }}>
                  <div>
                    <Link href={`/products/${item.productId}`} style={{ textDecoration: "none" }}>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: "8px", fontFamily: "Outfit, sans-serif" }}>{item.name}</div>
                    </Link>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>Rs. {item.price.toLocaleString()}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px" }}>
                    <div className="qty-control" style={{ background: "var(--bg-card)" }}>
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}><Minus size={14} color="var(--color-icon)" /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}><Plus size={14} color="var(--color-icon)" /></button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span style={{ fontWeight: 800, fontSize: "15px", color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      <button onClick={() => removeItem(item.productId)} style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "8px", cursor: "pointer", color: "#ef4444", display: "flex", padding: "8px", transition: "all 0.2s ease" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")} onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-card)")}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--color-brand)", textDecoration: "none", fontSize: "14px", fontWeight: 600, marginTop: "16px", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              &larr; Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div style={{ alignSelf: "flex-start", position: "sticky", top: "100px" }}>
            <div className="summary-card">
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "24px", color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>Order Summary</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "var(--text-secondary)", fontWeight: 500 }}>
                  <span>Subtotal ({totalItems} items)</span>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: 500 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Shipping Fee</span>
                  <span style={{ fontWeight: 700, color: shippingFee === 0 ? "var(--color-success)" : "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>{shippingFee === 0 ? "FREE" : `Rs. ${shippingFee}`}</span>
                </div>
                {shippingFee > 0 && (
                  <div style={{ background: "var(--color-brand-dim)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", color: "var(--color-brand)", display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                    <Truck size={16} color="var(--color-icon)" /> Add Rs. {(1500 - subtotal).toLocaleString()} more for free delivery!
                  </div>
                )}
              </div>
              <div style={{ borderTop: "1px solid var(--border-default)", paddingTop: "20px", marginBottom: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>Total</span>
                  <span style={{ fontWeight: 900, fontSize: "24px", color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>Rs. {total.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)", borderRadius: "12px", padding: "16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ background: "white", padding: "8px", borderRadius: "8px", boxShadow: "var(--shadow-sm)" }}><CreditCard size={20} color="var(--color-icon)" /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", fontFamily: "Outfit, sans-serif" }}>Cash on Delivery</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500, marginTop: "2px" }}>Pay securely when you receive your order</div>
                </div>
              </div>
              <Link href="/checkout" className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "16px", padding: "16px", display: "flex" }}>
                Proceed to Checkout &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`@media(max-width:900px){.cart-grid{grid-template-columns:1fr!important; gap: 48px !important;}}`}</style>
    </div>
  );
}
