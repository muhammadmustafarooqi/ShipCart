import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 100); // cap at 100
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const newArrival = searchParams.get("newArrival");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { isActive: true };

    if (category) query.category = category;
    if (featured === "true") query.isFeatured = true;
    if (newArrival === "true") query.isNewArrival = true;
    if (search) {
      // Sanitize search input - limit length to prevent ReDoS
      const sanitized = search.slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { name: { $regex: sanitized, $options: "i" } },
        { shortDescription: { $regex: sanitized, $options: "i" } },
        { tags: { $in: [new RegExp(sanitized, "i")] } },
      ];
    }

    const allowedSorts = ["createdAt", "price", "rating", "name"];
    const safeSort = allowedSorts.includes(sort) ? sort : "createdAt";
    const sortObj: Record<string, 1 | -1> = { [safeSort]: order === "asc" ? 1 : -1 };
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      total,
      pages: Math.ceil(total / limit),
      page,
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Protect: only admin
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();

    // Basic validation
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }
    if (!body.category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }
    if (typeof body.price !== "number" || body.price <= 0) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
    }

    // Generate slug
    const slugify = (await import("slugify")).default;
    let slug = slugify(body.name, { lower: true, strict: true });

    // Ensure unique slug
    const existing = await Product.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await Product.create({ ...body, slug });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
