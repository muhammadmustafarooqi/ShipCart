import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    // Find all users who have spun the wheel (hasSpun is true)
    const users = await User.find({ hasSpun: true })
      .select("name email phone city spinResult spunAt")
      .sort({ spunAt: -1 })
      .lean();

    return NextResponse.json({ spins: users });
  } catch (error) {
    console.error("Admin spins GET error:", error);
    return NextResponse.json({ error: "Failed to fetch spin results" }, { status: 500 });
  }
}
