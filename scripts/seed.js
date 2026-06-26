const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env.local");
  process.exit(1);
}

// Define a simple schema that matches the Product model
const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  originalPrice: Number,
  images: [String],
  category: String,
  tags: [String],
  stock: Number,
  isActive: Boolean,
  isFeatured: Boolean,
  isNewArrival: Boolean,
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const dummyProducts = [
  {
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    description: "Experience crystal clear audio with our premium wireless headphones featuring active noise cancellation.",
    price: 149.99,
    originalPrice: 199.99,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"],
    category: "electronics",
    tags: ["audio", "wireless", "headphones"],
    stock: 50,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    name: "Minimalist Smartwatch",
    slug: "minimalist-smartwatch",
    description: "Track your fitness and stay connected with this sleek, minimalist smartwatch.",
    price: 89.99,
    originalPrice: 129.99,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"],
    category: "electronics",
    tags: ["wearable", "smartwatch", "fitness"],
    stock: 30,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
  },
  {
    name: "Ergonomic Office Chair",
    slug: "ergonomic-office-chair",
    description: "Work in comfort all day with our fully adjustable ergonomic office chair.",
    price: 249.99,
    originalPrice: 299.99,
    images: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop"],
    category: "furniture",
    tags: ["office", "chair", "ergonomic"],
    stock: 15,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    name: "Stainless Steel Chef Knife",
    slug: "stainless-steel-chef-knife",
    description: "Professional grade 8-inch chef knife made from high-carbon stainless steel.",
    price: 45.00,
    originalPrice: 60.00,
    images: ["https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=1000&auto=format&fit=crop"],
    category: "kitchen-cooking",
    tags: ["kitchen", "cooking", "knife"],
    stock: 100,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
  },
  {
    name: "Organic Cotton T-Shirt",
    slug: "organic-cotton-t-shirt",
    description: "Super soft, 100% organic cotton t-shirt for everyday wear.",
    price: 24.99,
    originalPrice: 34.99,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop"],
    category: "clothing",
    tags: ["apparel", "cotton", "t-shirt"],
    stock: 200,
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
  }
];

async function seedDB() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB!");

    console.log("Inserting dummy products...");
    await Product.insertMany(dummyProducts);
    console.log("Successfully inserted dummy products!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDB();
