import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { join } from "path";
import slugify from "slugify";

// Load environment variables
dotenv.config({ path: join(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env.local");
  process.exit(1);
}

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  shortDescription: { type: String, default: "" },
  price: { type: Number, required: true },
  comparePrice: { type: Number, default: 0 },
  images: [{ type: String }],
  category: { type: String, required: true },
  tags: [{ type: String }],
  stock: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const PRODUCTS_TO_SEED = [
  "Rechargeable Coffee Beater",
  "Silicone Washing Gloves",
  "Vintage T9 Trimmer",
  "IPL Permanent Laser Hair Removal",
  "Mini Jet Fan",
  "Rechargeable Rose Diamond Table Lamp",
  "Chargeable Handheld Fan With Ring Light",
  "Portable Scale Digital LCD Display",
  "Rechargeable Pressure Washer Gun",
  "Fire Stop",
  "Manual Food Grater",
  "Ear Cleaner High Precision Ear Wax",
  "Paper Soap",
  "Arc Chargeable Kitchen Lighter",
  "Tube Packing Flower Paper Soap",
  "Knife Sharpener",
  "Food Grade Silicone Children's Tableware",
  "Ultra Soft Toothbrush",
  "Helping Handle for Bathroom Safety",
  "3 Piece Tap LED Light With Remote Control",
  "Mini Leather Jewellery Organizer",
  "Portable LED Flashlight Multifunction",
  "Air Humidifier USB Small Mini Portable",
  "2 In 1 Microfiber Floor Mop",
  "Microfiber Duster Extension Pole",
  "Silicone Ice Roller",
  "Portable Mesh Nebulizer for Kids & Adults",
  "Manicure Pedicure Grooming Kit",
  "Silicone Ice Cube Genie",
  "Deep Frying Pot with Strainer Basket",
  "Portable Electric Spice Multifunctional Grinder",
  "Eagle Wall Lamp",
  "Ultrasonic Sonic Electric Toothbrush USB",
  "Anti-Theft Alarm Lock",
  "Electric Meat Grinder Multi-Purpose",
  "Kitchen Scale 0.1gm To 10kg",
  "Portable LCD Digital TDS Water Quality Tester",
  "Silicone Spoon Set 12 Pcs",
  "Large Adhesive Hooks for Hanging Heavy",
  "Rechargeable Coffee Frother",
  "4-IN-1 Multi Grater With Case",
  "Automatic Electric Fruit Peeler",
  "Washing Machine Cleaning Tablets",
  "Portable Ice Crusher Gola Ganda Machine",
  "Air Compressor Wireless Electric Air Pump",
  "Pedal Exerciser for Seniors Desk Bike Cycle",
  "Shoulder and Back Massager All In One",
  "Back Posture Corrector Belt",
  "3 In 1 Motivational Water Bottle",
  "Portable Ratchet Screwdriver",
  "Three Sided Toothbrush Soft Bristles",
  "Dust Proof Shoe Rack",
  "Hair Growth Brush with Steam & Vibration",
  "Vacuum Storage Bags",
  "Telescopic Microfiber Car Duster",
  "3 In 1 Handheld Vacuum Car Cleaner",
  "Portable DIY Folding Handheld Fan",
  "Multi Layer Trolley For Kitchen",
  "Positioning Bed Pad with Handles",
  "2.0 Litre 4 Blade Meat Blender Premium",
  "Window Screen Net Repair Kit",
  "Handheld Massage Ball for Muscle Back",
  "Personals Desk Fan For Camping",
  "Bubble Mini Fan",
  "Iron Teflon Cover",
  "Silicone Dough Kneading Bag",
  "iScale Digital LCD Electronic Tempered",
  "Pack Of 10 Adhesive Single Hook",
  "Sleepco Nasal Dilator Starter Kit 4 Sizes",
  "Infant Pillow for Newborn Baby"
];

const CATEGORIES = [
  "kitchen-cooking",
  "personal-care-beauty",
  "home-cleaning",
  "fitness-health",
  "electronics-gadgets",
  "baby-kids"
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    const products = PRODUCTS_TO_SEED.map((name, index) => {
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const basePrice = Math.floor(Math.random() * 3000) + 500; // 500 to 3500
      const comparePrice = basePrice + Math.floor(Math.random() * 1000) + 200; // Discounted
      const isFeatured = index % 8 === 0; // Every 8th item is featured
      const isNewArrival = index % 5 === 0; // Every 5th item is new arrival
      
      const slug = slugify(name, { lower: true, strict: true });
      const imageUrl = `https://placehold.co/800x800/f5f5f5/ff6b00?text=${encodeURIComponent(name.slice(0, 15))}`;

      return {
        name,
        slug,
        description: `This is a premium ${name}. Specially designed to meet your daily needs with superior quality and performance.`,
        shortDescription: `High quality ${name} for your home.`,
        price: basePrice,
        comparePrice,
        images: [imageUrl],
        category,
        tags: [category.split("-")[0], "premium", "new"],
        stock: Math.floor(Math.random() * 100) + 10, // 10 to 110
        isFeatured,
        isNewArrival,
        isActive: true,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0
        reviewCount: Math.floor(Math.random() * 500) + 5,
      };
    });

    await Product.insertMany(products);
    console.log(`Successfully seeded ${products.length} products`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
