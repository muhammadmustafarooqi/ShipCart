import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const phone = searchParams.get("phone");

    if (!orderId || !phone) {
      return NextResponse.json({ error: "Order ID and Phone Number are required" }, { status: 400 });
    }

    await connectDB();
    
    // Format phone to match stored format if needed (simple trim for now)
    const formattedPhone = phone.trim();
    const formattedOrderId = orderId.trim();

    const order = await Order.findOne({ 
      orderId: { $regex: new RegExp(`^${formattedOrderId}$`, "i") }, 
      phone: formattedPhone 
    }).lean();

    if (!order) {
      return NextResponse.json({ error: "No order found with these details. Please check your Order ID and Phone Number." }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        orderId: order.orderId,
        status: order.status,
        customerName: order.customerName,
        createdAt: order.createdAt,
        total: order.total,
        trackingNumber: order.trackingNumber || null,
        courierName: order.courierName || null,
        items: order.items.map((i: any) => ({ name: i.name, quantity: i.quantity, image: i.image }))
      }
    });

  } catch (error) {
    console.error("Order Tracking GET error:", error);
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 });
  }
}
