import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { generateOrderId } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (status && status !== "all") query.status = status;

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({ orders, total, pages: Math.ceil(total / limit), page });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Generate unique order ID
    let orderId = generateOrderId();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await Order.findOne({ orderId });
      if (!existing) break;
      orderId = generateOrderId();
      attempts++;
    }

    const order = await Order.create({ ...body, orderId, paymentMethod: "COD", status: "Pending" });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
