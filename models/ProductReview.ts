import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductReview extends Document {
  productId: string;
  name: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductReviewSchema = new Schema<IProductReview>(
  {
    productId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 2000 },
    imageUrl: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

ProductReviewSchema.index({ productId: 1, createdAt: -1 });

const ProductReview: Model<IProductReview> =
  mongoose.models.ProductReview ||
  mongoose.model<IProductReview>("ProductReview", ProductReviewSchema);

export default ProductReview;
