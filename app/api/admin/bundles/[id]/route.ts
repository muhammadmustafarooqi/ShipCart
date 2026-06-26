import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Bundle from "@/models/Bundle";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();

    const { product, packs, isActive } = body;

    if (packs && (!Array.isArray(packs) || packs.length === 0)) {
      return NextResponse.json({ error: "At least 1 pack is required" }, { status: 400 });
    }

    // Check if updating to a product that already has a bundle (excluding this one)
    if (product) {
      const existing = await Bundle.findOne({ product, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: "A bundle already exists for this product" }, { status: 400 });
      }
    }

    const bundle = await Bundle.findByIdAndUpdate(
      id,
      {
        product,
        packs,
        isActive,
      },
      { new: true }
    );

    if (!bundle) return NextResponse.json({ error: "Bundle not found" }, { status: 404 });

    return NextResponse.json({ bundle });
  } catch (error) {
    console.error("Bundle PUT error:", error);
    return NextResponse.json({ error: "Failed to update bundle" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    const bundle = await Bundle.findByIdAndDelete(id);
    if (!bundle) return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bundle DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete bundle" }, { status: 500 });
  }
}
