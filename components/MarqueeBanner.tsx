import { Lock, Users, Truck, ShieldCheck, Banknote } from "lucide-react";

const iconProps = { size: 16, color: "rgba(255, 253, 249, 0.9)" as const, strokeWidth: 2.25 };

/** Trust strip — infinite scroll; place below navbar, above hero. */
export default function MarqueeBanner() {
  const items = [
    { icon: <Lock {...iconProps} />, text: "Secure & Safe Shopping" },
    { icon: <Users {...iconProps} />, text: "10,000+ Happy Customers" },
    { icon: <Truck {...iconProps} />, text: "Free Shipping Over Rs. 1,500" },
    { icon: <ShieldCheck {...iconProps} />, text: "100% Authentic Products" },
    { icon: <Banknote {...iconProps} />, text: "Cash on Delivery" },
  ];

  const doubled = [...items, ...items];

  return (
    <div className="marquee-container trust-marquee">
      <div className="marquee-content">
        {doubled.map((item, i) => (
          <span key={i}>
            {item.icon}
            <span style={{ marginLeft: "8px" }}>{item.text}</span>
            <span style={{ marginLeft: "40px", opacity: 0.35, fontWeight: 400 }} aria-hidden>
              •
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
