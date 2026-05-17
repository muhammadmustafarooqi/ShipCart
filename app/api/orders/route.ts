import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Settings from "@/models/Settings";
import { generateOrderId, validatePakistaniPhone, calculateShipping } from "@/lib/utils";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  // Protect: only admin can list all orders
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100); // cap at 100
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

    // ── Server-side validation ──────────────────────────────────────
    if (!body.customerName?.trim()) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }
    if (!body.phone?.trim() || !validatePakistaniPhone(body.phone)) {
      return NextResponse.json({ error: "Valid Pakistani phone number is required" }, { status: 400 });
    }
    if (!body.city?.trim()) {
      return NextResponse.json({ error: "City is required" }, { status: 400 });
    }
    if (!body.address?.trim() || body.address.trim().length < 10) {
      return NextResponse.json({ error: "Complete delivery address is required" }, { status: 400 });
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Order must contain at least one item" }, { status: 400 });
    }

    // Fetch settings for dynamic shipping calculation
    let settings = await Settings.findOne();
    const freeDeliveryAbove = settings?.freeDeliveryAbove || 3000;
    const deliveryFee = settings?.deliveryFee || 200;

    // Validate and recalculate totals server-side (never trust the client)
    const validatedItems = body.items.map((item: { productId: string; name: string; price: number; quantity: number; image?: string }) => {
      if (!item.productId || !item.name || typeof item.price !== "number" || item.price <= 0 || typeof item.quantity !== "number" || item.quantity < 1) {
        throw new Error("Invalid item data");
      }
      return {
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: Math.floor(item.quantity),
        image: item.image || "",
      };
    });

    const recalcSubtotal = validatedItems.reduce(
      (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
      0
    );
    const recalcShipping = calculateShipping(recalcSubtotal, freeDeliveryAbove, deliveryFee);
    const recalcTotal = recalcSubtotal + recalcShipping;

    // Generate unique order ID
    let orderId = generateOrderId();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await Order.findOne({ orderId });
      if (!existing) break;
      orderId = generateOrderId();
      attempts++;
    }

    const order = await Order.create({
      orderId,
      customerName: body.customerName.trim(),
      phone: body.phone.trim(),
      city: body.city.trim(),
      address: body.address.trim(),
      notes: body.notes?.trim() || "",
      items: validatedItems,
      subtotal: recalcSubtotal,
      shippingFee: recalcShipping,
      total: recalcTotal,
      paymentMethod: "COD",
      status: "Pending",
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
