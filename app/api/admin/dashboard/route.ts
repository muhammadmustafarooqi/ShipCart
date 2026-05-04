import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const [
      todayOrders,
      weekOrders,
      totalOrders,
      pendingOrders,
      recentOrders,
      totalProducts,
      totalRevenue,
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Order.countDocuments(),
      Order.countDocuments({ status: "Pending" }),
      Order.find().sort({ createdAt: -1 }).limit(10).lean(),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { status: { $in: ["Confirmed", "Shipped", "Delivered"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    return NextResponse.json({
      todayOrders,
      weekOrders,
      totalOrders,
      pendingOrders,
      recentOrders,
      totalProducts,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    console.error("Dashboard GET error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
