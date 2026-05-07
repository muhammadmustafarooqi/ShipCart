import { Rocket, ShieldCheck, Banknote, RefreshCcw, Truck, Gift, Lock, Users } from "lucide-react";

export default function MarqueeBanner() {
  const items = [
    { icon: <Truck size={16} color="var(--color-icon)" />, text: "Free Shipping Over Rs. 1,500" },
    { icon: <ShieldCheck size={16} color="var(--color-icon)" />, text: "100% Authentic Products" },
    { icon: <Banknote size={16} color="var(--color-icon)" />, text: "Cash on Delivery Available" },
    { icon: <RefreshCcw size={16} color="var(--color-icon)" />, text: "7-Day Easy Returns" },
    { icon: <Rocket size={16} color="var(--color-icon)" />, text: "Fast Nationwide Delivery" },
    { icon: <Gift size={16} color="var(--color-icon)" />, text: "Exclusive Deals Every Week" },
    { icon: <Lock size={16} color="var(--color-icon)" />, text: "Secure & Safe Shopping" },
    { icon: <Users size={16} color="var(--color-icon)" />, text: "10,000+ Happy Customers" },
  ];

  const doubled = [...items, ...items];

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {doubled.map((item, i) => (
          <span key={i}>
            {item.icon} {item.text}
            <span style={{ marginLeft: "48px", opacity: 0.3 }}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
