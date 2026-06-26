import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      {
        code: body.code.toUpperCase(),
        discountType: body.discountType,
        discountValue: body.discountValue,
        minPurchase: body.minPurchase,
        expiresAt: body.expiresAt || null,
        usageLimit: body.usageLimit || null,
        isActive: body.isActive,
      },
      { new: true }
    );

    if (!coupon) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("Coupon PUT error:", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Coupon DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
