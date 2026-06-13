import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisitorSession extends Document {
  sessionId: string;
  ip: string;
  userAgent: string;
  referrer: string;
  hasCart: boolean;
  hasCheckout: boolean;
  hasOrdered: boolean;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VisitorSessionSchema = new Schema<IVisitorSession>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    referrer: { type: String, default: "" },
    hasCart: { type: Boolean, default: false },
    hasCheckout: { type: Boolean, default: false },
    hasOrdered: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Indexes for analytical query efficiency
VisitorSessionSchema.index({ lastActive: 1 });
VisitorSessionSchema.index({ createdAt: 1 });

const VisitorSession: Model<IVisitorSession> =
  mongoose.models.VisitorSession || mongoose.model<IVisitorSession>("VisitorSession", VisitorSessionSchema);

export default VisitorSession;
