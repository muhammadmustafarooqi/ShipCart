import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VisitorSession from "@/models/VisitorSession";
import AnalyticsEvent from "@/models/AnalyticsEvent";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { sessionId, referrer, hasCart, hasCheckout, hasOrdered, path } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Get IP & User-Agent from headers
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown";
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Build fields to update/set
    const updateFields: any = {
      lastActive: new Date(),
    };

    if (ip && ip !== "Unknown") updateFields.ip = ip;
    if (userAgent && userAgent !== "Unknown") updateFields.userAgent = userAgent;
    
    // Only set flags if they are true (don't overwrite true to false)
    if (hasCart) updateFields.hasCart = true;
    if (hasCheckout) updateFields.hasCheckout = true;
    if (hasOrdered) updateFields.hasOrdered = true;

    // Use findOneAndUpdate with upsert
    const session = await VisitorSession.findOneAndUpdate(
      { sessionId },
      {
        $set: updateFields,
        $setOnInsert: {
          sessionId,
          referrer: referrer || "Direct",
        },
      },
      { returnDocument: 'after', upsert: true }
    );

    // Track Events in AnalyticsEvent Collection
    
    // 1. Page View Event
    if (path) {
      const fiveSecondsAgo = new Date(Date.now() - 5 * 1000);
      const recentPageView = await AnalyticsEvent.findOne({
        sessionId,
        eventName: "page_view",
        path,
        createdAt: { $gte: fiveSecondsAgo }
      });

      if (!recentPageView) {
        await AnalyticsEvent.create({
          sessionId,
          eventName: "page_view",
          path,
        });
      }
    }

    // 2. View Promotion Event (Home Page hit)
    if (path === "/") {
      const existingPromoEvent = await AnalyticsEvent.findOne({
        sessionId,
        eventName: "view_promotion",
      });
      if (!existingPromoEvent) {
        await AnalyticsEvent.create({
          sessionId,
          eventName: "view_promotion",
          path,
        });
      }
    }

    // 3. View Item List Event (Products catalogue page)
    if (path && (path === "/products" || path.startsWith("/products/"))) {
      const existingViewEvent = await AnalyticsEvent.findOne({
        sessionId,
        eventName: "view_item_list",
      });
      if (!existingViewEvent) {
        await AnalyticsEvent.create({
          sessionId,
          eventName: "view_item_list",
          path,
        });
      }
    }

    // 4. Add To Cart Event
    if (hasCart) {
      const existingCartEvent = await AnalyticsEvent.findOne({
        sessionId,
        eventName: "add_to_cart",
      });
      if (!existingCartEvent) {
        await AnalyticsEvent.create({
          sessionId,
          eventName: "add_to_cart",
          path: path || "/cart",
        });
      }
    }

    // 5. Initiate Checkout Event
    if (hasCheckout) {
      const existingCheckoutEvent = await AnalyticsEvent.findOne({
        sessionId,
        eventName: "initiate_checkout",
      });
      if (!existingCheckoutEvent) {
        await AnalyticsEvent.create({
          sessionId,
          eventName: "initiate_checkout",
          path: path || "/checkout",
        });
      }
    }

    // 6. Purchase Event
    if (hasOrdered) {
      const existingPurchaseEvent = await AnalyticsEvent.findOne({
        sessionId,
        eventName: "purchase",
      });
      if (!existingPurchaseEvent) {
        await AnalyticsEvent.create({
          sessionId,
          eventName: "purchase",
          path: path || "/order-success",
        });
      }
    }

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("Analytics track error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
