"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BrandLogoMark } from "@/components/BrandLogo";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Image as ImageIcon,
  Settings,
  LogOut,
  Store,
  Users,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && <div className="admin-overlay" onClick={onClose} />}
      <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div style={{ padding: "28px 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "relative" }}>
        <button
          onClick={onClose}
          className="mobile-close-btn"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: "8px",
            width: "32px",
            height: "32px",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
          }}
        >
          <X size={18} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <BrandLogoMark size={48} tone="elevated" decorative />
          <div>
            <div style={{ fontWeight: 800, fontSize: "16px", color: "white" }}>
              ALLIn<span style={{ color: "#ff6b00" }}>ONE</span>
            </div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>
              ADMIN PANEL
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 0" }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={onClose}
            >
              <Icon size={18} strokeWidth={2} style={{ color: isActive ? "#ff6b00" : "rgba(255,255,255,0.7)" }} />
              <span>{item.label}</span>
              {isActive && (
                <div style={{
                  marginLeft: "auto",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#ff6b00",
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Link
          href="/"
          className="nav-item"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          <Store size={18} strokeWidth={2} style={{ color: "rgba(255,255,255,0.7)" }} />
          <span>View Store</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="nav-item"
          style={{
            width: "100%",
            cursor: "pointer",
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.7)",
            fontFamily: "Poppins, sans-serif",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
          }}
        >
          <LogOut size={18} strokeWidth={2} style={{ color: "rgba(255,255,255,0.7)" }} />
          <span>Sign Out</span>
        </button>
      </div>
      </div>
    </>
  );
}
