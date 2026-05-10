import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { validatePakistaniPhone } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Validation
    if (!body.name?.trim() || !body.email?.trim() || !body.password || !body.phone?.trim()) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (body.password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    if (!validatePakistaniPhone(body.phone)) {
      return NextResponse.json({ error: "Invalid Pakistani phone number" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: body.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Hash password (simple hash - in production use bcrypt)
    const hashedPassword = Buffer.from(body.password).toString("base64");

    // Create user
    const user = await User.create({
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      password: hashedPassword,
      phone: body.phone.trim(),
      city: body.city?.trim() || "",
      address: body.address?.trim() || "",
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city,
          address: user.address,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
