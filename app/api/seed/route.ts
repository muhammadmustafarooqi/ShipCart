import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Banner from "@/models/Banner";

export async function GET() {
  try {
    await connectDB();

    // Check if already seeded
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      return NextResponse.json({ 
        message: "Database already seeded", 
        products: existingProducts 
      });
    }

    // Seed Banners
    const banners = [
      {
        title: "Summer Collection 2024",
        subtitle: "Up to 50% Off on Selected Items",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
        buttonText: "Shop Now",
        buttonLink: "/products",
        isActive: true,
        order: 1,
      },
      {
        title: "Premium Quality Products",
        subtitle: "Free Delivery on Orders Above Rs. 1,500",
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200",
        buttonText: "Explore",
        buttonLink: "/products",
        isActive: true,
        order: 2,
      },
      {
        title: "Cash on Delivery Available",
        subtitle: "Shop with Confidence - Pay When You Receive",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200",
        buttonText: "Start Shopping",
        buttonLink: "/products",
        isActive: true,
        order: 3,
      },
    ];

    await Banner.insertMany(banners);

    // Seed Products
    const products = [];
    const productData = [
      { name: "Wireless Bluetooth Headphones", category: "Electronics", price: 3500, image: "photo-1505740420928-5e560c06d30e" },
      { name: "Smart Watch Series 7", category: "Electronics", price: 8500, image: "photo-1523275335684-37898b6baf30" },
      { name: "Premium Leather Wallet", category: "Fashion", price: 2500, image: "photo-1627123424574-724758594e93" },
      { name: "Designer Sunglasses", category: "Fashion", price: 1800, image: "photo-1572635196237-14b3f281503f" },
      { name: "Cotton T-Shirt Pack", category: "Fashion", price: 1500, image: "photo-1521572163474-6864f9cf17ab" },
      { name: "Running Shoes", category: "Sports", price: 4500, image: "photo-1542291026-7eec264c27ff" },
      { name: "Yoga Mat Premium", category: "Sports", price: 2200, image: "photo-1601925260368-ae2f83cf8b7f" },
      { name: "Dumbbell Set 10kg", category: "Sports", price: 3800, image: "photo-1517836357463-d25dfeac3438" },
      { name: "Ceramic Coffee Mug Set", category: "Home & Living", price: 1200, image: "photo-1514228742587-6b1558fcca3d" },
      { name: "LED Desk Lamp", category: "Home & Living", price: 2800, image: "photo-1507473885765-e6ed057f782c" },
      { name: "Scented Candle Collection", category: "Home & Living", price: 1600, image: "photo-1602874801006-e24b3e7b8c49" },
      { name: "Face Serum Vitamin C", category: "Beauty", price: 2400, image: "photo-1620916566398-39f1143ab7be" },
      { name: "Makeup Brush Set", category: "Beauty", price: 1900, image: "photo-1512496015851-a90fb38ba796" },
      { name: "Hair Dryer Professional", category: "Beauty", price: 4200, image: "photo-1522338242992-e1a54906a8da" },
      { name: "Fiction Novel Bestseller", category: "Books", price: 800, image: "photo-1544947950-fa07a98d237f" },
      { name: "Self Help Book Collection", category: "Books", price: 1500, image: "photo-1495446815901-a7297e633e8d" },
      { name: "Portable Phone Charger", category: "Electronics", price: 2100, image: "photo-1609091839311-d5365f9ff1c5" },
      { name: "USB-C Cable 3-Pack", category: "Electronics", price: 900, image: "photo-1625948515291-69613efd103f" },
      { name: "Laptop Stand Aluminum", category: "Electronics", price: 3200, image: "photo-1527864550417-7fd91fc51a46" },
      { name: "Wireless Mouse", category: "Electronics", price: 1400, image: "photo-1527814050087-3793815479db" },
      { name: "Mechanical Keyboard RGB", category: "Electronics", price: 5500, image: "photo-1587829741301-dc798b83add3" },
      { name: "Phone Case Premium", category: "Electronics", price: 800, image: "photo-1601784551446-20c9e07cdbdb" },
      { name: "Denim Jeans Slim Fit", category: "Fashion", price: 3200, image: "photo-1542272604-787c3835535d" },
      { name: "Formal Shirt White", category: "Fashion", price: 2400, image: "photo-1602810318383-e386cc2a3ccf" },
      { name: "Sneakers White", category: "Fashion", price: 3800, image: "photo-1549298916-b41d501d3772" },
      { name: "Backpack Travel", category: "Fashion", price: 4200, image: "photo-1553062407-98eeb64c6a62" },
      { name: "Baseball Cap", category: "Fashion", price: 900, image: "photo-1588850561407-ed78c282e89b" },
      { name: "Leather Belt", category: "Fashion", price: 1600, image: "photo-1624222247344-550fb60583f2" },
      { name: "Wall Clock Modern", category: "Home & Living", price: 2200, image: "photo-1563861826100-9cb868fdbe1c" },
      { name: "Throw Pillow Set", category: "Home & Living", price: 1800, image: "photo-1584100936595-c0654b55a2e2" },
      { name: "Table Lamp Vintage", category: "Home & Living", price: 3500, image: "photo-1513506003901-1e6a229e2d15" },
      { name: "Photo Frame Set", category: "Home & Living", price: 1200, image: "photo-1582139329536-e7284fece509" },
      { name: "Kitchen Knife Set", category: "Home & Living", price: 4500, image: "photo-1593618998160-e34014e67546" },
      { name: "Water Bottle Steel", category: "Home & Living", price: 1100, image: "photo-1602143407151-7111542de6e8" },
      { name: "Moisturizer Face Cream", category: "Beauty", price: 2100, image: "photo-1556228578-8c89e6adf883" },
      { name: "Lipstick Matte Finish", category: "Beauty", price: 1200, image: "photo-1586495777744-4413f21062fa" },
      { name: "Perfume Eau de Parfum", category: "Beauty", price: 3800, image: "photo-1541643600914-78b084683601" },
      { name: "Nail Polish Set", category: "Beauty", price: 1500, image: "photo-1610992015732-2449b76344bc" },
      { name: "Face Mask Sheet Pack", category: "Beauty", price: 900, image: "photo-1608248543803-ba4f8c70ae0b" },
      { name: "Hair Straightener", category: "Beauty", price: 3200, image: "photo-1522338242992-e1a54906a8da" },
      { name: "Fitness Tracker Band", category: "Sports", price: 2800, image: "photo-1575311373937-040b8e1fd5b6" },
      { name: "Tennis Racket Pro", category: "Sports", price: 5500, image: "photo-1622163642998-1ea32b0bbc67" },
      { name: "Football Size 5", category: "Sports", price: 2200, image: "photo-1614632537423-1e6c2e7e0aab" },
      { name: "Gym Bag Large", category: "Sports", price: 2600, image: "photo-1553062407-98eeb64c6a62" },
      { name: "Protein Shaker Bottle", category: "Sports", price: 800, image: "photo-1591952111137-9f57d6d6ef68" },
      { name: "Resistance Bands Set", category: "Sports", price: 1400, image: "photo-1598289431512-b97b0917affc" },
      { name: "Cookbook Healthy Recipes", category: "Books", price: 1200, image: "photo-1490645935967-10de6ba17061" },
      { name: "Business Strategy Book", category: "Books", price: 1800, image: "photo-1589829085413-56de8ae18c73" },
      { name: "Children Story Book", category: "Books", price: 600, image: "photo-1512820790803-83ca734da794" },
      { name: "Travel Guide Pakistan", category: "Books", price: 1400, image: "photo-1488646953014-85cb44e25828" },
      { name: "Bluetooth Speaker Portable", category: "Electronics", price: 2800, image: "photo-1608043152269-423dbba4e7e1" },
      { name: "Gaming Mouse RGB", category: "Electronics", price: 3200, image: "photo-1527814050087-3793815479db" },
      { name: "Webcam HD 1080p", category: "Electronics", price: 4500, image: "photo-1587825140708-dfaf72ae4b04" },
      { name: "Power Bank 20000mAh", category: "Electronics", price: 3500, image: "photo-1609091839311-d5365f9ff1c5" },
      { name: "HDMI Cable 4K", category: "Electronics", price: 800, image: "photo-1625948515291-69613efd103f" },
      { name: "Screen Protector Glass", category: "Electronics", price: 600, image: "photo-1601784551446-20c9e07cdbdb" },
      { name: "Hoodie Cotton Blend", category: "Fashion", price: 2800, image: "photo-1556821840-3a63f95609a7" },
      { name: "Dress Casual Summer", category: "Fashion", price: 3200, image: "photo-1595777457583-95e059d581b8" },
      { name: "Jacket Leather", category: "Fashion", price: 8500, image: "photo-1551028719-00167b16eac5" },
      { name: "Scarf Wool Winter", category: "Fashion", price: 1200, image: "photo-1601924994987-69e26d50dc26" },
      { name: "Socks Pack of 5", category: "Fashion", price: 800, image: "photo-1586350977771-b3b0abd50c82" },
      { name: "Tie Formal Silk", category: "Fashion", price: 1500, image: "photo-1589756823695-278bc8356c60" },
      { name: "Bedsheet Cotton King", category: "Home & Living", price: 3500, image: "photo-1631049307264-da0ec9d70304" },
      { name: "Curtains Blackout", category: "Home & Living", price: 4200, image: "photo-1616486338812-3dadae4b4ace" },
      { name: "Rug Persian Style", category: "Home & Living", price: 5500, image: "photo-1600166898405-da9535204843" },
      { name: "Mirror Wall Mounted", category: "Home & Living", price: 2800, image: "photo-1618220179428-22790b461013" },
      { name: "Vase Ceramic Decorative", category: "Home & Living", price: 1800, image: "photo-1578500494198-246f612d3b3d" },
      { name: "Plant Pot Set of 3", category: "Home & Living", price: 1200, image: "photo-1485955900006-10f4d324d411" },
    ];

    for (let i = 0; i < productData.length; i++) {
      const item = productData[i];
      const isFeatured = i % 5 === 0;
      const isNewArrival = i % 7 === 0;
      
      products.push({
        name: item.name,
        slug: item.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description: `High-quality ${item.name} with premium features. Perfect for everyday use. Made with the finest materials to ensure durability and style.`,
        shortDescription: `Premium ${item.name} - Best quality guaranteed`,
        price: item.price,
        comparePrice: Math.round(item.price * 1.3),
        images: [`https://images.unsplash.com/${item.image}?w=800`],
        category: item.category,
        tags: [item.category.toLowerCase(), "premium", "quality"],
        colors: ["Black", "White"],
        stock: Math.floor(Math.random() * 50) + 10,
        isFeatured,
        isNewArrival,
        isActive: true,
        rating: 4 + Math.random(),
        reviewCount: Math.floor(Math.random() * 100) + 10,
      });
    }

    await Product.insertMany(products);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${products.length} products and ${banners.length} banners`,
      products: products.length,
      banners: banners.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ 
      error: "Failed to seed database", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
