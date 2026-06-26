import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPack {
  quantity: number;
  price: number;
  label?: string;
}

export interface IBundle extends Document {
  product: mongoose.Types.ObjectId;
  packs: IPack[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackSchema = new Schema<IPack>(
  {
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    label: { type: String, default: "" },
  },
  { _id: true }
);

const BundleSchema = new Schema<IBundle>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    packs: [PackSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BundleSchema.index({ product: 1 }, { unique: true });
BundleSchema.index({ isActive: 1 });

const Bundle: Model<IBundle> = mongoose.models.Bundle || mongoose.model<IBundle>("Bundle", BundleSchema);

export default Bundle;
