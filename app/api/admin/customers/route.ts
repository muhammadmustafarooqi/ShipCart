import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const orders = await Order.find({}).lean();

    // Group orders by customer phone (unique identifier)
    const customerMap = new Map();

    orders.forEach((order) => {
      const phone = order.phone;
      
      if (customerMap.has(phone)) {
        const existing = customerMap.get(phone);
        existing.totalOrders += 1;
        existing.totalSpent += order.total;
        if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.createdAt;
        }
      } else {
        customerMap.set(phone, {
          _id: order._id.toString(),
          name: order.customerName,
          phone: order.phone,
          city: order.city,
          totalOrders: 1,
          totalSpent: order.total,
          lastOrderDate: order.createdAt,
        });
      }
    });

    const customers = Array.from(customerMap.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent
    );

    const stats = {
      total: customers.length,
      active: customers.filter((c) => c.totalOrders > 0).length,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    };

    return NextResponse.json({ customers, stats });
  } catch (error) {
    console.error("Customers GET error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
