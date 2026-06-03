import { v2 as cloudinary } from "cloudinary";

export function isPlaceholderCredential(value?: string) {
  if (!value) return true;
  const v = value.toLowerCase();
  return (
    v === "demo" ||
    v === "your-cloud-name" ||
    v === "your-api-key" ||
    v === "your-api-secret"
  );
}

export function getCloudinaryConfig() {
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

export async function uploadImageBuffer(
  buffer: Buffer,
  mimeType: string,
  folder: string
): Promise<{ url: string; publicId: string }> {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error("CLOUDINARY_NOT_CONFIGURED");
  }

  cloudinary.config(config);

  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
    transformation: [
      { width: 1200, height: 1200, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });

  return { url: result.secure_url, publicId: result.public_id };
}

export function isAllowedReviewImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "res.cloudinary.com" &&
      parsed.pathname.includes("/image/upload/")
    );
  } catch {
    return false;
  }
}
