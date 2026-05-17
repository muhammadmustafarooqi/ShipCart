import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Stat from "@/models/Stat";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const stat = await Stat.findById(id);
    if (!stat) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 });
    }
    return NextResponse.json(stat);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stat" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const stat = await Stat.findByIdAndUpdate(id, body, { new: true });
    if (!stat) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 });
    }
    return NextResponse.json(stat);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update stat" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const stat = await Stat.findByIdAndDelete(id);
    if (!stat) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Stat deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete stat" }, { status: 500 });
  }
}
