import { Suspense } from "react";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const category = typeof params.category === "string" ? params.category : "";
  const search = typeof params.search === "string" ? params.search : "";
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const limit = 12;

  await connectDB();

  // Build query
  const query: any = { isActive: true };
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }
  if (params.featured === "true") query.isFeatured = true;
  if (params.newArrival === "true") query.isNewArrival = true;

  // Sorting
  const sort = typeof params.sort === "string" ? params.sort : "createdAt";
  const order = typeof params.order === "string" ? params.order : "desc";
  const sortObj: any = {};
  sortObj[sort] = order === "asc" ? 1 : -1;

  // Fetch from DB
  const skip = (page - 1) * limit;
  const productsDocs = await Product.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Product.countDocuments(query);
  const pages = Math.ceil(total / limit);

  const initialProducts = productsDocs.map((doc: any) => ({
    ...doc,
    _id: doc._id.toString(),
  }));

  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", padding: "150px", background: "var(--bg-primary)", minHeight: "100vh" }}>
          <div className="spinner" />
        </div>
      }
    >
      <ProductsClient
        initialProducts={initialProducts}
        initialTotal={total}
        initialPages={pages || 1}
      />
    </Suspense>
  );
}
