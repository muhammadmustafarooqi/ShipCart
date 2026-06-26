import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Coupon from "@/models/Coupon";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Please log in to apply this coupon." }, { status: 401 });
  }

  try {
    const { couponCode } = await request.json();
    if (!couponCode || !couponCode.trim()) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const code = couponCode.trim().toUpperCase();
    await connectDB();

    // 1. Check Global Admin Coupons First
    const globalCoupon = await Coupon.findOne({ code, isActive: true });
    if (globalCoupon) {
      if (globalCoupon.expiresAt && new Date(globalCoupon.expiresAt) < new Date()) {
        return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
      }
      if (globalCoupon.usageLimit && globalCoupon.timesUsed >= globalCoupon.usageLimit) {
        return NextResponse.json({ error: "This coupon's usage limit has been reached." }, { status: 400 });
      }

      let description = "";
      if (globalCoupon.discountType === "percentage") description = `${globalCoupon.discountValue}% OFF Discount on your subtotal`;
      else if (globalCoupon.discountType === "fixed") description = `Flat Rs. ${globalCoupon.discountValue} OFF Discount`;
      else if (globalCoupon.discountType === "free_shipping") description = `Free Shipping Delivery`;

      return NextResponse.json({
        success: true,
        isGlobal: true,
        couponCode: code,
        discountType: globalCoupon.discountType,
        discountValue: globalCoupon.discountValue,
        minPurchase: globalCoupon.minPurchase,
        description,
      });
    }

    // 2. Fallback to Spin-to-Win User Coupons
    // Find the user who owns this coupon
    const couponOwner = await User.findOne({ couponCode: code });
    if (!couponOwner) {
      return NextResponse.json({ error: "Invalid coupon code." }, { status: 400 });
    }

    // Check if coupon belongs to the logged in user
    if (couponOwner.email.toLowerCase() !== session.user.email.toLowerCase()) {
      return NextResponse.json({ error: "This coupon is linked to a different account." }, { status: 400 });
    }

    // Check if used
    if (couponOwner.couponStatus === "used") {
      return NextResponse.json({ error: "This coupon has already been used." }, { status: 400 });
    }

    // Check if expired
    if (couponOwner.couponExpiry && new Date(couponOwner.couponExpiry) < new Date()) {
      return NextResponse.json({ error: "This coupon has expired (valid for 48 hours only)." }, { status: 400 });
    }

    // Determine coupon rules based on the code prefix
    const prefix = code.split("-")[0];
    let discountType = prefix;
    let description = "";

    switch (prefix) {
      case "WIN10":
        description = "10% OFF Discount on your subtotal";
        break;
      case "WIN5":
        description = "5% OFF Discount on your subtotal";
        break;
      case "FREE":
        description = "Free Shipping Delivery on this order";
        break;
      case "CASH150":
        description = "Flat Rs. 150 Gift Voucher discount";
        break;
      case "CASH200":
        description = "Flat Rs. 200 OFF Discount on your order";
        break;
      case "RETURNS":
        description = "Hassle-Free Returns + 10% OFF Discount on your order";
        break;
      case "B2G10":
        description = "10% OFF on subtotal (requires minimum 2 items)";
        break;
      case "B3G15":
        description = "15% OFF on subtotal (requires minimum 3 items)";
        break;
      case "GIFT":
        description = "Surprise Gift item will be added to your parcel!";
        break;
      case "B4G1":
        description = "Buy 4 Get 1 Free (cheapest item is free, requires minimum 4 items)";
        break;
      default:
        return NextResponse.json({ error: "Invalid coupon format." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      couponCode: code,
      discountType,
      description,
      expiry: couponOwner.couponExpiry
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
