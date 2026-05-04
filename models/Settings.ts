import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  storeName: string;
  whatsappNumber: string;
  deliveryFee: number;
  freeDeliveryAbove: number;
  announcementBarText: string;
  announcementBarActive: boolean;
  adminEmail: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    storeName: { type: String, default: "ALLInONE Store" },
    whatsappNumber: {
      type: String,
      default: process.env.WHATSAPP_NUMBER || "923001234567",
    },
    deliveryFee: { type: Number, default: 200 },
    freeDeliveryAbove: { type: Number, default: 1500 },
    announcementBarText: {
      type: String,
      default:
        "Free Delivery on Orders Above PKR 1500 | COD Available Nationwide",
    },
    announcementBarActive: { type: Boolean, default: true },
    adminEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
