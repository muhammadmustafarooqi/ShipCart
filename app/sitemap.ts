import { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ShipCartstore.pk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Try to fetch dynamic products to include them in the sitemap
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const products = await Product.find({ isActive: true })
      .select("_id updatedAt")
      .limit(1000)
      .lean();

    if (products && products.length > 0) {
      productEntries = products.map((product: any) => ({
        url: `${SITE_URL}/products/${product._id}`,
        lastModified: new Date(product.updatedAt || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Sitemap generation failed to fetch products from DB:", error);
  }

  // Define static routes
  const staticRoutes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    // Add other static pages like /about, /contact, etc., if they exist.
  ];

  return [...staticRoutes, ...productEntries];
}

