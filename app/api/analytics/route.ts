import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VisitorSession from "@/models/VisitorSession";
import AnalyticsEvent from "@/models/AnalyticsEvent";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { sessionId, path, referrer, hasCart, hasCheckout, hasOrdered, eventName, metadata } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Resolve customer IP from headers
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : request.headers.get("x-real-ip") || "127.0.0.1";
    
    // Resolve user agent
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Setup session updates
    const sessionUpdate: Record<string, any> = {
      ip,
      userAgent,
      lastActive: new Date(),
    };

    // Update progress flags if they are true
    if (hasCart) sessionUpdate.hasCart = true;
    if (hasCheckout) sessionUpdate.hasCheckout = true;
    if (hasOrdered) sessionUpdate.hasOrdered = true;

    // Perform the MongoDB VisitorSession upsert operation
    await VisitorSession.findOneAndUpdate(
      { sessionId },
      {
        $set: sessionUpdate,
        $setOnInsert: {
          referrer: referrer || "Direct",
        },
      },
      { upsert: true, new: true }
    );

    // Filter milestones to avoid duplicate logging in the same session
    let shouldLogEvent = true;
    
    if (["add_to_cart", "initiate_checkout", "purchase"].includes(eventName)) {
      // Check session presence of the same milestone event to prevent double counting
      const existingMilestone = await AnalyticsEvent.findOne({
        sessionId,
        eventName,
      });
      if (existingMilestone) {
        shouldLogEvent = false;
      }
    } else if (eventName === "page_view") {
      // Deduplicate rapid page views on the identical path in a 1-minute window
      const oneMinuteAgo = new Date(Date.now() - 60000);
      const duplicateView = await AnalyticsEvent.findOne({
        sessionId,
        eventName: "page_view",
        path,
        createdAt: { $gte: oneMinuteAgo },
      });
      if (duplicateView) {
        shouldLogEvent = false;
      }
    }

    if (shouldLogEvent) {
      await AnalyticsEvent.create({
        sessionId,
        eventName,
        path,
        metadata: metadata || {},
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Analytics POST ingestion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
