import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Bundle from "@/models/Bundle";
import Product from "@/models/Product"; // ensure it's registered

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    await connectDB();
    
    // We need to populate the allowedProducts array so the frontend can display them
    const bundle = await Bundle.findOne({ slug, isActive: true })
      .populate({
        path: 'allowedProducts',
        model: 'Product',
        select: 'name slug price images comparePrice isFeatured isNewArrival isActive rating reviewCount',
      })
      .lean();

    if (!bundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    return NextResponse.json({ bundle });
  } catch (error) {
    console.error("Bundle GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bundle" }, { status: 500 });
  }
}
