import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary is not configured in .env.local" }, { status: 503 });
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // We only sign the 'folder' parameter for security. No other params needed.
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: "allinonestore" },
      apiSecret
    );

    return NextResponse.json({ timestamp, signature, cloudName, apiKey, folder: "allinonestore" });
  } catch (error) {
    console.error("Signature error:", error);
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}
