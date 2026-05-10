import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
  await mongoose.connect(MONGODB_URI as string);
  const db = mongoose.connection.db;
  
  if (!db) {
    console.error("Database connection not established");
    process.exit(1);
  }
  
  const collections = await db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  
  const bannersCount = await db.collection("banners").countDocuments();
  console.log("Banners count:", bannersCount);
  
  process.exit(0);
}

check();
