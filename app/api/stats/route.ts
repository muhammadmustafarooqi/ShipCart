import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Stat from "@/models/Stat";

export async function GET() {
  try {
    await dbConnect();
    const stats = await Stat.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const stat = await Stat.create(body);
    return NextResponse.json(stat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create stat" }, { status: 500 });
  }
}
