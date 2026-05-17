"use client";

import { Lock, Users, Truck, ShieldCheck, Banknote, LucideIcon } from "lucide-react";
import { useSettings } from "@/lib/useSettings";

const iconProps = { size: 16, color: "var(--gold)" as const, strokeWidth: 2.25 };

const iconMap: Record<string, LucideIcon> = {
  Lock,
  Users,
  Truck,
  ShieldCheck,
  Banknote,
};

const DEFAULT_ITEMS = [
  { icon: "Lock", text: "Secure & Safe Shopping" },
  { icon: "Users", text: "10,000+ Happy Customers" },
  { icon: "Truck", text: "Free Shipping Over Rs. 1,500" },
  { icon: "ShieldCheck", text: "100% Authentic Products" },
  { icon: "Banknote", text: "Cash on Delivery" },
];

/** Trust strip — infinite scroll; place below navbar, above hero. */
export default function MarqueeBanner() {
  const { settings, loading } = useSettings();
  
  const items = settings?.marqueeItems && settings.marqueeItems.length > 0 
    ? settings.marqueeItems 
    : DEFAULT_ITEMS;

  const doubled = [...items, ...items];

  if (loading) return null;

  return (
    <div className="marquee-container trust-marquee">
      <div className="marquee-content">
        {doubled.map((item, i) => {
          const IconComponent = iconMap[item.icon] || Lock;
          return (
            <span key={i}>
              <IconComponent {...iconProps} />
              <span style={{ marginLeft: "8px" }}>{item.text}</span>
              <span style={{ marginLeft: "40px", opacity: 0.35, fontWeight: 400 }} aria-hidden>
                •
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
