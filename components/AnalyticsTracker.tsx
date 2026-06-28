"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "./CartProvider";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { items } = useCart();
  const isInitialized = useRef(false);

  useEffect(() => {
    // Exclude admin panel and API routes from tracking
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Get or create sessionId in sessionStorage (active during single browser tab lifespan)
    let sessionId = sessionStorage.getItem("cartship_session_id");
    if (!sessionId) {
      sessionId = "sess_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
      sessionStorage.setItem("cartship_session_id", sessionId);
    }

    const hasCart = items.length > 0;
    const hasCheckout = pathname.startsWith("/checkout");
    const hasOrdered = pathname.startsWith("/order-success");

    const trackSession = async () => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            referrer: isInitialized.current ? "" : document.referrer || "Direct",
            hasCart,
            hasCheckout,
            hasOrdered,
            path: pathname,
          }),
        });
        isInitialized.current = true;
      } catch (err) {
        console.error("Tracking error:", err);
      }
    };

    // Debounce a little bit to avoid double-pings during fast state changes
    const timer = setTimeout(trackSession, 300);
    return () => clearTimeout(timer);
  }, [pathname, searchParams, items]);

  return null;
}
