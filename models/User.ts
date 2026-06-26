import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  address: string;
  spinResult?: string;
  hasSpun?: boolean;
  spunAt?: Date;
  couponCode?: string;
  couponExpiry?: Date;
  couponStatus?: "active" | "used";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, default: "" },
    address: { type: String, default: "" },
    spinResult: { type: String, default: "" },
    hasSpun: { type: Boolean, default: false },
    spunAt: { type: Date },
    couponCode: { type: String, default: "" },
    couponExpiry: { type: Date },
    couponStatus: { type: String, enum: ["active", "used"], default: "active" },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
