"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, CreditCard } from "lucide-react";
import { BrandLogoMark } from "@/components/BrandLogo";
import { useSettings } from "@/lib/useSettings";

const DEFAULT_FOOTER = {
  description:
    "Pakistan's premier destination for ultra-premium tech, modern home appliances, and intelligent daily accessories.",
  contactEmail: "support@ShipCartstore.pk",
  contactPhone: "923001234567",
  contactAddress: "Islamabad, Pakistan",
  socialLinks: [
    { platform: "facebook", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "whatsapp", url: "#" },
  ],
  footerLinks: [
    {
      title: "Explore",
      links: [
        { label: "Home", href: "/" },
        { label: "Premium Collection", href: "/products" },
        { label: "Shopping Cart", href: "/cart" },
        { label: "My Wishlist", href: "/wishlist" },
        { label: "Track Your Order", href: "/track-order" },
        { label: "Admin Portal", href: "/admin/dashboard" },
      ],
    },
    {
      title: "Departments",
      links: [
        { label: "Smart Kitchen", href: "/products?category=kitchen-cooking" },
        {
          label: "Personal Care",
          href: "/products?category=personal-care-beauty",
        },
        { label: "Home Essentials", href: "/products?category=home-cleaning" },
        {
          label: "Fitness & Health",
          href: "/products?category=fitness-health",
        },
        {
          label: "Tech Gadgets",
          href: "/products?category=electronics-gadgets",
        },
      ],
    },
  ],
  policies: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Return Policy", href: "#" },
  ],
  codMessage: "Secure payments at your doorstep. Free shipping over Rs. 3000.",
};

export default function Footer() {
  const { settings, loading } = useSettings();
  const footer = settings?.footer || DEFAULT_FOOTER;
  const whatsappNumber =
    settings?.whatsappNumber ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "923001234567";

  return (
    <footer className="footer" style={{ padding: "80px 0 0" }}>
      <div className="page-container" style={{ paddingBottom: "40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: "48px",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "20px",
              }}
            >
              <BrandLogoMark size={52} tone="cream" decorative />
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "20px",
                    color: "var(--maroon)",
                    fontFamily: "Outfit, sans-serif",
                    lineHeight: 1.1,
                  }}
                >
                  ShipCart
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--gold)",
                    letterSpacing: "2px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Premium Store
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.8,
                color: "var(--gray)",
                marginBottom: "24px",
                paddingRight: "20px",
              }}
            >
              {footer.description}
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              {footer.socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  className="footer-social"
                  aria-label={social.platform}
                >
                  {social.platform === "facebook" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                      />
                    </svg>
                  )}
                  {social.platform === "instagram" && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="5"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                  )}
                  {social.platform === "whatsapp" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                      />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Footer Link Sections */}
          {footer.footerLinks.map((section, idx) => (
            <div key={idx}>
              <div className="footer-title">{section.title}</div>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">
                      <span className="footer-link-arrow">&rarr;</span>{" "}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <div className="footer-title">Contact Support</div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <a
                href={`https://wa.me/${footer.contactPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-row"
              >
                <span className="footer-contact-ico">
                  <Phone
                    size={18}
                    strokeWidth={2}
                    color="currentColor"
                    aria-hidden
                  />
                </span>
                WhatsApp Support
              </a>
              <div className="footer-contact-row" style={{ cursor: "default" }}>
                <span className="footer-contact-ico">
                  <Mail
                    size={18}
                    strokeWidth={2}
                    color="currentColor"
                    aria-hidden
                  />
                </span>
                {footer.contactEmail}
              </div>
              <div className="footer-contact-row" style={{ cursor: "default" }}>
                <span className="footer-contact-ico">
                  <MapPin
                    size={18}
                    strokeWidth={2}
                    color="currentColor"
                    aria-hidden
                  />
                </span>
                {footer.contactAddress}
              </div>
              <div className="footer-cod">
                <div className="footer-cod-title">
                  <CreditCard size={16} color="var(--gold)" aria-hidden />
                  Cash on Delivery
                </div>
                <div className="footer-cod-desc">{footer.codMessage}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bar">
        <div
          className="page-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            width: "100%",
          }}
        >
          <p className="footer-bar-copy">
            © {new Date().getFullYear()}{" "}
            <span className="footer-bar-brand-a">ShipCart</span>{" "}
            <span className="footer-bar-brand-b">Premium Store</span>. All
            rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {footer.policies.map((policy) => (
              <a
                key={policy.label}
                href={policy.href}
                className="footer-policy"
              >
                {policy.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
