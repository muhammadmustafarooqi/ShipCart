"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      style={{ 
        position: "relative", 
        padding: "10px 40px", 
        background: "var(--color-brand)",
        color: "white",
        fontSize: "13px",
        fontWeight: 600,
        textAlign: "center",
        fontFamily: "Plus Jakarta Sans, sans-serif",
        letterSpacing: "0.5px"
      }}
    >
      <span className="animate-pulse" style={{ marginRight: "8px" }}>✨</span>
      Free nationwide delivery on orders above Rs. 1,500 &nbsp;|&nbsp; 💵 Cash on Delivery
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          opacity: 0.7,
          transition: "opacity 150ms ease",
          display: "flex",
          alignItems: "center"
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
      >
        <X size={16} />
      </button>
    </div>
  );
}
