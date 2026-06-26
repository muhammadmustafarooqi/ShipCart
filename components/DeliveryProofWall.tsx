import DeliveryProofWallClient, { Testimonial } from "./DeliveryProofWallClient";
import connectDB from "@/lib/mongodb";
import TestimonialModel from "@/models/Testimonial";

export default async function DeliveryProofWall() {
  let testimonials: Testimonial[] = [];
  
  try {
    await connectDB();
    const data = await TestimonialModel.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(10)
      .lean();
      
    // Serialize MongoDB objects to strings
    testimonials = JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching testimonials for Delivery Proof Wall:", error);
  }

  return <DeliveryProofWallClient testimonials={testimonials} />;
}
