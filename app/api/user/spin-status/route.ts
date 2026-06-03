import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    
    let user = await User.findOne({ email: session.user.email.toLowerCase() });
    
    // If the logged-in user is the admin (configured in env), create their DB record so they can test spins.
    if (!user && session.user.email === process.env.ADMIN_EMAIL) {
      user = await User.create({
        name: session.user.name || "Admin",
        email: session.user.email.toLowerCase(),
        password: "admin-hashed-placeholder",
        phone: "03000000000",
        city: "Lahore",
        address: "Admin HQ",
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      hasSpun: !!user.hasSpun,
      spinResult: user.spinResult || "",
      spunAt: user.spunAt || null
    });
  } catch (error) {
    console.error("Spin status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
