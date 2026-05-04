"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  const shippingFee = subtotal >= 1500 ? 0 : 200;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div>
        <Navbar />
        <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>🛒</div>
          <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937", marginBottom: "12px" }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "32px", fontSize: "16px" }}>
            Looks like you haven&apos;t added any products yet.
          </p>
          <Link href="/products" className="btn-primary" style={{ fontSize: "16px", padding: "14px 32px" }}>
            <ShoppingBag size={18} /> Start Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="page-container" style={{ padding: "40px 16px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#1f2937", marginBottom: "8px" }}>
          Shopping Cart
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "32px" }}>
          {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px" }} className="cart-grid">
          {/* Cart Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {items.map((item) => (
              <div key={item.productId} className="cart-item">
                {/* Image */}
                <Link href={`/products/${item.slug}`}>
                  <div style={{ width: "100px", height: "100px", borderRadius: "12px", overflow: "hidden", background: "#f5f5f5", flexShrink: 0 }}>
                    <Image
                      src={item.image || `https://placehold.co/100x100/f5f5f5/ff6b00?text=${encodeURIComponent(item.name.slice(0, 5))}`}
                      alt={item.name}
                      width={100}
                      height={100}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      unoptimized
                    />
                  </div>
                </Link>

                {/* Details */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <Link href={`/products/${item.slug}`} style={{ textDecoration: "none" }}>
                      <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1f2937", marginBottom: "4px", lineHeight: 1.4 }}>
                        {item.name}
                      </h3>
                    </Link>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#ff6b00" }}>
                      Rs. {item.price.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {/* Quantity */}
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span style={{ fontWeight: 700, fontSize: "15px", color: "#1f2937" }}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex", padding: "4px" }}
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#ff6b00", textDecoration: "none", fontSize: "14px", fontWeight: 600, marginTop: "8px" }}>
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div style={{ alignSelf: "flex-start", position: "sticky", top: "80px" }}>
            <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #f0f0f0", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px", color: "#1f2937" }}>
                Order Summary
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#6b7280" }}>
                  <span>Subtotal ({totalItems} items)</span>
                  <span style={{ fontWeight: 600, color: "#1f2937" }}>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Shipping Fee</span>
                  <span style={{ fontWeight: 600, color: shippingFee === 0 ? "#10b981" : "#1f2937" }}>
                    {shippingFee === 0 ? "FREE 🎉" : `Rs. ${shippingFee}`}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <div style={{ background: "#fff3e8", borderRadius: "8px", padding: "10px 12px", fontSize: "12px", color: "#ff6b00", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
                    <Truck size={14} />
                    Add Rs. {(1500 - subtotal).toLocaleString()} more for FREE delivery!
                  </div>
                )}
              </div>

              <div style={{ borderTop: "2px solid #f0f0f0", paddingTop: "16px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700, fontSize: "18px" }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: "22px", color: "#ff6b00" }}>
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* COD Badge */}
              <div style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: "10px",
                padding: "14px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <span style={{ fontSize: "22px" }}>💰</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#065f46" }}>Cash on Delivery</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>Pay when you receive your order</div>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "16px", padding: "16px", textDecoration: "none", display: "flex" }}>
                Proceed to Checkout <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        @media (max-width: 768px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
