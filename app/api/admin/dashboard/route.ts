import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import VisitorSession from "@/models/VisitorSession";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    // Active visitors in the last 5 minutes
    const activeThreshold = new Date(Date.now() - 5 * 60 * 1000);

    const [
      todayOrders,
      yesterdayOrders,
      weekOrders,
      totalOrders,
      pendingOrders,
      recentOrders,
      totalProducts,
      totalRevenue,
      todayRevenueData,
      yesterdayRevenueData,
      activeVisitorsCount,
      todayVisitorsCount,
      yesterdayVisitorsCount,
      funnelToday,
      abandonedCartsCount,
      abandonedCheckoutsCount,
      recentSessions,
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ createdAt: { $gte: startOfYesterday, $lt: startOfToday } }),
      Order.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Order.countDocuments(),
      Order.countDocuments({ status: "Pending" }),
      Order.find().sort({ createdAt: -1 }).limit(10).lean(),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { status: { $in: ["Confirmed", "Shipped", "Delivered"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfToday }, status: { $in: ["Pending", "Confirmed", "Shipped", "Delivered"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfYesterday, $lt: startOfToday }, status: { $in: ["Pending", "Confirmed", "Shipped", "Delivered"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      VisitorSession.countDocuments({ lastActive: { $gte: activeThreshold } }),
      VisitorSession.countDocuments({ lastActive: { $gte: startOfToday } }),
      VisitorSession.countDocuments({ lastActive: { $gte: startOfYesterday, $lt: startOfToday } }),
      VisitorSession.aggregate([
        { $match: { lastActive: { $gte: startOfToday } } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            cart: { $sum: { $cond: ["$hasCart", 1, 0] } },
            checkout: { $sum: { $cond: ["$hasCheckout", 1, 0] } },
            ordered: { $sum: { $cond: ["$hasOrdered", 1, 0] } },
          }
        }
      ]),
      VisitorSession.countDocuments({ lastActive: { $gte: startOfToday }, hasCart: true, hasOrdered: false }),
      VisitorSession.countDocuments({ lastActive: { $gte: startOfToday }, hasCheckout: true, hasOrdered: false }),
      VisitorSession.find({ lastActive: { $gte: new Date(Date.now() - 60 * 60 * 1000) } })
        .sort({ lastActive: -1 })
        .limit(20)
        .lean(),
    ]);

    const funnel = {
      total: funnelToday[0]?.total || 0,
      cart: funnelToday[0]?.cart || 0,
      checkout: funnelToday[0]?.checkout || 0,
      ordered: funnelToday[0]?.ordered || 0,
    };

    return NextResponse.json({
      todayOrders,
      yesterdayOrders,
      weekOrders,
      totalOrders,
      pendingOrders,
      recentOrders,
      totalProducts,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayRevenue: todayRevenueData[0]?.total || 0,
      yesterdayRevenue: yesterdayRevenueData[0]?.total || 0,
      activeVisitorsCount,
      todayVisitorsCount,
      yesterdayVisitorsCount,
      funnel,
      abandonedCartsCount,
      abandonedCheckoutsCount,
      recentSessions: recentSessions.map((s: any) => ({
        sessionId: s.sessionId,
        userAgent: s.userAgent || "",
        referrer: s.referrer || "Direct",
        hasCart: s.hasCart,
        hasCheckout: s.hasCheckout,
        hasOrdered: s.hasOrdered,
        lastActive: s.lastActive,
      })),
    });
  } catch (error) {
    console.error("Dashboard GET error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
