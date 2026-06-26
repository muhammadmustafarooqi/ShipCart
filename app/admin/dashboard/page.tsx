"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingBag, TrendingUp, Clock, ArrowRight, Banknote, ListOrdered, Users, ShoppingCart, HelpCircle } from "lucide-react";

interface DashboardData {
  todayOrders: number;
  yesterdayOrders: number;
  weekOrders: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalRevenue: number;
  todayRevenue: number;
  yesterdayRevenue: number;
  activeVisitorsCount: number;
  todayVisitorsCount: number;
  yesterdayVisitorsCount: number;
  funnel: {
    total: number;
    cart: number;
    checkout: number;
    ordered: number;
  };
  abandonedCartsCount: number;
  abandonedCheckoutsCount: number;
  recentOrders: Array<{
    orderId: string;
    customerName: string;
    phone: string;
    city: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  recentSessions: Array<{
    sessionId: string;
    userAgent: string;
    referrer: string;
    hasCart: boolean;
    hasCheckout: boolean;
    hasOrdered: boolean;
    lastActive: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "status-pending",
  Confirmed: "status-confirmed",
  Shipped: "status-shipped",
  Delivered: "status-delivered",
  Cancelled: "status-cancelled",
};

function parseUserAgent(ua: string) {
  if (!ua) return { os: "Unknown", browser: "Unknown" };
  let os = "Desktop";
  let browser = "Web Browser";

  if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/macintosh/i.test(ua)) os = "macOS";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/linux/i.test(ua)) os = "Linux";

  if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/msie|trident/i.test(ua)) browser = "IE";

  return { os, browser };
}

function getPercentageChange(today: number, yesterday: number) {
  if (yesterday === 0) {
    return today > 0 ? "+100%" : "0%";
  }
  const diff = today - yesterday;
  const pct = Math.round((diff / yesterday) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
}

function renderPercentageBadge(value: string) {
  if (value.startsWith("+")) {
    return (
      <span style={{ color: "#10b981", fontSize: "11px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "2px", background: "rgba(16, 185, 129, 0.1)", padding: "2px 8px", borderRadius: "100px" }}>
        ↑ {value}
      </span>
    );
  } else if (value.startsWith("-")) {
    return (
      <span style={{ color: "#ef4444", fontSize: "11px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "2px", background: "rgba(239, 68, 68, 0.1)", padding: "2px 8px", borderRadius: "100px" }}>
        ↓ {value}
      </span>
    );
  }
  return (
    <span style={{ color: "#6b7280", fontSize: "11px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "2px", background: "rgba(107, 114, 128, 0.1)", padding: "2px 8px", borderRadius: "100px" }}>
      {value}
    </span>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = () => {
      fetch("/api/admin/dashboard")
        .then((r) => r.json())
        .then((d) => setData(d))
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    fetchDashboard();
    
    // Poll for status updates every 30 seconds
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  // Comparison metrics calculations
  const salesPct = getPercentageChange(data?.todayRevenue || 0, data?.yesterdayRevenue || 0);
  const ordersPct = getPercentageChange(data?.todayOrders || 0, data?.yesterdayOrders || 0);

  const stats = [
    {
      label: "Today's Sales",
      value: `Rs. ${(data?.todayRevenue || 0).toLocaleString()}`,
      icon: <Banknote size={24} />,
      bg: "linear-gradient(135deg, #ff6b00, #e55a00)",
      sub: `Yesterday: Rs. ${(data?.yesterdayRevenue || 0).toLocaleString()}`,
      pct: salesPct,
    },
    {
      label: "Today's Orders",
      value: data?.todayOrders || 0,
      icon: <ShoppingBag size={24} />,
      bg: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
      sub: `Yesterday: ${data?.yesterdayOrders || 0} orders`,
      pct: ordersPct,
    },
    {
      label: "Pending Orders",
      value: data?.pendingOrders || 0,
      icon: <Clock size={24} />,
      bg: "linear-gradient(135deg, #f59e0b, #d97706)",
      sub: "Require quick action",
      pct: null,
    },
    {
      label: "Total Products",
      value: data?.totalProducts || 0,
      icon: <Package size={24} />,
      bg: "linear-gradient(135deg, #06b6d4, #0284c7)",
      sub: "Active in catalog",
      pct: null,
    },
    {
      label: "Total Revenue (All Time)",
      value: `Rs. ${(data?.totalRevenue || 0).toLocaleString()}`,
      icon: <Banknote size={24} />,
      bg: "linear-gradient(135deg, #1a1a2e, #16213e)",
      sub: "All confirmed orders",
      pct: null,
    },
  ];

  return (
    <div className="admin-page-container" style={{ maxWidth: "1450px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", marginBottom: "40px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#1f2937", marginBottom: "8px", fontFamily: "Outfit, sans-serif" }}>
            Dashboard
          </h1>
          <p style={{ color: "#6b7280", fontSize: "15px", fontWeight: 500 }}>
            Welcome back! Here&apos;s a detailed overview of your store performance.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "24px",
        marginBottom: "40px",
      }}>
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "135px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px", fontWeight: 600 }}>
                    {stat.label}
                  </p>
                  <div className="stat-card-value" style={{ fontSize: "26px", fontWeight: 800, color: "#1f2937" }}>
                    {stat.value}
                  </div>
                </div>
                <div className="stat-card-icon" style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: stat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  color: "white",
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f9fafb", paddingTop: "8px", marginTop: "4px" }}>
              <p style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>{stat.sub}</p>
              {stat.pct !== null && renderPercentageBadge(stat.pct)}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section (Full Width) */}
      <div style={{ background: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1f2937", fontFamily: "Outfit, sans-serif" }}>Recent Orders</h2>
          <Link href="/admin/orders" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ff6b00", textDecoration: "none", fontSize: "14px", fontWeight: 700, transition: "all 0.2s ease" }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {data?.recentOrders && data.recentOrders.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>City</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td>
                      <span style={{ fontWeight: 700, color: "#ff6b00" }}>#{order.orderId}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: "13px" }}>{order.customerName}</div>
                      <div style={{ fontSize: "12px", color: "#9ca3af" }}>{order.phone}</div>
                    </td>
                    <td style={{ fontSize: "13px" }}>{order.city}</td>
                    <td style={{ fontWeight: 700, color: "#1f2937" }}>Rs. {order.total.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px", color: "#9ca3af" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-PK")}
                    </td>
                    <td>
                      <Link
                        href={`/admin/orders?id=${order.orderId}`}
                        style={{ color: "#ff6b00", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
            <ShoppingBag size={40} style={{ margin: "0 auto 12px", color: "#e5e7eb" }} />
            <p>No orders yet. Share your store to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
