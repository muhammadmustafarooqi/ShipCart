import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalyticsEvent extends Document {
  sessionId: string;
  eventName: "page_view" | "view_promotion" | "view_item_list" | "add_to_cart" | "initiate_checkout" | "purchase" | string;
  path: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    sessionId: { type: String, required: true, index: true },
    eventName: { type: String, required: true, index: true },
    path: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { 
    timestamps: { createdAt: true, updatedAt: false } 
  }
);

// Indexes for date-range filter optimization
AnalyticsEventSchema.index({ createdAt: 1 });

const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent || mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);

export default AnalyticsEvent;
