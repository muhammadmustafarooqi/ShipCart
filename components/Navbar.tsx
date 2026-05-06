"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, X, ArrowRight } from "lucide-react";
import { useCart } from "./CartProvider";

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop All", href: "/products" },
    { label: "Kitchen", href: "/products?category=kitchen-cooking" },
    { label: "Personal Care", href: "/products?category=personal-care-beauty" },
    { label: "Electronics", href: "/products?category=electronics-gadgets" },
  ];

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.95)",
          backdropFilter: scrolled ? "blur(24px) saturate(150%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(150%)" : "none",
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
          borderBottom: "1px solid var(--border-default)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      >
        <div className="page-container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
            
            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
              <div style={{ 
                width: "40px", height: "40px", 
                background: "var(--text-primary)", 
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontFamily: "Outfit, sans-serif", fontSize: "20px", fontWeight: 800,
                boxShadow: "var(--shadow-sm)"
              }}>
                A
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "20px", color: "var(--text-primary)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  AllInOne
                </span>
                <span style={{ fontSize: "10px", color: "var(--text-secondary)", letterSpacing: "1.5px", fontWeight: 700, textTransform: "uppercase" }}>
                  Premium Store
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div style={{ display: "flex", gap: "8px", flex: 1, justifyContent: "center" }} className="desktop-nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    textDecoration: "none", color: "var(--text-secondary)", fontWeight: 600,
                    fontSize: "14px", padding: "8px 16px", borderRadius: "100px",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="search-bar" style={{ display: "none" }}>
                <Search size={16} color="var(--text-secondary)" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                style={{
                  position: "relative",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                  width: "44px", height: "44px", borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none", flexShrink: 0,
                  transition: "all 0.2s ease",
                  boxShadow: "var(--shadow-sm)"
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget.style.borderColor = "var(--border-hover)");
                  (e.currentTarget.style.transform = "translateY(-2px)");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget.style.borderColor = "var(--border-default)");
                  (e.currentTarget.style.transform = "translateY(0)");
                }}
              >
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <span style={{
                    position: "absolute", top: "-6px", right: "-6px",
                    background: "var(--color-brand)", color: "white",
                    borderRadius: "50%", width: "20px", height: "20px",
                    fontSize: "11px", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "2px solid #ffffff",
                    fontFamily: "Outfit, sans-serif"
                  }}>
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="hamburger-btn"
                style={{ 
                  background: "transparent", border: "1px solid var(--border-default)", 
                  width: "44px", height: "44px", borderRadius: "12px",
                  cursor: "pointer", color: "var(--text-primary)", 
                  display: "none", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease"
                }}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "20px", color: "var(--text-primary)" }}>
              AllInOne
            </div>
            <button onClick={() => setMenuOpen(false)} style={{ 
              background: "var(--bg-card-hover)", border: "none", borderRadius: "50%",
              width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-primary)", cursor: "pointer" 
            }}>
              <X size={16} />
            </button>
          </div>
          
          <div className="search-bar" style={{ marginBottom: "24px", display: "flex" }}>
            <Search size={16} color="var(--text-secondary)" />
            <input
              type="text" placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                  setMenuOpen(false);
                }
              }}
              style={{ padding: "10px 0" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 16px", borderRadius: "12px",
                  textDecoration: "none", color: "var(--text-primary)",
                  fontWeight: 600, fontSize: "15px",
                  background: "var(--bg-card-hover)",
                  transition: "all 0.2s ease",
                }}
              >
                {link.label}
                <ArrowRight size={14} color="var(--text-secondary)" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav-links { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .search-bar { display: none !important; }
        }
        @media (min-width: 1025px) {
          .search-bar { display: flex !important; flex: 1; max-width: 280px; }
        }
      `}</style>
    </>
  );
}
