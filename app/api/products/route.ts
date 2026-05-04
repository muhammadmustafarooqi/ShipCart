import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
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
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const sortObj: Record<string, 1 | -1> = { [sort]: order === "asc" ? 1 : -1 };
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
  try {
    await connectDB();
    const body = await request.json();

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
