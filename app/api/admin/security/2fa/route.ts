import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { generateSecret, generateURI, verify } from "otplib";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const settings = await Settings.findOne();
    return NextResponse.json({ 
      isTwoFactorEnabled: settings?.security?.isTwoFactorEnabled || false 
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, token, secret } = await req.json();
    await connectDB();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    if (action === "setup") {
      // Generate a new secret
      const newSecret = generateSecret();
      const otpauthUrl = generateURI({
        label: session.user?.email || "admin@cartshipstore.pk",
        issuer: settings.storeName || "CartShip",
        secret: newSecret
      });
      return NextResponse.json({ secret: newSecret, otpauthUrl });
    }

    if (action === "verify") {
      // Verify token with provided secret
      if (!token || !secret) {
        return NextResponse.json({ error: "Missing token or secret" }, { status: 400 });
      }

      const isValid = verify({ token, secret });
      if (!isValid) {
        return NextResponse.json({ error: "Invalid authentication code" }, { status: 400 });
      }

      // Save to database
      settings.security = {
        isTwoFactorEnabled: true,
        twoFactorSecret: secret,
      };
      await settings.save();
      return NextResponse.json({ success: true });
    }

    if (action === "disable") {
      settings.security = {
        isTwoFactorEnabled: false,
        twoFactorSecret: "",
      };
      await settings.save();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("2FA Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
