import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBanner extends Document {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    image: { type: String, required: true },
    link: { type: String, default: "/" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Banner: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;
