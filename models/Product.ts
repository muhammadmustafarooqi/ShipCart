import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, default: 0 },
    images: [{ type: String }],
    category: { type: String, required: true },
    tags: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isNewArrival: 1 });
ProductSchema.index({ isActive: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
