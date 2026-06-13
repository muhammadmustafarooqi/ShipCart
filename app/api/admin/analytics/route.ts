import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import VisitorSession from "@/models/VisitorSession";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import Order from "@/models/Order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAK_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
];

// Simulated geographical resolver via ID/IP hashing
function getSimulatedCity(ip: string, sessionId: string) {
  const str = (ip || "") + (sessionId || "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PAK_CITIES.length;
  return PAK_CITIES[index];
}

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // 1. Real-time active sessions count (last 5 minutes)
    const activeSessionsCount = await VisitorSession.countDocuments({
      lastActive: { $gte: fiveMinutesAgo },
    });

    // 2. Fetch sessions and confirmed/completed orders in the last 30 days
    const [sessions30Days, orders30Days] = await Promise.all([
      VisitorSession.find({ createdAt: { $gte: thirtyDaysAgo } }).lean(),
      Order.find({
        createdAt: { $gte: thirtyDaysAgo },
        status: { $in: ["Confirmed", "Shipped", "Delivered"] },
      }).lean(),
    ]);

    // 3. Shopify-style sales revenue trends & AOV
    const revenueByDay: Record<string, number> = {};
    // Populate all 30 days with initial value of 0
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      revenueByDay[dayStr] = 0;
    }

    let totalRevenue = 0;
    orders30Days.forEach((order) => {
      const dayStr = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (dayStr in revenueByDay) {
        revenueByDay[dayStr] += order.total;
      }
      totalRevenue += order.total;
    });

    const orderCount = orders30Days.length;
    const aov = orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0;

    const salesTrend = Object.keys(revenueByDay).map((day) => ({
      date: day,
      revenue: revenueByDay[day],
    }));

    // 4. Repeat Customer Rate (RCR)
    const repeatCustomers = await Order.aggregate([
      { $group: { _id: "$phone", orderCount: { $sum: 1 } } },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          repeatCustomers: {
            $sum: { $cond: [{ $gt: ["$orderCount", 1] }, 1, 0] },
          },
        },
      },
    ]);
    const totalCust = repeatCustomers[0]?.totalCustomers || 0;
    const repeatCust = repeatCustomers[0]?.repeatCustomers || 0;
    const rcr = totalCust > 0 ? parseFloat(((repeatCust / totalCust) * 100).toFixed(2)) : 0;

    // 5. Conversion Funnel Progress
    const totalSessions = sessions30Days.length;
    const sessionsWithCart = sessions30Days.filter((s) => s.hasCart).length;
    const sessionsWithCheckout = sessions30Days.filter((s) => s.hasCheckout).length;
    const sessionsWithOrder = sessions30Days.filter((s) => s.hasOrdered).length;

    const funnel = {
      totalSessions,
      sessionsWithCart,
      sessionsWithCheckout,
      sessionsWithOrder,
      cartRate: totalSessions > 0 ? parseFloat(((sessionsWithCart / totalSessions) * 100).toFixed(2)) : 0,
      checkoutRate: sessionsWithCart > 0 ? parseFloat(((sessionsWithCheckout / sessionsWithCart) * 100).toFixed(2)) : 0,
      purchaseRate: sessionsWithCheckout > 0 ? parseFloat(((sessionsWithOrder / sessionsWithCheckout) * 100).toFixed(2)) : 0,
      overallConversionRate: totalSessions > 0 ? parseFloat(((sessionsWithOrder / totalSessions) * 100).toFixed(2)) : 0,
    };

    // 6. Device breakdown
    let desktopCount = 0;
    let mobileCount = 0;
    let tabletCount = 0;

    sessions30Days.forEach((s) => {
      const ua = s.userAgent || "";
      if (/ipad|tablet/i.test(ua)) {
        tabletCount++;
      } else if (/mobile|android|iphone|phone/i.test(ua)) {
        mobileCount++;
      } else {
        desktopCount++;
      }
    });

    const devices = [
      { name: "Desktop", count: desktopCount },
      { name: "Mobile", count: mobileCount },
      { name: "Tablet", count: tabletCount },
    ];

    // 7. Geographical locations (Pakistan cities - simulated via ID hashing)
    const cityCounts: Record<string, number> = {};
    sessions30Days.forEach((s) => {
      const city = getSimulatedCity(s.ip, s.sessionId);
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    const geography = Object.keys(cityCounts)
      .map((city) => ({
        city,
        visitors: cityCounts[city],
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5);

    // 8. Traffic Acquisition Channels
    let directCount = 0;
    let googleCount = 0;
    let facebookCount = 0;
    let whatsappCount = 0;
    let otherCount = 0;

    sessions30Days.forEach((s) => {
      const ref = (s.referrer || "").toLowerCase();
      if (!ref || ref === "direct" || ref === "") {
        directCount++;
      } else if (ref.includes("google")) {
        googleCount++;
      } else if (
        ref.includes("facebook") ||
        ref.includes("instagram") ||
        ref.includes("fb.me") ||
        ref.includes("l.facebook.com")
      ) {
        facebookCount++;
      } else if (ref.includes("whatsapp") || ref.includes("wa.me")) {
        whatsappCount++;
      } else {
        otherCount++;
      }
    });

    const channels = [
      { name: "Direct", value: directCount },
      { name: "Google Search", value: googleCount },
      { name: "Meta Ads / Social", value: facebookCount },
      { name: "WhatsApp", value: whatsappCount },
      { name: "Other Referral", value: otherCount },
    ];

    // 9. Top Performing Products sold in the 30-day window
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    orders30Days.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.productId || item.name;
        if (!productSales[key]) {
          productSales[key] = { name: item.name, quantity: 0, revenue: 0 };
        }
        productSales[key].quantity += item.quantity;
        productSales[key].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // 10. Top Landing / Visited paths (page_views)
    const pageViews = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventName: "page_view",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: "$path",
          views: { $sum: 1 },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 5 },
    ]);

    const topPages = pageViews.map((pv) => ({
      path: pv._id,
      views: pv.views,
    }));

    return NextResponse.json({
      activeSessions: activeSessionsCount,
      totalRevenue,
      aov,
      rcr,
      salesTrend,
      funnel,
      devices,
      geography,
      channels,
      topProducts,
      topPages,
    });
  } catch (error) {
    console.error("Analytics GET endpoint error:", error);
    return NextResponse.json({ error: "Failed to generate analytics report" }, { status: 500 });
  }
}
