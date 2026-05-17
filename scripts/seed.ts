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
  previewVideoUrl: { type: String, default: "" },
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

const BannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  image: { type: String, required: true },
  link: { type: String, default: "/" },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, default: "ChefHat" },
  image: { type: String, required: true },
  imagePosition: { type: String, default: "center 50%" },
  tagline: { type: String, default: "" },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

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

const COMMON_COLORS = [
  ["Black", "White"],
  ["Silver", "Gold"],
  ["Red", "Blue", "Green"],
  ["Pink", "Purple"],
  ["Black", "Silver", "Gray"],
  ["White", "Beige"],
  ["Multicolor"],
  ["Rose Gold", "Gold"],
  ["Navy", "Black"],
  ["Teal", "Mint"],
];

const CATEGORY_IMAGES: Record<string, string[]> = {
  "kitchen-cooking": [
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1584990347449-39b4aa02b01f?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop",
  ],
  "personal-care-beauty": [
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800&h=800&fit=crop",
  ],
  "home-cleaning": [
    "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600428877938-29c5e5b8b250?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1584820927498-cafe2c1c9699?w=800&h=800&fit=crop",
  ],
  "fitness-health": [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&h=800&fit=crop",
  ],
  "electronics-gadgets": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=800&fit=crop",
  ],
  "baby-kids": [
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop",
  ]
};

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
      const colors = COMMON_COLORS[Math.floor(Math.random() * COMMON_COLORS.length)];
      
      const slug = slugify(name, { lower: true, strict: true });
      
      // Mock gallery (4 images) for card hover / testing — rotates through category pool
      const categoryImages = CATEGORY_IMAGES[category] || CATEGORY_IMAGES["electronics-gadgets"];
      const poolLen = categoryImages.length;
      const galleryCount = Math.min(4, poolLen);
      const start = index % poolLen;
      const images = Array.from({ length: galleryCount }, (_, i) => categoryImages[(start + i) % poolLen]);

      return {
        name,
        slug,
        description: `This is a premium ${name}. Specially designed to meet your daily needs with superior quality and performance.`,
        shortDescription: `High quality ${name} for your home.`,
        price: basePrice,
        comparePrice,
        images,
        category,
        tags: [category.split("-")[0], "premium", "new"],
        colors,
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

    // Seed Banners
    await Banner.deleteMany({});
    const banners = [
      {
        title: "MEGA SUMMER SALE 2024",
        subtitle: "Up to 50% Off on All Kitchen & Home Accessories",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=2000",
        link: "/products?category=kitchen-cooking",
        order: 1,
      },
      {
        title: "PREMIUM BEAUTY CARE",
        subtitle: "Discover Your Natural Glow With Our Latest Gadgets",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=2000",
        link: "/products?category=personal-care-beauty",
        order: 2,
      },
      {
        title: "SMART HOME GADGETS",
        subtitle: "Revolutionize Your Daily Life with Smart Technology",
        image: "https://images.unsplash.com/photo-1558002038-103792e1972d?auto=format&fit=crop&q=80&w=2000",
        link: "/products?category=electronics-gadgets",
        order: 3,
      }
    ];
    await Banner.insertMany(banners);
    console.log("Successfully seeded 3 banners");

    // Seed Categories
    await Category.deleteMany({});
    const categories = [
      {
        name: "Kitchen & Cooking",
        slug: "kitchen-cooking",
        icon: "ChefHat",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200",
        imagePosition: "center 60%",
        tagline: "Cookware, prep tools & smart kitchen picks",
        isFeatured: true,
        order: 0,
        isActive: true,
      },
      {
        name: "Personal Care & Beauty",
        slug: "personal-care-beauty",
        icon: "Sparkles",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=700",
        imagePosition: "center 42%",
        tagline: "",
        isFeatured: false,
        order: 1,
        isActive: true,
      },
      {
        name: "Home & Cleaning",
        slug: "home-cleaning",
        icon: "Home",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=700",
        imagePosition: "center 55%",
        tagline: "",
        isFeatured: false,
        order: 2,
        isActive: true,
      },
      {
        name: "Fitness & Health",
        slug: "fitness-health",
        icon: "Dumbbell",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=700",
        imagePosition: "center 45%",
        tagline: "",
        isFeatured: false,
        order: 3,
        isActive: true,
      },
      {
        name: "Electronics & Gadgets",
        slug: "electronics-gadgets",
        icon: "Zap",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=700",
        imagePosition: "center 50%",
        tagline: "",
        isFeatured: false,
        order: 4,
        isActive: true,
      },
      {
        name: "Baby & Kids",
        slug: "baby-kids",
        icon: "Baby",
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=900",
        imagePosition: "center 48%",
        tagline: "",
        isFeatured: false,
        order: 5,
        isActive: true,
      },
    ];
    await Category.insertMany(categories);
    console.log("Successfully seeded 6 categories");

    // Seed Testimonials
    const TestimonialSchema = new mongoose.Schema({
      name: { type: String, required: true },
      image: { type: String, default: "" },
      avatarColor: { type: String, default: "#ff6b00" },
      rating: { type: Number, required: true, min: 1, max: 5 },
      text: { type: String, required: true },
      product: { type: String, default: "" },
      isActive: { type: Boolean, default: true },
      order: { type: Number, default: 0 },
    }, { timestamps: true });
    const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);
    
    await Testimonial.deleteMany({});
    const testimonials = [
      {
        name: "Bilal Ahmed",
        avatarColor: "#ff6b00",
        rating: 5,
        text: "Ordered a massage device for my elderly father. The delivery was on time and the product quality is excellent. Highly satisfied!",
        product: "Neck Massager Pro",
        isActive: true,
        order: 0,
      },
      {
        name: "Fatima Khan",
        avatarColor: "#3b82f6",
        rating: 5,
        text: "Best kitchen gadgets I've found! The multi-cooker has made meal prep so much easier. Great customer service too.",
        product: "Multi-Cooker 8-in-1",
        isActive: true,
        order: 1,
      },
      {
        name: "Hassan Ali",
        avatarColor: "#10b981",
        rating: 4,
        text: "Really good quality products at affordable prices. Will definitely order again. Shipping was faster than expected.",
        product: "Smart LED Bulb Set",
        isActive: true,
        order: 2,
      },
      {
        name: "Ayesha Malik",
        avatarColor: "#f59e0b",
        rating: 5,
        text: "The beauty gadgets are a game-changer! My skin has improved so much in just a month of use. Love it!",
        product: "Facial Cleansing Brush",
        isActive: true,
        order: 3,
      },
      {
        name: "Muhammad Hassan",
        avatarColor: "#ef4444",
        rating: 5,
        text: "Amazing fitness equipment! I've been using the home gym setup for 3 months now. Best investment ever!",
        product: "Portable Home Gym Kit",
        isActive: true,
        order: 4,
      },
      {
        name: "Zainab Ahmed",
        avatarColor: "#8b5cf6",
        rating: 4,
        text: "The baby monitor camera is incredible. Can watch my baby from anywhere. Highly recommended for new parents!",
        product: "WiFi Baby Monitor",
        isActive: true,
        order: 5,
      },
    ];
    await Testimonial.insertMany(testimonials);
    console.log("Successfully seeded 6 testimonials");

    // Seed FAQs
    const FAQSchema = new mongoose.Schema({
      question: { type: String, required: true },
      answer: { type: String, required: true },
      isActive: { type: Boolean, default: true },
      order: { type: Number, default: 0 },
    }, { timestamps: true });
    const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", FAQSchema);
    
    await FAQ.deleteMany({});
    const faqs = [
      {
        question: "What is your delivery timeframe?",
        answer: "We deliver to all major cities in Pakistan within 2-3 business days. Orders placed in Karachi, Lahore, and Islamabad are usually delivered within 24-48 hours. Delivery times may vary for other cities.",
        isActive: true,
        order: 0,
      },
      {
        question: "Do you offer cash on delivery (COD)?",
        answer: "Yes! We offer Cash on Delivery for all orders across Pakistan. There's no advance payment required. Pay only when you receive your order.",
        isActive: true,
        order: 1,
      },
      {
        question: "What is the free shipping policy?",
        answer: "We offer free shipping on all orders above Rs. 1,500. Orders below Rs. 1,500 have a flat shipping charge of Rs. 200. This applies to all major cities in Pakistan.",
        isActive: true,
        order: 2,
      },
      {
        question: "What is your return and exchange policy?",
        answer: "We accept returns and exchanges within 7 days of delivery. The product must be unused and in original packaging. Contact our customer service for return instructions.",
        isActive: true,
        order: 3,
      },
      {
        question: "How can I track my order?",
        answer: "After placing your order, you'll receive a tracking link via SMS and email. You can use this link to track your package in real-time until delivery.",
        isActive: true,
        order: 4,
      },
      {
        question: "Are the products original and authentic?",
        answer: "Absolutely! We source all products directly from authorized distributors and manufacturers. Every product comes with a warranty and quality guarantee.",
        isActive: true,
        order: 5,
      },
    ];
    await FAQ.insertMany(faqs);
    console.log("Successfully seeded 6 FAQs");

    // Seed Stats
    const StatSchema = new mongoose.Schema({
      value: { type: String, required: true },
      label: { type: String, required: true },
      icon: { type: String, default: "package" },
      isActive: { type: Boolean, default: true },
      order: { type: Number, default: 0 },
    }, { timestamps: true });
    const Stat = mongoose.models.Stat || mongoose.model("Stat", StatSchema);
    
    await Stat.deleteMany({});
    const stats = [
      {
        value: "50,000+",
        label: "Happy Customers",
        icon: "users",
        isActive: true,
        order: 0,
      },
      {
        value: "100,000+",
        label: "Products Shipped",
        icon: "package",
        isActive: true,
        order: 1,
      },
      {
        value: "24/7",
        label: "Customer Support",
        icon: "clock",
        isActive: true,
        order: 2,
      },
      {
        value: "4.8/5",
        label: "Average Rating",
        icon: "star",
        isActive: true,
        order: 3,
      },
    ];
    await Stat.insertMany(stats);
    console.log("Successfully seeded 4 stats");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
