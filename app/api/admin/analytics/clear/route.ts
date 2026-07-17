import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VisitorSession from "@/models/VisitorSession";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import Order from "@/models/Order";
import Stat from "@/models/Stat";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await VisitorSession.deleteMany({});
    await AnalyticsEvent.deleteMany({});
    await Order.deleteMany({});
    await Stat.deleteMany({});

    return NextResponse.json({ success: true, message: "All analytics data cleared." });
  } catch (error) {
    console.error("Failed to clear analytics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
