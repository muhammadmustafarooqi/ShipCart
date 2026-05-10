"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

  return (
    <footer className="footer" style={{ padding: "80px 0 0" }}>
      <div className="page-container" style={{ paddingBottom: "40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "48px" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ 
                width: "40px", height: "40px", 
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
                background: "white"
              }}>
                <Image 
                  src="/logo.webp" 
                  alt="AllInOne Store Logo" 
                  width={40} 
                  height={40}
                  style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "20px", color: "white", fontFamily: "Outfit, sans-serif", lineHeight: 1.1 }}>AllInOne</div>
                <div style={{ fontSize: "10px", color: "var(--text-secondary)", letterSpacing: "2px", fontWeight: 600, textTransform: "uppercase" }}>Premium Store</div>
              </div>
            </div>
            <p style={{ fontSize: "14px", lineHeight: 1.8, color: "#94a3b8", marginBottom: "24px", paddingRight: "20px" }}>
              Pakistan&apos;s premier destination for ultra-premium tech, modern home appliances, and intelligent daily accessories.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { bg: "var(--color-brand)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> },
                { bg: "var(--color-brand)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="white" /></svg> },
                { bg: "var(--color-brand)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg> },
              ].map((s, i) => (
                <a key={i} href="#" style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all .3s ease" }} onMouseEnter={(e) => { (e.currentTarget.style.background = s.bg); (e.currentTarget.style.transform = "translateY(-2px)"); }} onMouseLeave={(e) => { (e.currentTarget.style.background = "rgba(255,255,255,0.1)"); (e.currentTarget.style.transform = "translateY(0)"); }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="footer-title">Explore</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[{ label: "Home", href: "/" }, { label: "Premium Collection", href: "/products" }, { label: "Shopping Cart", href: "/cart" }, { label: "Admin Portal", href: "/admin/dashboard" }].map((l) => (
                <li key={l.href}><Link href={l.href} className="footer-link"><span style={{ color: "var(--color-icon)" }}>&rarr;</span> {l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <div className="footer-title">Departments</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Smart Kitchen", slug: "kitchen-cooking" },
                { label: "Personal Care", slug: "personal-care-beauty" },
                { label: "Home Essentials", slug: "home-cleaning" },
                { label: "Fitness & Health", slug: "fitness-health" },
                { label: "Tech Gadgets", slug: "electronics-gadgets" },
              ].map((c) => (
                <li key={c.slug}><Link href={`/products?category=${c.slug}`} className="footer-link"><span style={{ color: "var(--color-icon)" }}>&rarr;</span> {c.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-title">Contact Support</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8", textDecoration: "none", fontSize: "14px", transition: "color .2s ease" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "white")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94a3b8")}>
                <div style={{ width: "36px", height: "36px", background: "rgba(37,99,235,.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Phone size={16} color="var(--color-icon)" /></div>
                WhatsApp Support
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8", fontSize: "14px" }}>
                <div style={{ width: "36px", height: "36px", background: "rgba(37,99,235,.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Mail size={16} color="var(--color-icon)" /></div>
                support@allinonestore.pk
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8", fontSize: "14px" }}>
                <div style={{ width: "36px", height: "36px", background: "rgba(37,99,235,.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><MapPin size={16} color="var(--color-icon)" /></div>
                Islamabad, Pakistan 🇵🇰
              </div>
              <div style={{ marginTop: "12px", padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}>
                <div style={{ color: "white", fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>💳 Cash on Delivery</div>
                <div style={{ color: "#64748b", fontSize: "12px", lineHeight: 1.5 }}>Secure payments at your doorstep. Free shipping over Rs. 1,500.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 20px", background: "#020617" }}>
        <div className="page-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", width: "100%" }}>
          <p style={{ color: "#64748b", fontSize: "13px" }}>© {new Date().getFullYear()} AllInOne Premium Store. All rights reserved.</p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacy Policy", "Terms of Service", "Return Policy"].map((item) => (
              <a key={item} href="#" style={{ color: "#64748b", fontSize: "13px", textDecoration: "none", transition: "color .2s ease" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "white")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#64748b")}>{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
