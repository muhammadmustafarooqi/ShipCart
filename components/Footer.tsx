import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

  return (
    <footer className="footer">
      {/* Main Footer */}
      <div className="page-container" style={{ padding: "80px 32px 40px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "60px",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{
                background: "var(--primary)",
                color: "white",
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "18px",
                fontFamily: "Outfit, sans-serif"
              }}>
                AIO
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "22px", color: "white", lineHeight: 1.1, fontFamily: "Outfit, sans-serif" }}>
                  ALLIn<span style={{ color: "var(--primary)" }}>ONE</span>
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", fontWeight: 600 }}>
                  STORE
                </div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: 1.8, marginBottom: "24px" }}>
              Pakistan&apos;s trusted destination for quality household gadgets, kitchen tools, personal care devices, and tech accessories. COD available nationwide.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { 
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, 
                  href: "#", bg: "#1877f2" 
                },
                { 
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>, 
                  href: "#", bg: "#e4405f" 
                },
                { 
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>, 
                  href: "#", bg: "#ff0000" 
                },
                                                                                                                                                                                              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: social.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "16px", marginBottom: "20px" }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Home", href: "/" },
                { label: "All Products", href: "/products" },
                { label: "Cart", href: "/cart" },
                { label: "Track Order", href: "/track-order" },
                { label: "Admin Panel", href: "/admin/dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#ff6b00" }}>›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "16px", marginBottom: "20px" }}>
              Categories
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Kitchen & Cooking", slug: "kitchen-cooking" },
                { label: "Personal Care", slug: "personal-care-beauty" },
                { label: "Home & Cleaning", slug: "home-cleaning" },
                { label: "Fitness & Health", slug: "fitness-health" },
                { label: "Electronics", slug: "electronics-gadgets" },
                { label: "Baby & Kids", slug: "baby-kids" },
              ].map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/products?category=${cat.slug}`} className="footer-link" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#ff6b00" }}>›</span> {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "16px", marginBottom: "20px" }}>
              Contact Us
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                <div style={{ width: "36px", height: "36px", background: "#25d366", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Phone size={16} color="white" />
                </div>
                <span>WhatsApp Order</span>
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
                <div style={{ width: "36px", height: "36px", background: "rgba(255,107,0,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Mail size={16} color="#ff6b00" />
                </div>
                <span>info@allinonestore.pk</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
                <div style={{ width: "36px", height: "36px", background: "rgba(255,107,0,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={16} color="#ff6b00" />
                </div>
                <span>Pakistan</span>
              </div>
            </div>

            {/* COD Badge */}
            <div style={{
              marginTop: "24px",
              padding: "14px",
              background: "rgba(255,107,0,0.1)",
              borderRadius: "12px",
              border: "1px solid rgba(255,107,0,0.2)",
            }}>
              <div style={{ color: "#ff6b00", fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>
                💰 Cash on Delivery
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
                Pay when you receive your order. Free delivery above Rs. 1,500.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div className="page-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", width: "100%" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
            © {new Date().getFullYear()} ALLInONE Store. All rights reserved. Made with ❤️ in Pakistan.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Terms of Service", "Return Policy"].map((item) => (
              <a key={item} href="#" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none" }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
