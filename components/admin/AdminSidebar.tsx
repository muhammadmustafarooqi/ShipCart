"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Image as ImageIcon,
  Settings,
  LogOut,
  Store,
  Users,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="admin-sidebar">
      {/* Logo */}
      <div style={{ padding: "28px 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            background: "white",
          }}>
            <Image 
              src="/logo.webp" 
              alt="AllInOne Store Logo" 
              width={40} 
              height={40}
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
          </div>
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
  );
}
