import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Banner from "@/models/Banner";

export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 }).lean();
    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Banners GET error:", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const banner = await Banner.create(body);
    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error("Banners POST error:", error);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
