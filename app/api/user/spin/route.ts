import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

export const SPIN_OPTIONS = [
  "Surprise Gift",
  "Special Discount",
  "Buy 1 Get 5% Off",
  "Buy 2 Get 10% Off",
  "Buy 3 Get 15% Off",
  "Buy 4 Get 1 Free",
  "Free Delivery",
  "Rs. 2,400 Cashback",
  "Rs. 150 Gift Voucher (On Rs. 3,000+)",
  "Next Time",
  "Free Product"
];

export async function POST() {
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

    if (user.hasSpun && session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "You have already spun the wheel!" },
        { status: 400 }
      );
    }

    // Securely roll a random index on the server
    const rolledIndex = Math.floor(Math.random() * SPIN_OPTIONS.length);
    const rolledPrize = SPIN_OPTIONS[rolledIndex];

    // Save to database
    user.hasSpun = true;
    user.spinResult = rolledPrize;
    user.spunAt = new Date();
    await user.save();

    return NextResponse.json({
      prize: rolledPrize,
      index: rolledIndex,
      spunAt: user.spunAt
    });
  } catch (error) {
    console.error("Spin POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
