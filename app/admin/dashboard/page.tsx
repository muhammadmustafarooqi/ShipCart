"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingBag, TrendingUp, Clock, ArrowRight } from "lucide-react";

interface DashboardData {
  todayOrders: number;
  weekOrders: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: Array<{
    orderId: string;
    customerName: string;
    phone: string;
    city: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "status-pending",
  Confirmed: "status-confirmed",
  Shipped: "status-shipped",
  Delivered: "status-delivered",
  Cancelled: "status-cancelled",
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  const stats = [
    {
      label: "Today's Orders",
      value: data?.todayOrders || 0,
      icon: <ShoppingBag size={24} color="white" />,
      bg: "linear-gradient(135deg, #ff6b00, #e55a00)",
      sub: "Orders placed today",
    },
    {
      label: "This Week",
      value: data?.weekOrders || 0,
      icon: <TrendingUp size={24} color="white" />,
      bg: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
      sub: "Orders this week",
    },
    {
      label: "Pending Orders",
      value: data?.pendingOrders || 0,
      icon: <Clock size={24} color="white" />,
      bg: "linear-gradient(135deg, #f59e0b, #d97706)",
      sub: "Require attention",
    },
    {
      label: "Total Revenue",
      value: `Rs. ${(data?.totalRevenue || 0).toLocaleString()}`,
      icon: <TrendingUp size={24} color="white" />,
      bg: "linear-gradient(135deg, #10b981, #059669)",
      sub: "From confirmed orders",
    },
    {
      label: "Total Products",
      value: data?.totalProducts || 0,
      icon: <Package size={24} color="white" />,
      bg: "linear-gradient(135deg, #06b6d4, #0284c7)",
      sub: "Active products",
    },
    {
      label: "Total Orders",
      value: data?.totalOrders || 0,
      icon: <ShoppingBag size={24} color="white" />,
      bg: "linear-gradient(135deg, #1a1a2e, #16213e)",
      sub: "All time orders",
    },
  ];

  return (
    <div style={{ padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937", marginBottom: "4px" }}>
          Dashboard
        </h1>
        <p style={{ color: "#6b7280", fontSize: "15px" }}>
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "36px",
      }}>
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px", fontWeight: 500 }}>
                  {stat.label}
                </p>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937" }}>
                  {stat.value}
                </div>
              </div>
              <div style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: stat.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              }}>
                {stat.icon}
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1f2937" }}>Recent Orders</h2>
          <Link href="/admin/orders" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ff6b00", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
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
            <ShoppingBag size={40} color="#e5e7eb" style={{ margin: "0 auto 12px" }} />
            <p>No orders yet. Share your store to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
