"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, Users, ShoppingBag, Banknote, ShoppingCart, 
  MapPin, Laptop, Compass, Heart, Globe, ArrowUpRight, 
  ChevronRight, RefreshCw, MessageCircle, HelpCircle, Activity
} from "lucide-react";
import toast from "react-hot-toast";

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  totalSessions: number;
  averageOrderValue: number;
  repeatCustomerRate: number;
  conversionRate: number;
  funnelCart: number;
  funnelCheckout: number;
  funnelOrdered: number;
  sessionsTrend: number;
  cartTrend: number;
  checkoutTrend: number;
  orderedTrend: number;
  convRateTrend: number;
  todaySales: number;
  yesterdaySales: number;
  todayOrders: number;
  yesterdayOrders: number;
  todaySessionsCount: number;
  yesterdaySessionsCount: number;
  timeline: Array<{ date: string; sales: number; sessions: number; orders: number }>;
  ga4Timeline: Array<{ date: string; view_promotion: number; page_view: number; view_item_list: number; add_to_cart: number; purchase: number }>;
  locations: Array<{ code: string; name: string; count: number }>;
  sources: Record<string, { sessions: number; sales: number }>;
  devices: { Desktop: number; Mobile: number; Tablet: number };
  socialSources: Record<string, { sessions: number; sales: number }>;
  topProducts: Array<{ id: string; name: string; units: number; sales: number }>;
  topLandingPages: Array<{ path: string; count: number }>;
  ga4EventTotals: Record<string, number>;
  activeVisitorsCount: number;
  liveCartsCount: number;
  liveCheckoutCount: number;
  livePurchasedCount: number;
  servedVisitors: Array<{
    sessionId: string;
    name: string;
    countryCode: string;
    countryName: string;
    timeOnSite: string;
    currentPage: string;
    os: string;
    browser: string;
    referrer: string;
    pastVisits: number;
    pastChats: number;
    servedBy: string;
  }>;
  idleVisitors: Array<{
    sessionId: string;
    name: string;
    countryCode: string;
    countryName: string;
    timeOnSite: string;
    currentPage: string;
    os: string;
    browser: string;
    referrer: string;
    pastVisits: number;
    pastChats: number;
    servedBy: string;
  }>;
}

const CITY_ICONS: Record<string, string> = {
  LHE: "🕌",
  KHI: "🌊",
  ISB: "⛰️",
  FSD: "🏭",
  MUX: "🏺",
};

const OS_ICONS: Record<string, string> = {
  Windows: "🪟",
  macOS: "🍏",
  iOS: "📱",
  Android: "🤖",
  Linux: "🐧",
  Unknown: "💻",
};

const BROWSER_ICONS: Record<string, string> = {
  Chrome: "🌐 Chrome",
  Safari: "🧭 Safari",
  Firefox: "🦊 Firefox",
  Edge: "💻 Edge",
  Unknown: "🌐 Browser",
};

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "ga4" | "live">("overview");
  const [liveViewMode, setLiveViewMode] = useState<"list" | "visual">("list");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  // Percentage Calculations
  const getPctString = (today: number, yesterday: number) => {
    if (yesterday === 0) return today > 0 ? "+100%" : "0%";
    const diff = today - yesterday;
    const pct = Math.round((diff / yesterday) * 100);
    return pct >= 0 ? `+${pct}%` : `${pct}%`;
  };

  const renderPctBadge = (val: string) => {
    if (val.startsWith("+")) {
      return <span style={{ color: "#10b981", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", background: "rgba(16, 185, 129, 0.1)" }}>↑ {val}</span>;
    }
    if (val.startsWith("-")) {
      return <span style={{ color: "#ef4444", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", background: "rgba(239, 68, 68, 0.1)" }}>↓ {val}</span>;
    }
    return <span style={{ color: "#6b7280", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", background: "rgba(107, 114, 128, 0.1)" }}>{val}</span>;
  };

  // SVG Sparkline Drawer
  const drawSparkline = (points: number[], color = "#ff6b00") => {
    if (!points || points.length === 0) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const w = 120;
    const h = 32;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * w;
      const y = h - ((val - min) / range) * h;
      return `${x},${y}`;
    }).join(" ");

    return (
      <svg width={w} height={h} style={{ overflow: "visible" }}>
        <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={coords} />
      </svg>
    );
  };

  // SVG Timeline Chart Drawer for GA4 Events
  const drawGA4Chart = () => {
    if (!data?.ga4Timeline || data.ga4Timeline.length === 0) return null;
    const timeline = data.ga4Timeline;
    const w = 950;
    const h = 220;

    // Find overall max value to scale Y axis
    const maxVal = Math.max(
      ...timeline.map(item => Math.max(item.page_view, item.view_promotion, item.view_item_list, item.add_to_cart, item.purchase)),
      1
    );

    const getPolylinePoints = (key: "page_view" | "view_promotion" | "view_item_list" | "add_to_cart" | "purchase") => {
      return timeline.map((item, idx) => {
        const x = 50 + (idx / (timeline.length - 1)) * 860;
        const y = 200 - (item[key] / maxVal) * 160;
        return `${x},${y}`;
      }).join(" ");
    };

    return (
      <svg width="100%" height="240" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = 200 - ratio * 160;
          const label = Math.round(ratio * maxVal);
          return (
            <g key={idx}>
              <line x1="50" y1={y} x2="910" y2={y} stroke="#f1f3f5" strokeWidth="1" strokeDasharray="4,4" />
              <text x="15" y={y + 4} fill="#9ca3af" fontSize="11" fontWeight="600">{label}</text>
            </g>
          );
        })}

        {/* X Axis Date labels (show every 5th date) */}
        {timeline.map((item, idx) => {
          if (idx % 6 !== 0 && idx !== timeline.length - 1) return null;
          const x = 50 + (idx / (timeline.length - 1)) * 860;
          return (
            <text key={idx} x={x} y="222" fill="#9ca3af" fontSize="10" fontWeight="600" textAnchor="middle">
              {item.date}
            </text>
          );
        })}

        {/* Line Plots */}
        <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={getPolylinePoints("page_view")} />
        <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={getPolylinePoints("view_promotion")} />
        <polyline fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={getPolylinePoints("view_item_list")} />
        <polyline fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={getPolylinePoints("add_to_cart")} />
        <polyline fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={getPolylinePoints("purchase")} />
      </svg>
    );
  };

  const handleResetAnalytics = async () => {
    if (!window.confirm("Are you sure you want to clear all analytics data? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics/clear", { method: "POST" });
      if (res.ok) {
        toast.success("Analytics data cleared successfully.");
        await fetchAnalytics();
      } else {
        toast.error("Failed to clear analytics.");
      }
    } catch (err) {
      toast.error("Error clearing analytics.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container" style={{ maxWidth: "1450px", margin: "0 auto", fontFamily: "var(--font-jakarta), sans-serif" }}>
      <style>{`
        /* Custom styles for charts and layouts */
        .analytics-nav {
          display: flex;
          border-bottom: 2px solid #f1f3f5;
          margin-bottom: 32px;
          gap: 24px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .analytics-nav::-webkit-scrollbar {
          display: none;
        }
        .analytics-tab {
          padding: 12px 4px;
          font-weight: 700;
          font-size: 15px;
          color: #6b7280;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .analytics-tab:hover {
          color: #ff6b00;
        }
        .analytics-tab.active {
          color: #ff6b00;
          border-bottom-color: #ff6b00;
        }
        .analytics-grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        .analytics-grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
          margin-bottom: 40px;
        }
        .chart-box {
          background: white;
          border: 1px solid #f0f0f0;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .metric-spark-card {
          background: white;
          border: 1px solid #f0f0f0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .data-bar-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }
        .data-bar-outer {
          height: 8px;
          background: #f3f4f6;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 18px;
        }
        .data-bar-inner {
          height: 100%;
          border-radius: 8px;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .live-green-pulse {
          display: inline-block;
          width: 10px;
          height: 10px;
          background-color: #10b981;
          border-radius: 50%;
          animation: pulse 2.5s infinite;
        }
        .visual-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: #00bcd4;
          border-radius: 50%;
          box-shadow: 0 0 8px #00bcd4;
        }
        .visual-dot.cart { background-color: #ff9800; box-shadow: 0 0 8px #ff9800; }
        .visual-dot.checkout { background-color: #e040fb; box-shadow: 0 0 8px #e040fb; }
        .visual-dot.purchase { background-color: #4caf50; box-shadow: 0 0 8px #4caf50; }
        
        .chat-action-btn {
          border: 1px solid #ff6b00;
          color: #ff6b00;
          background: transparent;
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .chat-action-btn:hover {
          background: #ff6b00;
          color: white;
        }
        .funnel-cols {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 28px;
        }
        .funnel-col-item {
          border-left: 1px solid #f3f4f6;
          padding-left: 16px;
        }
        @media (max-width: 900px) {
          .funnel-cols {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        @media (max-width: 500px) {
          .funnel-cols {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .funnel-col-item {
            border-left: none;
            border-bottom: 1px solid #f3f4f6;
            padding-left: 0;
            padding-bottom: 12px;
          }
          .funnel-col-item:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#1f2937", fontFamily: "Outfit, sans-serif" }}>
            Analytics
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px", fontWeight: 500 }}>
            Analyze store visits, custom events, conversion funnels, and live store traffic.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={handleResetAnalytics}
            style={{
              padding: "10px 16px",
              background: "#fee2e2",
              color: "#ef4444",
              border: "1px solid #f87171",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Reset Analytics
          </button>
          <button 
            onClick={fetchAnalytics}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              padding: "10px 16px", 
              background: "white", 
              border: "1px solid #e5e7eb", 
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <RefreshCw size={16} className={isRefreshing ? "spin-animation" : ""} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="analytics-nav">
        <div className={`analytics-tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
          <TrendingUp size={18} />
          Overview Dashboard
        </div>
        <div className={`analytics-tab ${activeTab === "ga4" ? "active" : ""}`} onClick={() => setActiveTab("ga4")}>
          <Activity size={18} />
          GA4 Events
        </div>
        <div className={`analytics-tab ${activeTab === "live" ? "active" : ""}`} onClick={() => setActiveTab("live")}>
          <Globe size={18} />
          Live View
        </div>
      </div>

      {/* ===================== TAB 1: OVERVIEW DASHBOARD ===================== */}
      {activeTab === "overview" && data && (
        <div>
          {/* Top Summary Cards with Sparklines */}
          <div className="analytics-grid-3">
            {/* Sales Card */}
            <div className="metric-spark-card">
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600, marginBottom: "6px" }}>TOTAL SALES (30D)</p>
                <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#1f2937", marginBottom: "4px" }}>
                  Rs. {data.totalSales.toLocaleString()}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {renderPctBadge(getPctString(data.todaySales, data.yesterdaySales))}
                  <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}>vs yesterday</span>
                </div>
              </div>
              {drawSparkline(data.timeline.map(t => t.sales), "#3b82f6")}
            </div>

            {/* Sessions Card */}
            <div className="metric-spark-card">
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600, marginBottom: "6px" }}>STORE SESSIONS (30D)</p>
                <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#1f2937", marginBottom: "4px" }}>
                  {data.totalSessions.toLocaleString()}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {renderPctBadge(getPctString(data.todaySessionsCount, data.yesterdaySessionsCount))}
                  <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}>vs yesterday</span>
                </div>
              </div>
              {drawSparkline(data.timeline.map(t => t.sessions), "#ff6b00")}
            </div>

            {/* Repeat Rate Card */}
            <div className="metric-spark-card">
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600, marginBottom: "6px" }}>REPEAT CUSTOMER RATE</p>
                <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#1f2937", marginBottom: "4px" }}>
                  {data.repeatCustomerRate}%
                </h3>
                <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", background: "rgba(16, 185, 129, 0.1)" }}>
                  ↑ 2.6%
                </span>
              </div>
              <div style={{ position: "relative", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="48" height="48" viewBox="0 0 36 36">
                  <path fill="none" stroke="#e5e7eb" strokeWidth="4" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${data.repeatCustomerRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
              </div>
            </div>

            {/* Conversion Rate Card */}
            <div className="metric-spark-card">
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600, marginBottom: "6px" }}>CONVERSION RATE (30D)</p>
                <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#1f2937", marginBottom: "4px" }}>
                  {data.conversionRate}%
                </h3>
                <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", background: "rgba(16, 185, 129, 0.1)" }}>
                  ↑ 3.6%
                </span>
              </div>
              {drawSparkline(data.timeline.map(t => t.orders), "#10b981")}
            </div>

            {/* Average Order Value */}
            <div className="metric-spark-card">
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600, marginBottom: "6px" }}>AVERAGE ORDER VALUE</p>
                <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#1f2937", marginBottom: "4px" }}>
                  Rs. {data.averageOrderValue.toLocaleString()}
                </h3>
                <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", background: "rgba(16, 185, 129, 0.1)" }}>
                  ↑ 6.7%
                </span>
              </div>
              {drawSparkline(data.timeline.map(t => t.sales), "#8b5cf6")}
            </div>

            {/* Total Orders */}
            <div className="metric-spark-card">
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600, marginBottom: "6px" }}>TOTAL ORDERS (30D)</p>
                <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#1f2937", marginBottom: "4px" }}>
                  {data.totalOrders}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {renderPctBadge(getPctString(data.todayOrders, data.yesterdayOrders))}
                  <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}>vs yesterday</span>
                </div>
              </div>
              {drawSparkline(data.timeline.map(t => t.orders), "#ec4899")}
            </div>
          </div>

          {/* Conversion rate breakdown funnel card */}
          <div className="chart-box" style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#1f2937", borderBottom: "1px dotted #9ca3af", display: "inline-block", cursor: "help", fontFamily: "Outfit, sans-serif" }}>
                  Conversion rate breakdown
                </h4>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "8px" }}>
                  <span style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937" }}>
                    {data.conversionRate}%
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "13px", fontWeight: 700, color: data.convRateTrend >= 0 ? "#10b981" : "#ef4444" }}>
                    {data.convRateTrend >= 0 ? "↗" : "↘"} {Math.abs(data.convRateTrend)}%
                  </span>
                </div>
              </div>
            </div>

            {/* 4-column metric list */}
            <div className="funnel-cols">
              {/* Step 1: Sessions */}
              <div className="funnel-col-item">
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#4b5563", fontWeight: 700, marginBottom: "8px" }}>
                  <Users size={14} color="#6b7280" /> Sessions
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#1f2937", marginBottom: "4px" }}>100%</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#4b5563", marginBottom: "4px" }}>{data.totalSessions.toLocaleString()}</div>
                <span style={{ color: data.sessionsTrend >= 0 ? "#10b981" : "#ef4444", fontSize: "11px", fontWeight: 700 }}>
                  {data.sessionsTrend >= 0 ? "↗" : "↘"} {Math.abs(data.sessionsTrend)}%
                </span>
              </div>

              {/* Step 2: Added to cart */}
              <div className="funnel-col-item">
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#4b5563", fontWeight: 700, marginBottom: "8px" }}>
                  <ShoppingCart size={14} color="#6b7280" /> Added to cart
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#1f2937", marginBottom: "4px" }}>
                  {data.totalSessions > 0 ? ((data.funnelCart / data.totalSessions) * 100).toFixed(2) : "0"}%
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#4b5563", marginBottom: "4px" }}>{data.funnelCart.toLocaleString()}</div>
                <span style={{ color: data.cartTrend >= 0 ? "#10b981" : "#ef4444", fontSize: "11px", fontWeight: 700 }}>
                  {data.cartTrend >= 0 ? "↗" : "↘"} {Math.abs(data.cartTrend)}%
                </span>
              </div>

              {/* Step 3: Reached checkout */}
              <div className="funnel-col-item">
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#4b5563", fontWeight: 700, marginBottom: "8px" }}>
                  <TrendingUp size={14} color="#6b7280" /> Reached checkout
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#1f2937", marginBottom: "4px" }}>
                  {data.totalSessions > 0 ? ((data.funnelCheckout / data.totalSessions) * 100).toFixed(2) : "0"}%
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#4b5563", marginBottom: "4px" }}>{data.funnelCheckout.toLocaleString()}</div>
                <span style={{ color: data.checkoutTrend >= 0 ? "#10b981" : "#ef4444", fontSize: "11px", fontWeight: 700 }}>
                  {data.checkoutTrend >= 0 ? "↗" : "↘"} {Math.abs(data.checkoutTrend)}%
                </span>
              </div>

              {/* Step 4: Completed checkout */}
              <div className="funnel-col-item">
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#4b5563", fontWeight: 700, marginBottom: "8px" }}>
                  <ShoppingBag size={14} color="#6b7280" /> Completed checkout
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#1f2937", marginBottom: "4px" }}>
                  {data.conversionRate}%
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#4b5563", marginBottom: "4px" }}>{data.funnelOrdered.toLocaleString()}</div>
                <span style={{ color: data.orderedTrend >= 0 ? "#10b981" : "#ef4444", fontSize: "11px", fontWeight: 700 }}>
                  {data.orderedTrend >= 0 ? "↗" : "↘"} {Math.abs(data.orderedTrend)}%
                </span>
              </div>
            </div>

            {/* Funnel Visual Map */}
            {(() => {
              // Calculate heights relative to maximum height (130px)
              const h1 = 130;
              const cartPct = data.totalSessions > 0 ? (data.funnelCart / data.totalSessions) * 100 : 0;
              const checkoutPct = data.totalSessions > 0 ? (data.funnelCheckout / data.totalSessions) * 100 : 0;
              const orderPct = data.conversionRate || 0;

              // Logarithmic/visual scaling to match the screenshot proportions
              const h2 = Math.max(35, Math.min(75, 30 + cartPct * 3.5));
              const h3 = Math.max(28, Math.min(65, 20 + checkoutPct * 3.5));
              const h4 = Math.max(22, Math.min(55, 12 + orderPct * 3.5));

              const y1 = 145 - h1;
              const y2 = 145 - h2;
              const y3 = 145 - h3;
              const y4 = 145 - h4;

              return (
                <div style={{ overflowX: "auto", background: "#fafafa", borderRadius: "12px", border: "1px solid #f1f3f5", padding: "16px" }}>
                  <div style={{ minWidth: "750px" }}>
                    <svg width="100%" height="150" viewBox="0 0 800 150" style={{ overflow: "visible" }}>
                      {/* Grid separation lines */}
                      <line x1="200" y1="10" x2="200" y2="145" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4" />
                      <line x1="400" y1="10" x2="400" y2="145" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4" />
                      <line x1="600" y1="10" x2="600" y2="145" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4" />

                      {/* Connecting slopes (gradients) */}
                      <polygon points={`170,${y1} 210,${y2} 210,145 170,145`} fill="url(#funnel-grad)" opacity="0.4" />
                      <polygon points={`370,${y2} 410,${y3} 410,145 370,145`} fill="url(#funnel-grad)" opacity="0.4" />
                      <polygon points={`570,${y3} 610,${y4} 610,145 570,145`} fill="url(#funnel-grad)" opacity="0.4" />

                      {/* Gradients definitions */}
                      <defs>
                        <linearGradient id="funnel-grad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>

                      {/* Funnel Column Bars (Vibrant Blue, Rounded Tops) */}
                      <rect x="10" y={y1} width="160" height={h1} rx="8" ry="8" fill="#2563eb" />
                      <rect x="210" y={y2} width="160" height={h2} rx="6" ry="6" fill="#2563eb" />
                      <rect x="410" y={y3} width="160" height={h3} rx="6" ry="6" fill="#2563eb" />
                      <rect x="610" y={y4} width="160" height={h4} rx="6" ry="6" fill="#2563eb" />
                    </svg>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Detailed Lists: Locations, Traffic, Devices, Top Products */}
          <div className="analytics-grid-2">
            {/* Geolocation */}
            <div className="chart-box">
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#1f2937", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={18} color="#ff6b00" /> Visits by Location
              </h4>
              {data.locations.map((loc) => {
                const totalLoc = data.locations.reduce((acc, l) => acc + l.count, 0);
                const percent = totalLoc > 0 ? ((loc.count / totalLoc) * 100).toFixed(1) : "0";
                return (
                  <div key={loc.name}>
                    <div className="data-bar-row">
                      <span>{CITY_ICONS[loc.code] || "📍"} {loc.name}</span>
                      <span>{loc.count.toLocaleString()} visits ({percent}%)</span>
                    </div>
                    <div className="data-bar-outer">
                      <div className="data-bar-inner" style={{ width: `${percent}%`, background: "linear-gradient(90deg, #3b82f6, #60a5fa)" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Traffic Sources */}
            <div className="chart-box">
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#1f2937", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Compass size={18} color="#ff6b00" /> Visits by Traffic Source
              </h4>
              {Object.entries(data.sources).map(([source, stats]) => {
                const totalSessions = Object.values(data.sources).reduce((acc, s) => acc + s.sessions, 0);
                const percent = totalSessions > 0 ? ((stats.sessions / totalSessions) * 100).toFixed(1) : "0";
                return (
                  <div key={source}>
                    <div className="data-bar-row">
                      <span>{source}</span>
                      <span>{stats.sessions.toLocaleString()} sessions ({percent}%)</span>
                    </div>
                    <div className="data-bar-outer">
                      <div className="data-bar-inner" style={{ width: `${percent}%`, background: "linear-gradient(90deg, #ff6b00, #ff9e59)" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Devices & Social Channel Splits */}
            <div className="chart-box">
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#1f2937", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Laptop size={18} color="#ff6b00" /> Visits by Device Type
              </h4>
              <div style={{ display: "flex", gap: "32px", alignItems: "center", justifyContent: "space-around", minHeight: "140px" }}>
                {Object.entries(data.devices).map(([dev, count]) => {
                  const totalDev = Object.values(data.devices).reduce((acc, c) => acc + c, 0);
                  const pct = totalDev > 0 ? Math.round((count / totalDev) * 100) : 0;
                  return (
                    <div key={dev} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937", marginBottom: "4px" }}>{pct}%</div>
                      <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: 700 }}>{dev}</div>
                      <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "2px" }}>{count.toLocaleString()} sessions</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Network Referrals */}
            <div className="chart-box">
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#1f2937", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Heart size={18} color="#ff6b00" /> Store Visits from Social Networks
              </h4>
              {Object.entries(data.socialSources).map(([channel, stats]) => {
                const totalSocial = Object.values(data.socialSources).reduce((acc, s) => acc + s.sessions, 0);
                const percent = totalSocial > 0 ? ((stats.sessions / totalSocial) * 100).toFixed(1) : "0";
                return (
                  <div key={channel}>
                    <div className="data-bar-row">
                      <span>{channel}</span>
                      <span>{stats.sessions.toLocaleString()} sessions ({percent}%)</span>
                    </div>
                    <div className="data-bar-outer">
                      <div className="data-bar-inner" style={{ width: `${percent}%`, background: "linear-gradient(90deg, #ec4899, #f472b6)" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top Products */}
            <div className="chart-box">
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#1f2937", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <ShoppingBag size={18} color="#ff6b00" /> Top Products by Units Sold
              </h4>
              <div style={{ overflowX: "auto" }}>
                <table className="data-table" style={{ fontSize: "13px" }}>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th style={{ textAlign: "right" }}>Units Sold</th>
                      <th style={{ textAlign: "right" }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: "#374151" }}>{p.name}</div>
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700 }}>{p.units}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#ff6b00" }}>Rs. {p.sales.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Landing Pages */}
            <div className="chart-box">
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#1f2937", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Globe size={18} color="#ff6b00" /> Top Landing Pages by Visits
              </h4>
              <div style={{ overflowX: "auto" }}>
                <table className="data-table" style={{ fontSize: "13px" }}>
                  <thead>
                    <tr>
                      <th>URL Path</th>
                      <th style={{ textAlign: "right" }}>Total Visits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topLandingPages.map((lp) => (
                      <tr key={lp.path}>
                        <td>
                          <div style={{ fontWeight: 600, color: "#374151", fontFamily: "monospace" }}>{lp.path}</div>
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700 }}>{lp.count.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: GA4 EVENTS DASHBOARD ===================== */}
      {activeTab === "ga4" && data && (
        <div className="chart-box" style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h4 style={{ fontSize: "18px", fontWeight: 800, color: "#1f2937", fontFamily: "Outfit, sans-serif" }}>
                Event Count by Event Name Over Time
              </h4>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px", fontWeight: 500 }}>
                Google Analytics 4 Event timeline logs (Last 30 Days)
              </p>
            </div>
            {/* Legends */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "12px", fontWeight: 700 }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />view_promotion</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#3b82f6" }} />page_view</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#8b5cf6" }} />view_item_list</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ec4899" }} />add_to_cart</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />purchase</span>
            </div>
          </div>

          {/* SVG Multi Line Chart */}
          <div style={{ overflowX: "auto", padding: "10px 0", background: "#fafafa", borderRadius: "12px", border: "1px solid #f1f3f5", marginBottom: "40px" }}>
            <div style={{ minWidth: "800px", padding: "0 20px" }}>
              {drawGA4Chart()}
            </div>
          </div>

          {/* Horizontal Bar Chart for Event Totals */}
          <div style={{ maxWidth: "800px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#1f2937", marginBottom: "20px" }}>Event Count by Event Name (Totals)</h4>
            {Object.entries(data.ga4EventTotals).map(([evtName, total]) => {
              const maxTotal = Math.max(...Object.values(data.ga4EventTotals), 1);
              const percent = ((total / maxTotal) * 100).toFixed(1);
              let barColor = "#3b82f6";
              if (evtName === "view_promotion") barColor = "#f59e0b";
              else if (evtName === "view_item_list") barColor = "#8b5cf6";
              else if (evtName === "add_to_cart") barColor = "#ec4899";
              else if (evtName === "purchase") barColor = "#10b981";

              return (
                <div key={evtName} style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "14px" }}>
                  <div style={{ width: "160px", fontSize: "13px", fontWeight: 700, color: "#4b5563", fontFamily: "monospace" }}>{evtName}</div>
                  <div style={{ flex: 1, height: "24px", background: "#f3f4f6", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
                    <div style={{ height: "100%", width: `${percent}%`, background: barColor, borderRadius: "6px", transition: "width 0.4s ease" }} />
                    <span style={{ position: "absolute", left: "10px", top: "2px", fontSize: "12px", fontWeight: 800, color: total > 200 ? "white" : "#1f2937" }}>
                      {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: LIVE VIEW & CUSTOMER TRACKER ===================== */}
      {activeTab === "live" && data && (
        <div>
          {/* Real-time counters block */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", border: "1px solid #f0f0f0", padding: "24px 32px", borderRadius: "20px", marginBottom: "32px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="live-green-pulse" />
              <div>
                <h4 style={{ fontSize: "20px", fontWeight: 800, color: "#1f2937" }}>{data.activeVisitorsCount}</h4>
                <p style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>Active visitors right now</p>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              <div>
                <h4 style={{ fontSize: "20px", fontWeight: 800, color: "#ff9800" }}>{data.liveCartsCount}</h4>
                <p style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600 }}>Active Carts 🛒</p>
              </div>
              <div>
                <h4 style={{ fontSize: "20px", fontWeight: 800, color: "#e040fb" }}>{data.liveCheckoutCount}</h4>
                <p style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600 }}>Checking Out 💳</p>
              </div>
              <div>
                <h4 style={{ fontSize: "20px", fontWeight: 800, color: "#4caf50" }}>{data.livePurchasedCount}</h4>
                <p style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600 }}>Purchased 🎉</p>
              </div>
            </div>

            <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: "100px", overflow: "hidden" }}>
              <button onClick={() => setLiveViewMode("list")} style={{ background: liveViewMode === "list" ? "#ff6b00" : "white", color: liveViewMode === "list" ? "white" : "#4b5563", border: "none", padding: "8px 20px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>List</button>
              <button onClick={() => setLiveViewMode("visual")} style={{ background: liveViewMode === "visual" ? "#ff6b00" : "white", color: liveViewMode === "visual" ? "white" : "#4b5563", border: "none", padding: "8px 20px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Visual Map</button>
            </div>
          </div>

          {/* Sub-view: Visual dot traffic map */}
          {liveViewMode === "visual" && (
            <div style={{ background: "#0f172a", borderRadius: "20px", height: "450px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "40px", border: "1px solid #1e293b" }}>
              {/* World outline SVG background overlay */}
              <svg width="100%" height="100%" viewBox="0 0 1000 500" style={{ opacity: 0.15 }}>
                <rect width="100%" height="100%" fill="none" />
                {/* Visual grid dots representing maps */}
                {Array.from({ length: 45 }).map((_, i) => (
                  <circle key={i} cx={(i * 22) + 20} cy={(Math.sin(i) * 150) + 250} r="1.5" fill="#ffffff" />
                ))}
              </svg>
              
              <div style={{ position: "absolute", textAlign: "center" }}>
                <h4 style={{ fontSize: "18px", fontWeight: 700, color: "white", marginBottom: "8px" }}>Live Traffic Map</h4>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>Glowing coordinates represent active customer sessions across regions</p>
              </div>

              {/* Pulsing Dots representing live users */}
              <div className="visual-dot" style={{ top: "35%", left: "45%" }} />
              <div className="visual-dot cart" style={{ top: "60%", left: "30%" }} />
              <div className="visual-dot checkout" style={{ top: "45%", left: "68%" }} />
              <div className="visual-dot purchase" style={{ top: "25%", left: "75%" }} />
              <div className="visual-dot" style={{ top: "55%", left: "82%" }} />
              <div className="visual-dot purchase" style={{ top: "50%", left: "55%" }} />
            </div>
          )}

          {/* Sub-view: Interactive customer support queue tables */}
          {liveViewMode === "list" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "40px", marginBottom: "40px" }}>
              {/* Served Queue */}
              <div style={{ background: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1f2937", marginBottom: "20px", fontFamily: "Outfit, sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
                  Currently served visitors <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600 }}>({data.servedVisitors.length})</span>
                </h3>

                <div style={{ overflowX: "auto" }}>
                  <table className="data-table" style={{ fontSize: "13px" }}>
                    <thead>
                      <tr>
                        <th>Visitor</th>
                        <th>Time on Site</th>
                        <th>Current Page</th>
                        <th>Technology</th>
                        <th>Source URL</th>
                        <th style={{ textAlign: "center" }}>Past Visits</th>
                        <th style={{ textAlign: "center" }}>Past Chats</th>
                        <th>Served By</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.servedVisitors.map((v) => (
                        <tr key={v.sessionId}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "16px" }}>{CITY_ICONS[v.countryCode] || "📍"}</span>
                              <span style={{ fontWeight: 700, color: "#1f2937" }}>{v.name}</span>
                            </div>
                          </td>
                          <td>{v.timeOnSite}</td>
                          <td>
                            <span style={{ background: "#f3f4f6", padding: "4px 10px", borderRadius: "6px", fontWeight: 600, fontSize: "12px", color: "#4b5563" }}>
                              {v.currentPage}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>
                              {OS_ICONS[v.os] || "💻"} {BROWSER_ICONS[v.browser] || v.browser}
                            </span>
                          </td>
                          <td style={{ color: "#3b82f6", fontWeight: 600, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {v.referrer}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 700 }}>{v.pastVisits}</td>
                          <td style={{ textAlign: "center", fontWeight: 700 }}>{v.pastChats}</td>
                          <td>
                            <span style={{ fontWeight: 700, color: "#ff6b00", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <span style={{ width: "6px", height: "6px", background: "#ff6b00", borderRadius: "50%" }} />
                              {v.servedBy}
                            </span>
                          </td>
                          <td>
                            <button className="chat-action-btn" onClick={() => alert(`Opening chat window for ${v.name}`)}>
                              Chat Panel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Idle Queue */}
              <div style={{ background: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1f2937", marginBottom: "20px", fontFamily: "Outfit, sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
                  Idle website visitors <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600 }}>({data.idleVisitors.length})</span>
                </h3>

                <div style={{ overflowX: "auto" }}>
                  <table className="data-table" style={{ fontSize: "13px" }}>
                    <thead>
                      <tr>
                        <th>Visitor</th>
                        <th>Time on Site</th>
                        <th>Current Page</th>
                        <th>Technology</th>
                        <th>Source URL</th>
                        <th style={{ textAlign: "center" }}>Past Visits</th>
                        <th style={{ textAlign: "center" }}>Past Chats</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.idleVisitors.map((v) => (
                        <tr key={v.sessionId}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "16px" }}>{CITY_ICONS[v.countryCode] || "📍"}</span>
                              <span style={{ fontWeight: 700, color: "#1f2937" }}>{v.name}</span>
                            </div>
                          </td>
                          <td>{v.timeOnSite}</td>
                          <td>
                            <span style={{ background: "#f3f4f6", padding: "4px 10px", borderRadius: "6px", fontWeight: 600, fontSize: "12px", color: "#4b5563" }}>
                              {v.currentPage}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>
                              {OS_ICONS[v.os] || "💻"} {BROWSER_ICONS[v.browser] || v.browser}
                            </span>
                          </td>
                          <td style={{ color: "#3b82f6", fontWeight: 600, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {v.referrer}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 700 }}>{v.pastVisits}</td>
                          <td style={{ textAlign: "center", fontWeight: 700 }}>{v.pastChats}</td>
                          <td>
                            <button className="chat-action-btn" onClick={() => alert(`Sending support invite to ${v.name}`)}>
                              Invite to Chat
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
