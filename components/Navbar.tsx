"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, X, Phone } from "lucide-react";
import { useCart } from "./CartProvider";

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Kitchen", href: "/products?category=kitchen-cooking" },
    { label: "Personal Care", href: "/products?category=personal-care-beauty" },
    { label: "Electronics", href: "/products?category=electronics-gadgets" },
  ];

  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.12)" : "0 2px 20px rgba(0,0,0,0.08)" }}>
      <div className="page-container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              background: "var(--primary)",
              color: "white",
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "18px",
              letterSpacing: "-0.5px",
              flexShrink: 0,
              fontFamily: "Outfit, sans-serif"
            }}>
              AIO
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "20px", color: "var(--secondary)", lineHeight: 1.1, fontFamily: "Outfit, sans-serif" }}>
                ALLIn<span style={{ color: "var(--primary)" }}>ONE</span>
              </div>
              <div style={{ fontSize: "10px", color: "var(--gray-600)", fontWeight: 600, letterSpacing: "1.5px" }}>
                STORE
              </div>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="search-input" style={{ flex: 1, maxWidth: "420px", margin: "0 24px", display: "flex" }}>
            <Search size={18} color="var(--gray-400)" />
            <input
              type="text"
              placeholder="Search modern gadgets & more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
            />
          </div>

          {/* Desktop Nav Links */}
          <div style={{ display: "none" }} className="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: "none",
                  color: "var(--gray-600)",
                  fontWeight: 600,
                  fontSize: "14px",
                  transition: "color 0.2s ease",
                  padding: "6px 0",
                  borderBottom: "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "var(--primary)";
                  (e.target as HTMLElement).style.borderBottom = "2px solid var(--primary)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "var(--gray-600)";
                  (e.target as HTMLElement).style.borderBottom = "2px solid transparent";
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#25D366",
                color: "white",
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                transition: "transform 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              title="WhatsApp"
            >
              <Phone size={18} />
            </a>

            {/* Cart */}
            <Link
              href="/cart"
              style={{
                position: "relative",
                background: "var(--primary)",
                color: "white",
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                transition: "transform 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: "var(--secondary)",
                  color: "white",
                  borderRadius: "50%",
                  width: "22px",
                  height: "22px",
                  fontSize: "11px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid var(--surface)",
                  fontFamily: "Outfit, sans-serif"
                }}>
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {menuOpen ? <X size={24} color="#1a1a2e" /> : <Menu size={24} color="#1a1a2e" />}
            </button>
          </div>
        </div>

        {/* Desktop Nav Row */}
        <div style={{
          display: "flex",
          gap: "24px",
          paddingBottom: "12px",
          borderTop: "1px solid #f3f4f6",
          paddingTop: "12px",
          overflowX: "auto",
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                textDecoration: "none",
                color: "#4b5563",
                fontWeight: 500,
                fontSize: "13px",
                whiteSpace: "nowrap",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "#ff6b00";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "#4b5563";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: "white",
          borderTop: "1px solid #f3f4f6",
          padding: "16px",
        }}>
          {/* Mobile Search */}
          <div className="search-input" style={{ marginBottom: "16px" }}>
            <Search size={18} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                  setMenuOpen(false);
                }
              }}
            />
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "12px 8px",
                textDecoration: "none",
                color: "#374151",
                fontWeight: 500,
                fontSize: "15px",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
