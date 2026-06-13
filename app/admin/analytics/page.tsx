"use client";

import { useEffect, useState } from "react";
import { TrendingUp, RefreshCw, Users, ShoppingBag, Landmark, Activity, ChevronRight, Globe, Monitor, Compass, Award, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface SalesTrendItem {
  date: string;
  revenue: number;
}

interface FunnelData {
  totalSessions: number;
  sessionsWithCart: number;
  sessionsWithCheckout: number;
  sessionsWithOrder: number;
  cartRate: number;
  checkoutRate: number;
  purchaseRate: number;
  overallConversionRate: number;
}

interface DeviceItem {
  name: string;
  count: number;
}

interface GeographyItem {
  city: string;
  visitors: number;
}

interface ChannelItem {
  name: string;
  value: number;
}

interface ProductItem {
  name: string;
  quantity: number;
  revenue: number;
}

interface PageItem {
  path: string;
  views: number;
}

interface AnalyticsData {
  activeSessions: number;
  totalRevenue: number;
  aov: number;
  rcr: number;
  salesTrend: SalesTrendItem[];
  funnel: FunnelData;
  devices: DeviceItem[];
  geography: GeographyItem[];
  channels: ChannelItem[];
  topProducts: ProductItem[];
  topPages: PageItem[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) throw new Error();
      const report = await res.json();
      setData(report);
    } catch {
      toast.error("Failed to load analytics reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "var(--text-primary)" }}>No data available</h2>
        <button onClick={fetchAnalytics} className="btn-primary" style={{ marginTop: "16px" }}>
          Retry
        </button>
      </div>
    );
  }

  // Calculate highest revenue in sales trend to scale visual chart bars
  const maxRevenue = Math.max(...data.salesTrend.map((t) => t.revenue), 1000);

  const totalChannelValues = data.channels.reduce((sum, c) => sum + c.value, 0) || 1;
  const totalDeviceCount = data.devices.reduce((sum, d) => sum + d.count, 0) || 1;
  const totalGeoCount = data.geography.reduce((sum, g) => sum + g.visitors, 0) || 1;

  return (
    <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto", color: "var(--text-primary)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px", fontFamily: "Outfit, sans-serif" }}>
            Analytics & Reports
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px", fontWeight: 500 }}>
            Real-time session diagnostics and 30-day performance milestones.
          </p>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px" }}
        >
          <RefreshCw size={15} /> Refresh Data
        </button>
      </div>

      {/* Real-time Indicator Widget */}
      <div style={{
        background: "rgba(16, 185, 129, 0.08)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        borderRadius: "16px",
        padding: "16px 24px",
        marginBottom: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            position: "relative",
            display: "inline-flex",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "#10b981",
          }}>
            <span style={{
              position: "absolute",
              display: "inline-flex",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "#10b981",
              opacity: 0.75,
              animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
            }} />
          </span>
          <span style={{ fontWeight: 700, fontSize: "15px", color: "#065f46" }}>Live Store Activity</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span style={{ fontSize: "28px", fontWeight: 900, color: "#065f46" }}>{data.activeSessions}</span>
          <span style={{ fontSize: "14px", color: "#065f46", fontWeight: 500 }}>active visitors in last 5m</span>
        </div>
      </div>

      {/* Main KPI Stats Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "24px",
        marginBottom: "48px"
      }}>
        {/* KPI 1: Active Sessions */}
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Active Sessions
              </p>
              <div style={{ fontSize: "28px", fontWeight: 800 }}>{data.activeSessions}</div>
            </div>
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(16,185,129,0.2)",
              color: "white"
            }}>
              <Activity size={24} />
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Active right now in real-time</p>
        </div>

        {/* KPI 2: Total Revenue */}
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                30d Revenue
              </p>
              <div style={{ fontSize: "28px", fontWeight: 800 }}>Rs. {data.totalRevenue.toLocaleString()}</div>
            </div>
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(59,130,246,0.2)",
              color: "white"
            }}>
              <Landmark size={24} />
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>From confirmed / shipped orders</p>
        </div>

        {/* KPI 3: AOV */}
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Avg Order Value
              </p>
              <div style={{ fontSize: "28px", fontWeight: 800 }}>Rs. {data.aov.toLocaleString()}</div>
            </div>
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(245,158,11,0.2)",
              color: "white"
            }}>
              <ShoppingBag size={24} />
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Average spending per purchase</p>
        </div>

        {/* KPI 4: Repeat Customer Rate */}
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Repeat Customers
              </p>
              <div style={{ fontSize: "28px", fontWeight: 800 }}>{data.rcr}%</div>
            </div>
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(139,92,246,0.2)",
              color: "white"
            }}>
              <Users size={24} />
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Purchasing more than once</p>
        </div>
      </div>

      {/* Visual Chart: 30-Day Revenue Trend (CSS Grid & Hover Tooltips) */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "24px",
        padding: "32px",
        boxShadow: "var(--shadow-md)",
        marginBottom: "48px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, fontFamily: "Outfit, sans-serif" }}>Sales Revenue Trend (Shopify Style)</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>Daily sales figures aggregate over the past 30 days.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 700, color: "#3b82f6" }}>
            <TrendingUp size={14} /> 30-Day View
          </div>
        </div>

        {/* Pure CSS Bar Chart Component */}
        <div style={{
          display: "flex",
          height: "240px",
          alignItems: "flex-end",
          gap: "6px",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--border-default)",
          position: "relative"
        }}>
          {data.salesTrend.map((trend, index) => {
            const pct = (trend.revenue / maxRevenue) * 100;
            return (
              <div 
                key={index} 
                className="chart-bar-container"
                style={{
                  flex: 1,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                {/* Visual Bar */}
                <div 
                  className="chart-bar"
                  style={{
                    width: "100%",
                    height: `${Math.max(pct, 2.5)}%`, // min height of 2.5% to display zero values nicely
                    background: trend.revenue > 0 ? "linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)" : "rgba(226, 232, 240, 0.5)",
                    borderRadius: "4px 4px 0 0",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />

                {/* Floating CSS Tooltip on Hover */}
                <div 
                  className="chart-tooltip"
                  style={{
                    position: "absolute",
                    bottom: `${Math.min(pct + 8, 85)}%`,
                    background: "#0f172a",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 20,
                    opacity: 0,
                    pointerEvents: "none",
                    transition: "opacity 0.2s ease, transform 0.2s ease",
                    transform: "translateY(5px)",
                  }}
                >
                  <div style={{ color: "#94a3b8", marginBottom: "2px" }}>{trend.date}</div>
                  <div style={{ fontWeight: 800, color: "#38bdf8" }}>Rs. {trend.revenue.toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* X Axis Labels (First, middle, and last date) */}
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "12px", marginTop: "12px", fontWeight: 600 }}>
          <span>{data.salesTrend[0]?.date}</span>
          <span>{data.salesTrend[Math.floor(data.salesTrend.length / 2)]?.date}</span>
          <span>{data.salesTrend[data.salesTrend.length - 1]?.date}</span>
        </div>
      </div>

      {/* Main Grid: Left details column, Right conversions/acquisition details column */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "32px", marginBottom: "48px" }} className="admin-analytics-grid">
        {/* Left Column Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          {/* Conversion Funnel Widget */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "var(--shadow-md)"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "28px", fontFamily: "Outfit, sans-serif" }}>
              Purchase Conversion Funnel
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Funnel Stage 1: Sessions */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "120px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  1. Sessions
                </div>
                <div style={{ flex: 1, position: "relative", height: "36px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "100%", background: "#4f46e5", borderRadius: "10px" }} />
                  <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "white", fontSize: "13px", fontWeight: 800 }}>
                    {data.funnel.totalSessions} Sessions
                  </span>
                </div>
                <div style={{ width: "80px", textAlign: "right", fontSize: "14px", fontWeight: 700 }}>100%</div>
              </div>

              {/* Funnel Stage 2: Added to Cart */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "120px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  2. Added to Cart
                </div>
                <div style={{ flex: 1, position: "relative", height: "36px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${data.funnel.cartRate}%`, background: "#3b82f6", borderRadius: "10px" }} />
                  <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: data.funnel.cartRate > 30 ? "white" : "var(--text-primary)", fontSize: "13px", fontWeight: 800 }}>
                    {data.funnel.sessionsWithCart} Sessions
                  </span>
                </div>
                <div style={{ width: "80px", textAlign: "right", fontSize: "14px", fontWeight: 700, color: "#3b82f6" }}>
                  {data.funnel.cartRate}%
                </div>
              </div>

              {/* Funnel Stage 3: Checked Out */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "120px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  3. Checkout Inits
                </div>
                <div style={{ flex: 1, position: "relative", height: "36px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${data.funnel.overallConversionRate > 0 ? (data.funnel.sessionsWithCheckout / data.funnel.totalSessions) * 100 : 0}%`, background: "#f59e0b", borderRadius: "10px" }} />
                  <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-primary)", fontSize: "13px", fontWeight: 800 }}>
                    {data.funnel.sessionsWithCheckout} Sessions
                  </span>
                </div>
                <div style={{ width: "80px", textAlign: "right", fontSize: "14px", fontWeight: 700, color: "#f59e0b" }}>
                  {data.funnel.checkoutRate}% <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-secondary)" }}>of cart</span>
                </div>
              </div>

              {/* Funnel Stage 4: Purchases */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "120px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  4. Purchased
                </div>
                <div style={{ flex: 1, position: "relative", height: "36px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${data.funnel.overallConversionRate}%`, background: "#10b981", borderRadius: "10px" }} />
                  <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-primary)", fontSize: "13px", fontWeight: 800 }}>
                    {data.funnel.sessionsWithOrder} Orders
                  </span>
                </div>
                <div style={{ width: "80px", textAlign: "right", fontSize: "14px", fontWeight: 700, color: "#10b981" }}>
                  {data.funnel.overallConversionRate}% <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-secondary)" }}>total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Selling Products */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "var(--shadow-md)"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px", fontFamily: "Outfit, sans-serif" }}>
              <Award size={18} color="#f59e0b" /> Top 5 Performing Products
            </h3>
            
            {data.topProducts.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product Title</th>
                    <th style={{ textAlign: "center" }}>Qty Sold</th>
                    <th style={{ textAlign: "right" }}>Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProducts.map((p, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, fontSize: "13px" }}>{p.name}</td>
                      <td style={{ textAlign: "center", fontWeight: 700, color: "#4f46e5" }}>{p.quantity}</td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "var(--text-primary)" }}>Rs. {p.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: "center", padding: "24px", color: "var(--text-secondary)", fontSize: "14px" }}>
                No product transactions recorded in the last 30 days.
              </p>
            )}
          </div>

          {/* Top Visited Landing Pages */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "var(--shadow-md)"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px", fontFamily: "Outfit, sans-serif" }}>
              <FileText size={18} color="#3b82f6" /> Top 5 Pages By Views
            </h3>
            
            {data.topPages.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Page Route</th>
                    <th style={{ textAlign: "right" }}>Total Page Views</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPages.map((page, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--text-secondary)" }}>{page.path}</td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "#3b82f6" }}>{page.views} views</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: "center", padding: "24px", color: "var(--text-secondary)", fontSize: "14px" }}>
                No page views logged yet. Ensure the tracker script is active.
              </p>
            )}
          </div>
        </div>

        {/* Right Column Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          {/* Traffic Channels */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "var(--shadow-md)"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontFamily: "Outfit, sans-serif" }}>
              <Compass size={16} color="#8b5cf6" /> Traffic Channels
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {data.channels.map((chan) => {
                const pct = totalChannelValues > 0 ? (chan.value / totalChannelValues) * 100 : 0;
                return (
                  <div key={chan.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
                      <span style={{ color: "var(--text-secondary)" }}>{chan.name}</span>
                      <span>{chan.value} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "#8b5cf6", borderRadius: "4px" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Device Breakdown */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "var(--shadow-md)"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontFamily: "Outfit, sans-serif" }}>
              <Monitor size={16} color="#3b82f6" /> Device Types
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {data.devices.map((device) => {
                const pct = totalDeviceCount > 0 ? (device.count / totalDeviceCount) * 100 : 0;
                return (
                  <div key={device.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
                      <span style={{ color: "var(--text-secondary)" }}>{device.name}</span>
                      <span>{device.count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "#3b82f6", borderRadius: "4px" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Geographical maps (simulated via ID hashing) */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "var(--shadow-md)"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontFamily: "Outfit, sans-serif" }}>
              <Globe size={16} color="#10b981" /> Pakistan Cities (Simulated)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {data.geography.map((geo) => {
                const pct = totalGeoCount > 0 ? (geo.visitors / totalGeoCount) * 100 : 0;
                return (
                  <div key={geo.city}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
                      <span style={{ color: "var(--text-secondary)" }}>{geo.city}</span>
                      <span>{geo.visitors} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "#10b981", borderRadius: "4px" }} />
                    </div>
                  </div>
                );
              })}

              {data.geography.length === 0 && (
                <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-secondary)", padding: "12px" }}>
                  Awaiting visitor connection mappings.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Styles for tooltip pings and hovers */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .chart-bar-container:hover .chart-bar {
          filter: brightness(1.15);
          transform: scaleX(1.05);
        }
        .chart-bar-container:hover .chart-tooltip {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @media (max-width: 990px) {
          .admin-analytics-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
