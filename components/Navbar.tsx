"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ArrowRight,
  User,
  Heart,
} from "lucide-react";
import { NavLogo } from "@/components/BrandLogo";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import { useSettings } from "@/lib/useSettings";
import { fbq } from "@/lib/fpq";

const DEFAULT_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/products" },
  { label: "Kitchen", href: "/products?category=kitchen-cooking" },
  { label: "Personal Care", href: "/products?category=personal-care-beauty" },
  { label: "Electronics", href: "/products?category=electronics-gadgets" },
  { label: "Track Order", href: "/track-order" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { settings, loading: settingsLoading } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const navLinks = settings?.navbar?.links || DEFAULT_LINKS;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fbq("track", "Search", { search_string: searchQuery });
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className="nav-shell"
        data-scrolled={scrolled ? "true" : "false"}
        aria-label="Main"
      >
        <div className="nav-shell-accent" aria-hidden />
        <div className="page-container">
          {/* ── MOBILE HEADER: left actions | centered logo | right actions ── */}
          <div className="mobile-header">
            <div className="mobile-header-left">
              <button
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  setSearchOpen(false);
                }}
                className="icon-btn"
                aria-label="Menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link
                href="/wishlist"
                className="icon-btn"
                aria-label={`Wishlist (${wishlistCount})`}
                style={{
                  position: "relative",
                  textDecoration: "none",
                  color: "var(--maroon)",
                }}
              >
                <Heart
                  size={20}
                  fill={wishlistCount > 0 ? "currentColor" : "none"}
                />
                {wishlistCount > 0 && (
                  <span
                    className="cart-badge"
                    style={{
                      background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                    }}
                  >
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>
            </div>

            <Link
              href="/"
              className="logo-center nav-logo-link"
              aria-label="ShipCart Store, home"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <NavLogo height={48} maxWidth={130} className="nav-logo-mobile" />
            </Link>

            <div className="mobile-header-right">
              <Link href="/cart" className="cart-btn" aria-label="Cart">
                <ShoppingCart size={20} color="var(--white)" />
                {totalItems > 0 && (
                  <span className="cart-badge">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  setMenuOpen(false);
                }}
                className="icon-btn"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* ── DESKTOP HEADER ── */}
          <div className="desktop-header">
            {/* Logo only — no wordmark */}
            <Link
              href="/"
              aria-label="ShipCart Store, home"
              className="nav-logo-link"
            >
              <NavLogo height={64} maxWidth={220} />
            </Link>

            {/* Nav links — pill rail */}
            <div className="nav-pill-rail">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="desktop-nav-link"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="nav-actions-desktop">
              <form onSubmit={handleSearchSubmit} className="nav-search-form">
                <Search size={16} color="var(--maroon-soft)" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="nav-search-input"
                />
              </form>

              <Link
                href="/auth/login"
                className="icon-btn-bordered"
                aria-label="Account"
              >
                <User size={20} color="var(--maroon)" />
              </Link>

              <Link
                href="/wishlist"
                className="icon-btn-bordered"
                aria-label={`Wishlist (${wishlistCount})`}
                style={{ position: "relative", color: "var(--maroon)" }}
              >
                <Heart
                  size={20}
                  fill={wishlistCount > 0 ? "currentColor" : "none"}
                />
                {wishlistCount > 0 && (
                  <span
                    className="cart-badge"
                    style={{
                      background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                    }}
                  >
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
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
          <form
            onSubmit={handleSearchSubmit}
            className="nav-search-form nav-search-form--mobile"
          >
            <Search size={17} color="var(--maroon-soft)" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={searchOpen}
              className="nav-search-input nav-search-input--mobile"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  display: "flex",
                }}
              >
                <X size={16} />
              </button>
            )}
          </form>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`mobile-drawer nav-mobile-drawer ${menuOpen ? "open" : ""}`}
        style={{
          position: "fixed",
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
          <div
            style={{
              fontSize: "11px",
              color: "var(--text-secondary)",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              paddingLeft: "4px",
              marginBottom: "14px",
            }}
          >
            Navigate
          </div>

          {/* Links */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "36px",
            }}
          >
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
          className="nav-menu-overlay"
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(42, 21, 24, 0.45)",
            zIndex: 98,
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      <style>{`
        /* ── Shell: floating bar + accent ── */
        .nav-mobile-drawer {
          top: calc(72px + var(--announcement-h, 0px));
          width: 100% !important;
          max-width: none !important;
          border-right: none !important;
        }
        .nav-menu-overlay {
          top: calc(72px + var(--announcement-h, 0px));
        }

        .nav-shell {
          position: sticky;
          top: var(--announcement-h, 0px);
          z-index: 100;
          isolation: isolate;
          background: linear-gradient(180deg, rgba(255, 253, 249, 0.99) 0%, rgba(250, 243, 232, 0.94) 100%);
          backdrop-filter: blur(16px) saturate(1.2);
          -webkit-backdrop-filter: blur(16px) saturate(1.2);
          border-bottom: 1px solid rgba(232, 216, 188, 0.65);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.7) inset, 0 8px 32px rgba(42, 21, 24, 0.06);
          transition: box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease;
        }
        .nav-shell[data-scrolled="true"] {
          background: rgba(255, 253, 249, 0.97);
          border-bottom-color: var(--cream-mid);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.5) inset,
            0 12px 40px rgba(42, 21, 24, 0.1);
        }
        .nav-shell-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(
            90deg,
            var(--maroon-deep) 0%,
            var(--maroon) 22%,
            var(--gold) 50%,
            var(--maroon) 78%,
            var(--maroon-deep) 100%
          );
          opacity: 0.95;
          pointer-events: none;
        }

        /* ── Layout helpers ── */
        .page-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
        }

        /* ── Mobile: equal side columns so logo stays truly centered ── */
        .mobile-header {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: center;
          column-gap: 8px;
          height: 72px;
          width: 100%;
          min-width: 0;
        }

        .mobile-header-left,
        .mobile-header-right {
          display: flex;
          align-items: center;
          gap: 4px;
          min-width: 0;
        }

        .mobile-header-left {
          grid-column: 1;
          justify-content: flex-start;
          justify-self: start;
        }

        .mobile-header-right {
          grid-column: 3;
          justify-content: flex-end;
          justify-self: end;
        }

        .desktop-header { display: none; }

        @media (min-width: 1025px) {
          .mobile-header { display: none; }
          .desktop-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            height: 88px;
            min-width: 0;
          }
          .page-container { padding: 0 32px; }
        }

        /* ── Logo: center grid column (between equal 1fr sides) ── */
        .logo-center {
          grid-column: 2;
          justify-self: center;
          display: flex !important;
          justify-content: center;
          align-items: center;
          max-width: min(120px, 36vw);
          min-width: 0;
          flex-shrink: 0;
        }

        .nav-logo-mobile {
          width: min(120px, 36vw) !important;
          max-width: 100% !important;
        }

        @media (max-width: 1024px) {
          .nav-shell .page-container {
            padding: 0 10px;
            max-width: 100%;
          }
        }

        @media (max-width: 380px) {
          .mobile-header {
            height: 68px;
          }
          .mobile-header-left,
          .mobile-header-right {
            gap: 2px;
          }
          .icon-btn {
            width: 36px;
            height: 36px;
          }
          .cart-btn {
            width: 38px;
            height: 38px;
          }
        }

        .nav-logo-link {
          text-decoration: none;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }
        .nav-logo-link:hover {
          transform: scale(1.04);
        }
        .nav-logo-link:active {
          transform: scale(0.98);
        }
        .logo-center.nav-logo-link:hover {
          transform: scale(1.04);
        }
        .logo-center.nav-logo-link:active {
          transform: scale(0.98);
        }

        /* ── Desktop: pill rail + search row ── */
        .nav-pill-rail {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          gap: 2px;
          padding: 5px 6px;
          margin: 0 4px;
          max-width: min(720px, 52vw);
          min-width: 0;
          margin-left: auto;
          margin-right: auto;
          background: rgba(107, 30, 46, 0.06);
          border: 1px solid rgba(107, 30, 46, 0.1);
          border-radius: 999px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          scrollbar-width: thin;
        }
        .nav-pill-rail::-webkit-scrollbar {
          height: 4px;
        }
        .nav-pill-rail::-webkit-scrollbar-thumb {
          background: rgba(107, 30, 46, 0.25);
          border-radius: 99px;
        }
        .nav-actions-desktop {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .nav-search-form {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          min-width: 96px;
          flex: 1 1 120px;
          max-width: 240px;
          background: var(--white);
          border-radius: 999px;
          border: 1px solid var(--cream-mid);
          box-shadow: inset 0 2px 4px rgba(42, 21, 24, 0.04);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .nav-search-form:focus-within {
          border-color: rgba(107, 30, 46, 0.35);
          box-shadow:
            inset 0 2px 4px rgba(42, 21, 24, 0.04),
            0 0 0 3px rgba(201, 168, 76, 0.25);
        }
        .nav-search-form--mobile {
          width: 100%;
          max-width: none;
          flex: none;
          padding: 12px 18px;
          border-radius: 14px;
        }
        .nav-search-input {
          flex: 1;
          min-width: 0;
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          font-family: "Plus Jakarta Sans", sans-serif;
        }
        .nav-search-input::placeholder { color: var(--text-secondary); opacity: 0.85; }
        .nav-search-input--mobile { font-size: 15px; }

        /* ── Icon button ── */
        .icon-btn {
          background: rgba(107, 30, 46, 0.07);
          border: 1px solid transparent;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          color: var(--maroon);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
          flex-shrink: 0;
        }
        .icon-btn:hover {
          background: rgba(107, 30, 46, 0.12);
          border-color: rgba(107, 30, 46, 0.12);
          transform: scale(1.04);
        }

        .icon-btn-bordered {
          background: var(--white);
          border: 1px solid var(--cream-mid);
          width: 46px;
          height: 46px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.22s ease;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(42, 21, 24, 0.06);
        }
        .icon-btn-bordered:hover {
          border-color: var(--maroon-soft);
          background: var(--cream-dark);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(107, 30, 46, 0.12);
        }

        /* ── Cart button ── */
        .cart-btn {
          position: relative;
          background: linear-gradient(145deg, var(--maroon) 0%, var(--maroon-deep) 100%);
          border: 1px solid rgba(201, 168, 76, 0.35);
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          flex-shrink: 0;
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
          box-shadow:
            0 4px 14px rgba(107, 30, 46, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }
        .cart-btn:hover {
          filter: brightness(1.06);
          transform: translateY(-2px) scale(1.02);
          box-shadow:
            0 8px 22px rgba(107, 30, 46, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        /* ── Cart badge ── */
        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: linear-gradient(135deg, var(--gold), #d4b45c);
          color: var(--text);
          border-radius: 50%;
          width: 21px;
          height: 21px;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--white);
          font-family: Outfit, sans-serif;
          box-shadow: 0 2px 8px rgba(201, 168, 76, 0.45);
        }

        /* ── Desktop nav link (inside pill rail) ── */
        .desktop-nav-link {
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 13px;
          padding: 9px 16px;
          border-radius: 999px;
          transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          white-space: nowrap;
        }
        .desktop-nav-link:hover {
          color: var(--maroon);
          background: rgba(255, 253, 249, 0.95);
          box-shadow: 0 1px 3px rgba(42, 21, 24, 0.08);
        }

        @media (min-width: 1025px) and (max-width: 1320px) {
          .desktop-nav-link {
            font-size: 12px;
            padding: 8px 12px;
          }
          .nav-pill-rail {
            max-width: min(560px, 48vw);
          }
          .nav-actions-desktop {
            gap: 8px;
          }
        }

        /* ── Mobile search slide-down ── */
        .mobile-search-bar {
          max-height: 0;
          overflow: hidden;
          padding: 0 16px;
          transition: max-height 0.3s ease, padding 0.3s ease;
        }
        .mobile-search-bar.open {
          max-height: 88px;
          padding: 8px 16px 16px;
        }
        @media (min-width: 1025px) {
          .mobile-search-bar { display: none; }
        }

        /* ── Drawer link ── */
        .drawer-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 18px;
          border-radius: 14px;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 15px;
          font-family: "Plus Jakarta Sans", sans-serif;
          background: var(--white);
          border: 1px solid var(--cream-mid);
          box-shadow: 0 2px 8px rgba(42, 21, 24, 0.04);
          transition: all 0.22s ease;
        }
        .drawer-link:hover {
          background: var(--maroon);
          color: var(--white);
          border-color: var(--maroon);
          transform: translateX(4px);
        }
        .drawer-link:hover svg { color: var(--white); }
      `}</style>
    </>
  );
}
