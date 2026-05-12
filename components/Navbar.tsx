"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, X, ArrowRight, User } from "lucide-react";
import Image from "next/image";
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

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop All", href: "/products" },
    { label: "Kitchen", href: "/products?category=kitchen-cooking" },
    { label: "Personal Care", href: "/products?category=personal-care-beauty" },
    { label: "Electronics", href: "/products?category=electronics-gadgets" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled
            ? "rgba(255, 253, 249, 0.96)"
            : "rgba(255, 253, 249, 0.99)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${scrolled ? "var(--cream-mid)" : "var(--cream-dark)"}`,
          boxShadow: scrolled ? "0 4px 20px rgba(42, 21, 24, 0.08)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div className="page-container">

          {/* ── MOBILE HEADER (3-column: left | center | right) ── */}
          <div className="mobile-header">

            {/* Left: Hamburger */}
            <button
              onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
              className="icon-btn"
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Center: Logo */}
            <Link href="/" className="logo-center" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "42px", height: "42px",
                borderRadius: "11px",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
                background: "var(--white)",
                border: "2px solid var(--cream-mid)",
                boxShadow: "var(--shadow-sm)",
                flexShrink: 0,
              }}>
                <Image
                  src="/logo.webp"
                  alt="AllInOne Store Logo"
                  width={42}
                  height={42}
                  style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{
                  fontFamily: "Outfit, sans-serif", fontWeight: 900,
                  fontSize: "20px", color: "var(--maroon)",
                  lineHeight: 1.1, letterSpacing: "-0.02em"
                }}>
                  AllInOne
                </span>
                <span style={{
                  fontSize: "9px", color: "var(--gold)",
                  letterSpacing: "2px", fontWeight: 700, textTransform: "uppercase"
                }}>
                  Premium Store
                </span>
              </div>
            </Link>

            {/* Right: Search + Cart */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
                className="icon-btn"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link href="/cart" className="cart-btn" aria-label="Cart">
                <ShoppingCart size={20} color="var(--white)" />
                {totalItems > 0 && (
                  <span className="cart-badge">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* ── DESKTOP HEADER ── */}
          <div className="desktop-header">
            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", background: "var(--white)",
                border: "2px solid var(--cream-mid)", boxShadow: "var(--shadow-sm)"
              }}>
                <Image src="/logo.webp" alt="AllInOne Store Logo" width={48} height={48}
                  style={{ objectFit: "contain", width: "100%", height: "100%" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "22px", color: "var(--maroon)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  AllInOne
                </span>
                <span style={{ fontSize: "10px", color: "var(--gold)", letterSpacing: "2px", fontWeight: 700, textTransform: "uppercase" }}>
                  Premium Store
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <div style={{ display: "flex", gap: "4px", flex: 1, justifyContent: "center" }}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="desktop-nav-link">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <form
                onSubmit={handleSearchSubmit}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "var(--cream-dark)", borderRadius: "10px",
                  padding: "8px 14px", border: "1px solid var(--cream-mid)"
                }}
              >
                <Search size={15} color="var(--text-secondary)" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: "transparent", border: "none", outline: "none",
                    fontSize: "14px", fontWeight: 500,
                    color: "var(--text-primary)", width: "140px",
                    fontFamily: "Plus Jakarta Sans, sans-serif"
                  }}
                />
              </form>

              <Link href="/auth/login" className="icon-btn-bordered" aria-label="Account">
                <User size={20} color="var(--maroon)" />
              </Link>

              <Link href="/cart" className="cart-btn" aria-label="Cart">
                <ShoppingCart size={20} color="var(--white)" />
                {totalItems > 0 && (
                  <span className="cart-badge">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* ── MOBILE SEARCH BAR (slides down) ── */}
        <div className={`mobile-search-bar ${searchOpen ? "open" : ""}`}>
          <form onSubmit={handleSearchSubmit} style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "var(--cream-dark)", borderRadius: "12px",
            padding: "12px 16px", border: "1px solid var(--cream-mid)"
          }}>
            <Search size={17} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={searchOpen}
              style={{
                background: "transparent", border: "none", outline: "none",
                flex: 1, fontSize: "15px", fontWeight: 500,
                color: "var(--text-primary)",
                fontFamily: "Plus Jakarta Sans, sans-serif"
              }}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex" }}>
                <X size={16} />
              </button>
            )}
          </form>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`mobile-drawer ${menuOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          top: "72px",
          left: 0,
          right: 0,
          bottom: 0,
          background: "var(--white)",
          zIndex: 99,
          overflowY: "auto",
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div style={{ padding: "28px 20px" }}>
          {/* Category Label */}
          <div style={{
            fontSize: "11px", color: "var(--text-secondary)", fontWeight: 700,
            letterSpacing: "1.5px", textTransform: "uppercase",
            paddingLeft: "4px", marginBottom: "14px"
          }}>
            Navigate
          </div>

          {/* Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "36px" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="drawer-link"
              >
                {link.label}
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(42, 21, 24, 0.45)",
            zIndex: 98, top: "72px",
            backdropFilter: "blur(2px)"
          }}
        />
      )}

      <style>{`
        /* ── Layout helpers ── */
        .page-container { max-width: 1400px; margin: 0 auto; padding: 0 16px; }

        /* ── Mobile vs Desktop visibility ── */
        .mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        .desktop-header { display: none; }

        @media (min-width: 1025px) {
          .mobile-header { display: none; }
          .desktop-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 80px;
          }
          .page-container { padding: 0 32px; }
        }

        /* ── Logo center on mobile ── */
        .logo-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        /* ── Icon button ── */
        .icon-btn {
          background: transparent;
          border: none;
          width: 44px; height: 44px;
          border-radius: 11px;
          cursor: pointer;
          color: var(--maroon);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .icon-btn:hover { background: var(--cream-dark); }

        .icon-btn-bordered {
          background: var(--white);
          border: 2px solid var(--cream-mid);
          width: 46px; height: 46px;
          border-radius: 12px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .icon-btn-bordered:hover {
          border-color: var(--maroon);
          background: var(--cream-dark);
          transform: translateY(-2px);
        }

        /* ── Cart button ── */
        .cart-btn {
          position: relative;
          background: var(--maroon);
          border: 2px solid var(--maroon);
          width: 44px; height: 44px;
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          flex-shrink: 0;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(107, 30, 46, 0.25);
        }
        .cart-btn:hover {
          background: var(--maroon-deep);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(107, 30, 46, 0.35);
        }

        /* ── Cart badge ── */
        .cart-badge {
          position: absolute; top: -6px; right: -6px;
          background: var(--gold); color: var(--text);
          border-radius: 50%; width: 20px; height: 20px;
          font-size: 10px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid var(--white);
          font-family: Outfit, sans-serif;
          box-shadow: 0 2px 8px rgba(201, 168, 76, 0.4);
        }

        /* ── Desktop nav link ── */
        .desktop-nav-link {
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 14px;
          padding: 10px 18px;
          border-radius: 10px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .desktop-nav-link:hover {
          color: var(--maroon);
          background: var(--cream-dark);
        }

        /* ── Mobile search slide-down ── */
        .mobile-search-bar {
          max-height: 0;
          overflow: hidden;
          padding: 0 16px;
          transition: max-height 0.3s ease, padding 0.3s ease;
        }
        .mobile-search-bar.open {
          max-height: 80px;
          padding: 8px 16px 14px;
        }
        @media (min-width: 1025px) {
          .mobile-search-bar { display: none; }
        }

        /* ── Drawer link ── */
        .drawer-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          border-radius: 12px;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 15px;
          font-family: "Plus Jakarta Sans", sans-serif;
          background: var(--cream-dark);
          border: 1px solid var(--cream-mid);
          transition: all 0.2s ease;
        }
        .drawer-link:hover {
          background: var(--maroon);
          color: var(--white);
          border-color: var(--maroon);
        }
        .drawer-link:hover svg { color: var(--white); }
      `}</style>
    </>
  );
}