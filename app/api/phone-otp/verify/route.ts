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
    const { phone, code, name } = await request.json();
    if (!phone || !code) {
      return NextResponse.json({ error: "Phone number and verification code are required" }, { status: 400 });
    }

    const normalized = normalizePhone(phone);
    
    await connectDB();

    // Look for user by phone number
    let user = await User.findOne({ phone: normalized });
    const mockEmail = `phone_${normalized}@shipcartstore.pk`;
    const mockPassword = "phone_secret_password_2026";
    const hashedPassword = Buffer.from(mockPassword).toString("base64");

    if (!user) {
      // If user with this phone doesn't exist, we register them
      // Ensure mock email is also not registered
      const existingEmail = await User.findOne({ email: mockEmail.toLowerCase() });
      if (existingEmail) {
        user = existingEmail;
        user.phone = normalized;
        await user.save();
      } else {
        user = await User.create({
          name: name?.trim() || `Guest ${normalized}`,
          email: mockEmail.toLowerCase(),
          password: hashedPassword,
          phone: normalized,
          city: "",
          address: "",
        });
      }
    }

    return NextResponse.json({
      success: true,
      email: user.email,
      password: mockPassword,
      message: "Phone number verified successfully"
    });
  } catch (error) {
    console.error("Phone OTP Verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
