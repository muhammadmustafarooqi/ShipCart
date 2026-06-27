import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

function getCloudinaryConfig() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloud_name || !api_key || !api_secret) return null;
  if (
    isPlaceholderCredential(cloud_name) ||
    isPlaceholderCredential(api_key) ||
    isPlaceholderCredential(api_secret)
  ) {
    return null;
  }

  return { cloud_name, api_key, api_secret };
}

function isPlaceholderCredential(value?: string) {
  if (!value) return true;
  const v = value.toLowerCase();
  return v === "demo" || v === "your-cloud-name" || v === "your-api-key" || v === "your-api-secret";
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getCloudinaryConfig();
  if (!config) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env (get free keys at cloudinary.com/console).",
      },
      { status: 503 }
    );
  }

  cloudinary.config(config);

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const isVideo = file.type.startsWith("video/");
    const uploadOptions: any = {
      folder: "shipcart",
      resource_type: isVideo ? "video" : "image",
    };

    // Apply scaling transformations only to images
    if (!isVideo) {
      uploadOptions.transformation = [
        { width: 800, height: 800, crop: "fill", gravity: "auto" },
        { quality: "auto", fetch_format: "auto" },
      ];
    }

    const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const message =
      error instanceof Error && error.message.includes("api_key")
        ? "Invalid Cloudinary API key. Update CLOUDINARY_* values in .env and restart the dev server."
        : "Failed to upload file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
