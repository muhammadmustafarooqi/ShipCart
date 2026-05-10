"use client";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fa", overflow: "hidden" }}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-content" style={{ flex: 1, overflowY: "auto" }}>
        <button
          onClick={() => setSidebarOpen(true)}
          className="mobile-menu-btn"
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 100,
            background: "linear-gradient(135deg, #1a1a2e, #16213e)",
            border: "none",
            borderRadius: "12px",
            width: "48px",
            height: "48px",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <Menu size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}
