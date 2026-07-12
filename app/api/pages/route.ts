import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Page from "@/models/Page";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("activeOnly");

    const query = activeOnly === "true" ? { isActive: true } : {};
    
    // Sort by most recently updated
    const pages = await Page.find(query).sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, data: pages });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await req.json();

    const newPage = await Page.create(body);

    return NextResponse.json(
      { success: true, data: newPage },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "A page with this slug already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
