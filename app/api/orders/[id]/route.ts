import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const order = await Order.findOne({ orderId: id }).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found", requestedId: id || "undefined_id" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order GET error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();

    const updateFields: any = {};
    if (body.status) updateFields.status = body.status;
    if (body.trackingNumber !== undefined) updateFields.trackingNumber = body.trackingNumber;
    if (body.courierName !== undefined) updateFields.courierName = body.courierName;

    const order = await Order.findOneAndUpdate(
      { orderId: id },
      { $set: updateFields },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found", requestedId: id || "undefined_id" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order PATCH error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
