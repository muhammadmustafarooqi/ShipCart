"use client";

import { useEffect, useState } from "react";
import { Users, Phone, MapPin, ShoppingBag, Calendar, Wallet } from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, totalRevenue: 0 });

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((data) => {
        setCustomers(data.customers || []);
        setStats(data.stats || { total: 0, active: 0, totalRevenue: 0 });
      })
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

  return (
    <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#1f2937", marginBottom: "8px", fontFamily: "Outfit, sans-serif" }}>
          Customers
        </h1>
        <p style={{ color: "#6b7280", fontSize: "15px", fontWeight: 500 }}>
          Manage and view all your customers
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "48px" }}>
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px", fontWeight: 500 }}>Total Customers</p>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937" }}>{stats.total}</div>
            </div>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(99,102,241,0.3)", color: "white" }}>
              <Users size={24} />
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#9ca3af" }}>Registered customers</p>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px", fontWeight: 500 }}>Active Customers</p>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937" }}>{stats.active}</div>
            </div>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(16,185,129,0.3)", color: "white" }}>
              <ShoppingBag size={24} />
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#9ca3af" }}>With orders</p>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px", fontWeight: 500 }}>Total Revenue</p>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937" }}>Rs. {stats.totalRevenue.toLocaleString()}</div>
            </div>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, #f59e0b, #d97706)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(245,158,11,0.3)", color: "white" }}>
              <Wallet size={24} aria-hidden />
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#9ca3af" }}>From all customers</p>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1f2937", marginBottom: "24px", fontFamily: "Outfit, sans-serif" }}>All Customers</h2>

        {customers.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Last Order</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "14px" }}>
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: "14px", color: "#1f2937" }}>{customer.name}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6b7280" }}>
                        <Phone size={12} style={{ color: "#9ca3af" }} />
                        {customer.phone}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6b7280" }}>
                        <MapPin size={12} style={{ color: "#9ca3af" }} />
                        {customer.city}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f3f4f6", padding: "4px 12px", borderRadius: "20px" }}>
                        <ShoppingBag size={12} style={{ color: "#6b7280" }} />
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#1f2937" }}>{customer.totalOrders}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: "#10b981", fontSize: "14px" }}>Rs. {customer.totalSpent.toLocaleString()}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#9ca3af" }}>
                        <Calendar size={12} />
                        {new Date(customer.lastOrderDate).toLocaleDateString("en-PK")}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
            <Users size={48} style={{ margin: "0 auto 16px", color: "#e5e7eb" }} />
            <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>No customers yet</p>
            <p style={{ fontSize: "14px" }}>Customers will appear here once they place orders</p>
          </div>
        )}
      </div>
    </div>
  );
}
