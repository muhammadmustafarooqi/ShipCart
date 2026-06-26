import mongoose from "mongoose";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Bundle from "@/models/Bundle";
import ProductClient from "./ProductClient";

async function getProductBySlugOrId(slugOrId: string) {
  await connectDB();
  let product = await Product.findOne({ slug: slugOrId }).lean() as any;
  if (!product && mongoose.Types.ObjectId.isValid(slugOrId)) {
    product = await Product.findById(slugOrId).lean() as any;
  }
  return product;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlugOrId(slug);
    if (!product) return {};

    const previousImages = (await parent).openGraph?.images || [];
    const mainImage = product.images?.[0] || "";

    return {
      title: `${product.name} | AllInOne Store`,
      description: product.shortDescription || product.description?.substring(0, 160),
      openGraph: {
        title: product.name,
        description: product.shortDescription || product.description?.substring(0, 160),
        images: mainImage ? [mainImage, ...previousImages] : previousImages,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.shortDescription || product.description?.substring(0, 160),
        images: mainImage ? [mainImage] : [],
      },
    };
  } catch (e) {
    return {};
  }
}

export default async function ProductPageServer({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const productDoc = await getProductBySlugOrId(slug);
  
  if (!productDoc) {
    notFound();
  }

  // Convert MongoDB document to plain serializable object
  const product = { ...productDoc, _id: productDoc._id.toString() };

  // Fetch related products
  const relatedDocs = await Product.find({ 
    category: product.category,
    _id: { $ne: productDoc._id }
  }).limit(5).lean() as any[];

  const related = relatedDocs.map(doc => ({
    ...doc,
    _id: doc._id.toString()
  }));

  // Fetch bundle packs
  let packs: any[] = [];
  try {
    const bundle = await Bundle.findOne({ product: productDoc._id, isActive: true }).lean() as any;
    if (bundle && bundle.packs) {
      packs = bundle.packs.map((p: any) => ({
        quantity: p.quantity,
        price: p.price,
        label: p.label || "",
      })).sort((a: any, b: any) => a.quantity - b.quantity);
    }
  } catch (err) {
    console.error("Failed to fetch bundle packs:", err);
  }

  return <ProductClient initialProduct={product} initialRelated={related} initialPacks={packs} />;
}
