import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/lib/auth";

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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const order = await Order.findOneAndDelete({ orderId: id });

    if (!order) {
      return NextResponse.json({ error: "Order not found", requestedId: id || "undefined_id" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Order DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
