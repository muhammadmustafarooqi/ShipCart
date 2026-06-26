import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  icon: string;
  image: string;
  imagePosition: string;
  tagline: string;
  isFeatured: boolean;
  order: number;
  isActive: boolean;
  showName: boolean;
  showIcon: boolean;
  showExploreBtn: boolean;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: "ChefHat" },
    image: { type: String, required: true },
    imagePosition: { type: String, default: "center 50%" },
    tagline: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    showName: { type: Boolean, default: true },
    showIcon: { type: Boolean, default: true },
    showExploreBtn: { type: Boolean, default: true },
  },
  { timestamps: true }
);

if (mongoose.models.Category) {
  delete mongoose.models.Category;
}
const Category: Model<ICategory> = mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
