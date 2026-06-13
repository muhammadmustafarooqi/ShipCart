"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";

function AnalyticsTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { items } = useCart();

  useEffect(() => {
    // Exclude administration dashboard and backend API endpoints
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Retrieve or initialize unique session ID in sessionStorage
    let sessionId = sessionStorage.getItem("allinone_session_id");
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem("allinone_session_id", sessionId);
    }

    // Determine funnel milestone flags
    const hasCart = items.length > 0;
    const hasCheckout = pathname.startsWith("/checkout");
    const hasOrdered = pathname.startsWith("/order-success");

    // Establish event categories matching milestones
    let eventName = "page_view";
    if (hasOrdered) {
      eventName = "purchase";
    } else if (hasCheckout) {
      eventName = "initiate_checkout";
    } else if (pathname === "/products") {
      eventName = "view_item_list";
    } else if (pathname.startsWith("/products/")) {
      eventName = "view_item";
    } else if (pathname === "/cart") {
      eventName = "view_cart";
    }

    // Setup metadata payload
    const metadata = {
      cartCount: items.reduce((sum, item) => sum + item.quantity, 0),
      cartSubtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      searchQuery: searchParams.get("search") || searchParams.get("q") || undefined,
    };

    // Debounce state adjustments to avoid redundant calls during routing
    const timer = setTimeout(() => {
      const payload = {
        sessionId,
        path: `${pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`,
        referrer: document.referrer || "Direct",
        hasCart,
        hasCheckout,
        hasOrdered,
        eventName,
        metadata,
      };

      fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.warn("Analytics transmission failed:", err);
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname, searchParams, items]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerContent />
    </Suspense>
  );
}
