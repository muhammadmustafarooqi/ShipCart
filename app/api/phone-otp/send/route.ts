import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");
  if (cleaned.startsWith("+92")) {
    cleaned = "0" + cleaned.substring(3);
  } else if (cleaned.startsWith("92")) {
    cleaned = "0" + cleaned.substring(2);
  } else if (cleaned.length === 10 && cleaned.startsWith("3")) {
    cleaned = "0" + cleaned;
  }
  return cleaned;
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const normalized = normalizePhone(phone);
    if (!/^03[0-9]{9}$/.test(normalized)) {
      return NextResponse.json({ error: "Invalid phone number format. Please enter a valid Pakistani number (e.g. 03XXXXXXXXX or +92 3XXXXXXXXX)" }, { status: 400 });
    }

    await connectDB();

    // Anti-abuse: Check if this phone is linked to a user who has already spun
    const existingUser = await User.findOne({ phone: normalized });
    if (existingUser && existingUser.hasSpun) {
      return NextResponse.json({ error: "This phone number has already spun the wheel!" }, { status: 400 });
    }

    // Generate a random 4-digit OTP code
    const otp = Math.floor(Math.random() * 9000) + 1000;

    return NextResponse.json({
      success: true,
      phone: normalized,
      otp: otp.toString(),
      message: `SMS Gateway Simulator: Verification code for ${normalized} is ${otp}`
    });
  } catch (error) {
    console.error("Phone OTP Send error:", error);
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
  }
}
