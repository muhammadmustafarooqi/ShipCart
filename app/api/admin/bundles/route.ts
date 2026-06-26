import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Bundle from "@/models/Bundle";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const bundles = await Bundle.find().populate("product", "name slug price images").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ bundles });
  } catch (error) {
    console.error("Bundles GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bundles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    await connectDB();

    const { product, packs, isActive } = body;

    if (!product) {
      return NextResponse.json({ error: "Product is required" }, { status: 400 });
    }
    if (!packs || !Array.isArray(packs) || packs.length === 0) {
      return NextResponse.json({ error: "At least 1 pack is required" }, { status: 400 });
    }

    const existing = await Bundle.findOne({ product });
    if (existing) {
      return NextResponse.json({ error: "A bundle already exists for this product" }, { status: 400 });
    }

    const bundle = await Bundle.create({
      product,
      packs,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ bundle }, { status: 201 });
  } catch (error) {
    console.error("Bundles POST error:", error);
    return NextResponse.json({ error: "Failed to create bundle" }, { status: 500 });
  }
}
