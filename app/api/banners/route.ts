import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Banner from "@/models/Banner";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

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
  // Protect: only admin
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
