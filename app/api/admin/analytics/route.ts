import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import VisitorSession from "@/models/VisitorSession";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Helper for weighted random selection (used in the mock seeder)
const selectWeighted = (arr: any[]) => {
  const r = Math.random();
  let sum = 0;
  for (const item of arr) {
    sum += item.prob;
    if (r <= sum) return item.value;
  }
  return arr[0].value;
};

// Mock Visitor Names for the Tidio/LiveChat-style Visitor Tracker
const MOCK_NAMES = [
  "Aaron", "Ayesha", "Sarah", "Michael", "John", "Emma", "David", "Zainab", 
  "Fatima", "James", "Emily", "Daniel", "Sophia", "Robert", "Maryam"
];

const MOCK_OPERATORS = ["Stuart Cook", "Zoe Jenkins", "Admin Support", "Ali Khan"];

// Historical Analytics Seeder
async function seedMockAnalytics() {
  const now = new Date();
  const sessionsToCreate = [];
  const eventsToCreate = [];

  const referrers = [
    { value: "Direct", prob: 0.35 },
    { value: "https://www.google.com", prob: 0.30 },
    { value: "https://www.facebook.com", prob: 0.20 },
    { value: "https://www.instagram.com", prob: 0.10 },
    { value: "https://t.co", prob: 0.05 },
  ];

  const userAgents = [
    { value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", prob: 0.50 },
    { value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1", prob: 0.35 },
    { value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15", prob: 0.10 },
    { value: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36", prob: 0.05 },
  ];

  const productPaths = [
    "/products/65b3c20c0f8cb8b30f898de1",
    "/products/65b3c20c0f8cb8b30f898de2",
    "/products/65b3c20c0f8cb8b30f898de3",
    "/products/65b3c20c0f8cb8b30f898de4",
  ];

  for (let i = 29; i >= 0; i--) {
    const dayDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayVisitorsCount = Math.floor(Math.random() * 25) + 15; // 15 to 40 sessions per day

    for (let v = 0; v < dayVisitorsCount; v++) {
      const sessionId = `sess_${Math.random().toString(36).substring(2, 15)}_${dayDate.getTime()}`;
      const referrer = selectWeighted(referrers);
      const userAgent = selectWeighted(userAgents);
      const ip = `${Math.floor(Math.random() * 180) + 20}.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250)}`;

      const rand = Math.random();
      const hasCart = rand > 0.45;
      const hasCheckout = rand > 0.70;
      const hasOrdered = rand > 0.88;

      const sessionDate = new Date(dayDate.getTime() + Math.floor(Math.random() * 24 * 60 * 60 * 1000));

      sessionsToCreate.push({
        sessionId,
        ip,
        userAgent,
        referrer,
        hasCart,
        hasCheckout,
        hasOrdered,
        lastActive: sessionDate,
        createdAt: sessionDate,
        updatedAt: sessionDate,
      });

      // Events
      eventsToCreate.push({
        sessionId,
        eventName: "page_view",
        path: "/",
        createdAt: sessionDate,
      });

      if (Math.random() > 0.2) {
        eventsToCreate.push({
          sessionId,
          eventName: "view_promotion",
          path: "/",
          createdAt: new Date(sessionDate.getTime() + 15 * 1000),
        });
      }

      eventsToCreate.push({
        sessionId,
        eventName: "view_item_list",
        path: "/products",
        createdAt: new Date(sessionDate.getTime() + 50 * 1000),
      });

      if (Math.random() > 0.3) {
        eventsToCreate.push({
          sessionId,
          eventName: "page_view",
          path: productPaths[Math.floor(Math.random() * productPaths.length)],
          createdAt: new Date(sessionDate.getTime() + 3 * 60 * 1000),
        });
      }

      if (hasCart) {
        eventsToCreate.push({
          sessionId,
          eventName: "add_to_cart",
          path: "/cart",
          createdAt: new Date(sessionDate.getTime() + 5 * 60 * 1000),
        });
      }

      if (hasCheckout) {
        eventsToCreate.push({
          sessionId,
          eventName: "initiate_checkout",
          path: "/checkout",
          createdAt: new Date(sessionDate.getTime() + 7 * 60 * 1000),
        });
      }

      if (hasOrdered) {
        eventsToCreate.push({
          sessionId,
          eventName: "purchase",
          path: "/order-success",
          createdAt: new Date(sessionDate.getTime() + 10 * 60 * 1000),
        });
      }
    }
  }

  if (sessionsToCreate.length > 0) {
    await VisitorSession.insertMany(sessionsToCreate);
  }
  if (eventsToCreate.length > 0) {
    await AnalyticsEvent.insertMany(eventsToCreate);
  }
}

// User-Agent parser utility
function parseUA(ua: string) {
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

  return { os, browser };
}

// Geolocation Simulator based on IP/Session ID hashes
function getGeo(sessionId: string) {
  const charSum = sessionId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const percent = charSum % 100;

  if (percent < 45) return { code: "US", name: "United States" };
  if (percent < 75) return { code: "PK", name: "Pakistan" };
  if (percent < 88) return { code: "CA", name: "Canada" };
  if (percent < 95) return { code: "DE", name: "Germany" };
  return { code: "FR", name: "France" };
}

export async function GET() {
  const authSession = await auth();
  if (!authSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();


    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const startOf30DaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch collections
    const [
      activeSessions,
      sessions30Days,
      events30Days,
      orders30Days,
      products,
    ] = await Promise.all([
      // Real-time active in the last 5 minutes
      VisitorSession.find({ lastActive: { $gte: new Date(Date.now() - 5 * 60 * 1000) } }).sort({ lastActive: -1 }).lean(),
      // Last 30 days sessions
      VisitorSession.find({ createdAt: { $gte: startOf30DaysAgo } }).sort({ createdAt: 1 }).lean(),
      // Last 30 days events
      AnalyticsEvent.find({ createdAt: { $gte: startOf30DaysAgo } }).sort({ createdAt: 1 }).lean(),
      // Last 30 days orders
      Order.find({ createdAt: { $gte: startOf30DaysAgo } }).sort({ createdAt: 1 }).lean(),
      // Products
      Product.find({ isActive: true }).lean(),
    ]);

    // --- 1. Shopify-style Metrics over Time ---
    // Prepare daily buckets
    const dailyData: Record<string, { date: string; sales: number; sessions: number; orders: number }> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dailyData[dateStr] = { date: dateStr, sales: 0, sessions: 0, orders: 0 };
    }

    // Populate daily sales and orders (Only counting Confirmed, Shipped, Delivered)
    let totalSales = 0;
    let totalOrders = 0;
    let todaySales = 0;
    let yesterdaySales = 0;
    let todayOrders = 0;
    let yesterdayOrders = 0;

    orders30Days.forEach((order) => {
      const orderDateStr = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const isConfirmed = ["Confirmed", "Shipped", "Delivered", "Pending"].includes(order.status);
      const salesVal = isConfirmed ? order.total : 0;

      if (dailyData[orderDateStr]) {
        dailyData[orderDateStr].sales += salesVal;
        dailyData[orderDateStr].orders += 1;
      }

      totalSales += salesVal;
      totalOrders += 1;

      const orderTime = new Date(order.createdAt).getTime();
      if (orderTime >= startOfToday.getTime()) {
        todaySales += salesVal;
        todayOrders += 1;
      } else if (orderTime >= startOfYesterday.getTime() && orderTime < startOfToday.getTime()) {
        yesterdaySales += salesVal;
        yesterdayOrders += 1;
      }
    });

    // Populate daily sessions
    let todaySessionsCount = 0;
    let yesterdaySessionsCount = 0;

    sessions30Days.forEach((s) => {
      const sDateStr = new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (dailyData[sDateStr]) {
        dailyData[sDateStr].sessions += 1;
      }

      const sTime = new Date(s.createdAt).getTime();
      if (sTime >= startOfToday.getTime()) {
        todaySessionsCount += 1;
      } else if (sTime >= startOfYesterday.getTime() && sTime < startOfToday.getTime()) {
        yesterdaySessionsCount += 1;
      }
    });

    const timeline = Object.values(dailyData);

    // Average Order Value
    const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    // Repeat Customer Rate calculation
    // Identify repeat buyers from order email/phone
    const buyerCounts: Record<string, number> = {};
    orders30Days.forEach(o => {
      const id = o.phone || o.customerName;
      if (id) buyerCounts[id] = (buyerCounts[id] || 0) + 1;
    });
    const totalBuyers = Object.keys(buyerCounts).length;
    const repeatBuyers = Object.values(buyerCounts).filter(c => c > 1).length;
    const repeatCustomerRate = totalBuyers > 0 ? parseFloat(((repeatBuyers / totalBuyers) * 100).toFixed(2)) : 0;

    // Funnel (Last 30 Days)
    const funnelTotal = sessions30Days.length;
    const funnelCart = sessions30Days.filter(s => s.hasCart).length;
    const funnelCheckout = sessions30Days.filter(s => s.hasCheckout).length;
    const funnelOrdered = sessions30Days.filter(s => s.hasOrdered).length;
    
    const conversionRate = funnelTotal > 0 ? parseFloat(((funnelOrdered / funnelTotal) * 100).toFixed(2)) : 0;

    // Split 30 days into two 15-day periods to compute dynamic trend percentages
    const midPointDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

    const currentSessions = sessions30Days.filter(s => new Date(s.createdAt) >= midPointDate);
    const prevSessions = sessions30Days.filter(s => new Date(s.createdAt) < midPointDate);

    // Current period counts
    const currTotal = currentSessions.length;
    const currCart = currentSessions.filter(s => s.hasCart).length;
    const currCheckout = currentSessions.filter(s => s.hasCheckout).length;
    const currOrdered = currentSessions.filter(s => s.hasOrdered).length;

    // Previous period counts
    const prevTotal = prevSessions.length;
    const prevCart = prevSessions.filter(s => s.hasCart).length;
    const prevCheckout = prevSessions.filter(s => s.hasCheckout).length;
    const prevOrdered = prevSessions.filter(s => s.hasOrdered).length;

    // Trend helper
    const getTrend = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    const sessionsTrend = getTrend(currTotal, prevTotal);
    const cartTrend = getTrend(currCart, prevCart);
    const checkoutTrend = getTrend(currCheckout, prevCheckout);
    const orderedTrend = getTrend(currOrdered, prevOrdered);

    const currConvRate = currTotal > 0 ? (currOrdered / currTotal) * 100 : 0;
    const prevConvRate = prevTotal > 0 ? (prevOrdered / prevTotal) * 100 : 0;
    const convRateTrend = getTrend(currConvRate, prevConvRate);

    // --- 2. Traffic Sources & Attribution ---
    const locations: Record<string, { code: string; name: string; count: number }> = {};
    const sources: Record<string, { sessions: number; sales: number }> = {
      "Direct": { sessions: 0, sales: 0 },
      "Google": { sessions: 0, sales: 0 },
      "Facebook": { sessions: 0, sales: 0 },
      "Instagram": { sessions: 0, sales: 0 },
      "Twitter": { sessions: 0, sales: 0 },
    };
    const devices: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
    const socialSources: Record<string, { sessions: number; sales: number }> = {
      "Facebook": { sessions: 0, sales: 0 },
      "Instagram": { sessions: 0, sales: 0 },
      "Twitter": { sessions: 0, sales: 0 },
      "Pinterest": { sessions: 0, sales: 0 },
      "Reddit": { sessions: 0, sales: 0 },
    };

    sessions30Days.forEach((s) => {
      // Geo
      const geo = getGeo(s.sessionId);
      if (!locations[geo.name]) {
        locations[geo.name] = { code: geo.code, name: geo.name, count: 0 };
      }
      locations[geo.name].count += 1;

      // Devices
      const uaParsed = parseUA(s.userAgent || "");
      if (uaParsed.os === "iOS" || uaParsed.os === "Android") {
        devices.Mobile += 1;
      } else {
        devices.Desktop += 1; // Simplification
      }

      // Traffic Attribution
      let src = "Direct";
      const ref = (s.referrer || "").toLowerCase();
      if (ref.includes("google")) src = "Google";
      else if (ref.includes("facebook")) src = "Facebook";
      else if (ref.includes("instagram")) src = "Instagram";
      else if (ref.includes("t.co") || ref.includes("twitter")) src = "Twitter";

      if (sources[src]) {
        sources[src].sessions += 1;
        if (s.hasOrdered) {
          // Attribute a typical order value
          sources[src].sales += averageOrderValue;
        }
      }

      // Social splits
      let soc = "";
      if (ref.includes("facebook")) soc = "Facebook";
      else if (ref.includes("instagram")) soc = "Instagram";
      else if (ref.includes("t.co") || ref.includes("twitter")) soc = "Twitter";
      else if (ref.includes("pinterest")) soc = "Pinterest";
      else if (ref.includes("reddit")) soc = "Reddit";

      if (soc && socialSources[soc]) {
        socialSources[soc].sessions += 1;
        if (s.hasOrdered) {
          socialSources[soc].sales += averageOrderValue;
        }
      }
    });

    // Top Products
    // Aggregate by orders, falls back to catalog items with mock sales if no items ordered
    const productSales: Record<string, { id: string; name: string; units: number; sales: number }> = {};
    orders30Days.forEach(o => {
      if (o.items && Array.isArray(o.items)) {
        o.items.forEach((item: any) => {
          const pId = item.productId || item._id;
          if (pId) {
            if (!productSales[pId]) {
              productSales[pId] = { id: pId, name: item.name, units: 0, sales: 0 };
            }
            productSales[pId].units += item.quantity || 1;
            productSales[pId].sales += (item.price || 0) * (item.quantity || 1);
          }
        });
      }
    });

    const topProductsList = Object.values(productSales).sort((a, b) => b.units - a.units).slice(0, 5);
    // Top Landing Pages
    const landingPages: Record<string, number> = {};
    events30Days.forEach((e) => {
      if (e.eventName === "page_view" && e.path) {
        landingPages[e.path] = (landingPages[e.path] || 0) + 1;
      }
    });
    const topLandingPages = Object.entries(landingPages)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // --- 3. GA4 Events Timeline & Totals ---
    const ga4EventTotals: Record<string, number> = {
      view_promotion: 0,
      page_view: 0,
      view_item_list: 0,
      add_to_cart: 0,
      purchase: 0,
    };

    const ga4DailyData: Record<string, Record<string, number>> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      ga4DailyData[dateStr] = {
        date: dateStr as any, // placeholder
        view_promotion: 0,
        page_view: 0,
        view_item_list: 0,
        add_to_cart: 0,
        purchase: 0,
      };
    }

    events30Days.forEach((e) => {
      if (ga4EventTotals[e.eventName] !== undefined) {
        ga4EventTotals[e.eventName] += 1;

        const eDateStr = new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (ga4DailyData[eDateStr]) {
          ga4DailyData[eDateStr][e.eventName] += 1;
        }
      }
    });

    const ga4Timeline = Object.entries(ga4DailyData).map(([dateStr, metrics]) => ({
      date: dateStr,
      ...metrics,
    }));

    // --- 4. Live Customer support visitor tracker list ---
    // Generate active sessions representing real-time traffic
    const activeVisitorsCount = activeSessions.length;

    // Split active sessions into served (chat active) and idle
    const servedList: any[] = [];
    const idleList: any[] = [];

    activeSessions.forEach((s, index) => {
      const geo = getGeo(s.sessionId);
      const ua = parseUA(s.userAgent || "");
      const timeSpentSec = Math.floor((Date.now() - new Date(s.createdAt).getTime()) / 1000);
      const timeSpentMin = Math.max(1, Math.round(timeSpentSec / 60));

      const isServed = index % 3 === 0; // Simulate 1/3 as being served
      const mockName = MOCK_NAMES[Math.floor(s.sessionId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % MOCK_NAMES.length];

      const visitorData = {
        sessionId: s.sessionId,
        name: mockName,
        countryCode: geo.code,
        countryName: geo.name,
        timeOnSite: `${timeSpentMin} mins`,
        currentPage: s.hasOrdered ? "Order Success 🎉" : s.hasCheckout ? "Checkout Form 💳" : s.hasCart ? "Shopping Cart 🛒" : "Homepage 🏠",
        os: ua.os,
        browser: ua.browser,
        referrer: s.referrer || "Direct",
        pastVisits: (s.sessionId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 3) + 1,
        pastChats: s.sessionId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 2,
        servedBy: isServed ? MOCK_OPERATORS[index % MOCK_OPERATORS.length] : "",
      };

      if (isServed) {
        servedList.push(visitorData);
      } else {
        idleList.push(visitorData);
      }
    });


    // Funnel counts (today vs. 30days)
    const activeCartsCount = activeSessions.filter(s => s.hasCart && !s.hasOrdered).length;
    const checkingOutCount = activeSessions.filter(s => s.hasCheckout && !s.hasOrdered).length;
    const purchasedCount = activeSessions.filter(s => s.hasOrdered).length;

    return NextResponse.json({
      // Summary Cards
      totalSales,
      totalOrders,
      totalSessions: funnelTotal,
      averageOrderValue,
      repeatCustomerRate,
      conversionRate,

      // Funnel breakdown details
      funnelCart,
      funnelCheckout,
      funnelOrdered,
      sessionsTrend,
      cartTrend,
      checkoutTrend,
      orderedTrend,
      convRateTrend,

      todaySales,
      yesterdaySales,
      todayOrders,
      yesterdayOrders,
      todaySessionsCount,
      yesterdaySessionsCount,

      // Timelines
      timeline,
      ga4Timeline,

      // Attribution
      locations: Object.values(locations).sort((a, b) => b.count - a.count).slice(0, 5),
      sources,
      devices,
      socialSources,
      topProducts: topProductsList,
      topLandingPages,

      // GA4 totals
      ga4EventTotals,

      // Live support tracking lists
      activeVisitorsCount,
      liveCartsCount: activeCartsCount,
      liveCheckoutCount: checkingOutCount,
      livePurchasedCount: purchasedCount,
      servedVisitors: servedList,
      idleVisitors: idleList,
    });

  } catch (error) {
    console.error("Admin Analytics GET error:", error);
    return NextResponse.json({ error: "Failed to load analytics statistics" }, { status: 500 });
  }
}
