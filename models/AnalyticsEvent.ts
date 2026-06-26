import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalyticsEvent extends Document {
  sessionId: string;
  eventName: string; // 'page_view', 'add_to_cart', 'initiate_checkout', 'purchase', 'view_item_list'
  path: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    sessionId: { type: String, required: true, index: true },
    eventName: { type: String, required: true, index: true },
    path: { type: String, default: "" },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { 
    timestamps: { createdAt: true, updatedAt: false } 
  }
);

// Add index on createdAt for fast time-range querying
AnalyticsEventSchema.index({ createdAt: 1 });

const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent || mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);

export default AnalyticsEvent;
