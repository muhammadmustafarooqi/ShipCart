import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Banner from "@/models/Banner";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    
    const query = includeInactive ? {} : { isActive: true };
    const banners = await Banner.find(query).sort({ order: 1 }).lean();
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
    // Revalidate homepage to show new banner
    revalidatePath("/");
    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error("Banners POST error:", error);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
