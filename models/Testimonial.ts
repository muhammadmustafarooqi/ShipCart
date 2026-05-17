import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: "" },
  avatarColor: { type: String, default: "#ff6b00" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  product: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
