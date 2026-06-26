import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

export const SPIN_OPTIONS = [
  "10% OFF",
  "5% OFF",
  "Free Delivery",
  "Rs.150 Voucher",
  "Buy 2 Get 10% OFF",
  "Buy 3 Get 15% OFF",
  "Surprise Gift",
  "Buy 4 Get 1 Free"
];

const PRIZE_WEIGHTS = [
  { name: "10% OFF", weight: 15, prefix: "WIN10" },
  { name: "5% OFF", weight: 25, prefix: "WIN5" },
  { name: "Free Delivery", weight: 30, prefix: "FREE" },
  { name: "Rs.150 Voucher", weight: 10, prefix: "CASH150" },
  { name: "Buy 2 Get 10% OFF", weight: 10, prefix: "B2G10" },
  { name: "Buy 3 Get 15% OFF", weight: 5, prefix: "B3G15" },
  { name: "Surprise Gift", weight: 4, prefix: "GIFT" },
  { name: "Buy 4 Get 1 Free", weight: 1, prefix: "B4G1" },
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

    // Weighted random logic
    const totalWeight = PRIZE_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);
    let randomNum = Math.floor(Math.random() * totalWeight);
    let selectedPrize = PRIZE_WEIGHTS[0];
    let rolledIndex = 0;

    for (let i = 0; i < PRIZE_WEIGHTS.length; i++) {
      if (randomNum < PRIZE_WEIGHTS[i].weight) {
        selectedPrize = PRIZE_WEIGHTS[i];
        rolledIndex = i;
        break;
      }
      randomNum -= PRIZE_WEIGHTS[i].weight;
    }

    const rolledPrize = selectedPrize.name;

    // Generate unique coupon code format (e.g. WIN10-ABCD)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let suffix = "";
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const couponCode = `${selectedPrize.prefix}-${suffix}`;
    const couponExpiry = new Date();
    couponExpiry.setHours(couponExpiry.getHours() + 48); // 48 hours expiry

    // Save to database
    user.hasSpun = true;
    user.spinResult = rolledPrize;
    user.spunAt = new Date();
    user.couponCode = couponCode;
    user.couponExpiry = couponExpiry;
    user.couponStatus = "active";
    await user.save();

    return NextResponse.json({
      prize: rolledPrize,
      index: rolledIndex,
      code: couponCode,
      expiry: couponExpiry,
      spunAt: user.spunAt
    });
  } catch (error) {
    console.error("Spin POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
