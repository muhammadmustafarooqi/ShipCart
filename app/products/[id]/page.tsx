import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductClient from "./ProductClient";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  try {
    await connectDB();
    const product = (await Product.findById(id).lean()) as any;
    if (!product) return {};

    const previousImages = (await parent).openGraph?.images || [];
    const mainImage = product.images?.[0] || "";

    return {
      title: `${product.name} | ShipCart Store`,
      description:
        product.shortDescription || product.description?.substring(0, 160),
      openGraph: {
        title: product.name,
        description:
          product.shortDescription || product.description?.substring(0, 160),
        images: mainImage ? [mainImage, ...previousImages] : previousImages,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description:
          product.shortDescription || product.description?.substring(0, 160),
        images: mainImage ? [mainImage] : [],
      },
    };
  } catch (e) {
    return {};
  }
}

export default async function ProductPageServer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();
  const productDoc = (await Product.findById(id).lean()) as any;

  if (!productDoc) {
    notFound();
  }

  // Convert MongoDB document to plain serializable object
  const product = { ...productDoc, _id: productDoc._id.toString() };

  // Fetch related products
  const relatedDocs = (await Product.find({
    category: product.category,
    _id: { $ne: productDoc._id },
  })
    .limit(5)
    .lean()) as any[];

  const related = relatedDocs.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
  }));

  return <ProductClient initialProduct={product} initialRelated={related} />;
}
