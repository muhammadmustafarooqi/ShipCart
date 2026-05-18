"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinkSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterConfig {
  description: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: SocialLink[];
  footerLinks: FooterLinkSection[];
  policies: FooterLink[];
  codMessage: string;
}

const DEFAULT_FOOTER: FooterConfig = {
  description: "Pakistan's premier destination for ultra-premium tech, modern home appliances, and intelligent daily accessories.",
  contactEmail: "support@allinonestore.pk",
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
        { label: "Admin Portal", href: "/admin/dashboard" },
      ],
    },
    {
      title: "Departments",
      links: [
        { label: "Smart Kitchen", href: "/products?category=kitchen-cooking" },
        { label: "Personal Care", href: "/products?category=personal-care-beauty" },
        { label: "Home Essentials", href: "/products?category=home-cleaning" },
        { label: "Fitness & Health", href: "/products?category=fitness-health" },
        { label: "Tech Gadgets", href: "/products?category=electronics-gadgets" },
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

export default function AdminFooterPage() {
  const [loading, setLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [form, setForm] = useState<FooterConfig>(DEFAULT_FOOTER);
  const [activeTab, setActiveTab] = useState<"general" | "social" | "links" | "policies">("general");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings", {
          cache: "no-store",
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.footer) {
            setForm(data.footer);
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          footer: form,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save settings");
      }

      const savedData = await response.json();
      console.log("Footer saved successfully:", savedData);
      
      toast.success("Footer updated successfully!");
      window.dispatchEvent(new Event('settingsUpdated'));

      // Refetch to confirm the save
      setTimeout(() => {
        const loadSettings = async () => {
          try {
            const res = await fetch("/api/settings", {
              cache: "no-store",
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
              },
            });
            if (res.ok) {
              const data = await res.json();
              console.log("Refetched settings:", data);
              if (data.footer) {
                setForm(data.footer);
              }
            }
          } catch (error) {
            console.error("Error refetching settings:", error);
          }
        };
        loadSettings();
      }, 500);
    } catch (error) {
      console.error("Error saving:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update footer");
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingSettings) {
    return (
      <div style={{ padding: "32px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1000px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937" }}>Footer Settings</h1>
        <p style={{ color: "#6b7280", marginTop: "4px" }}>Manage footer content, links, and contact information</p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "32px", border: "1px solid #f0f0f0" }}>
        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", borderBottom: "1px solid #e5e7eb", flexWrap: "wrap" }}>
          {(["general", "social", "links", "policies"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: 600,
                color: activeTab === tab ? "#ff6b00" : "#6b7280",
                borderBottom: activeTab === tab ? "2px solid #ff6b00" : "none",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          {/* General Tab */}
          {activeTab === "general" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="form-group">
                <label>Store Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  style={{ minHeight: "100px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Contact Email</label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    value={form.contactPhone}
                    onChange={(e) => setForm(f => ({ ...f, contactPhone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contact Address</label>
                <input
                  type="text"
                  value={form.contactAddress}
                  onChange={(e) => setForm(f => ({ ...f, contactAddress: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>COD Message</label>
                <input
                  type="text"
                  value={form.codMessage}
                  onChange={(e) => setForm(f => ({ ...f, codMessage: e.target.value }))}
                  placeholder="e.g., Secure payments at your doorstep..."
                />
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === "social" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937" }}>Social Media Links</h3>
              </div>
              {form.socialLinks.map((link, index) => (
                <div key={index} style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: "12px", alignItems: "flex-end" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: "12px" }}>Platform</label>
                    <input
                      type="text"
                      value={link.platform}
                      onChange={(e) => {
                        const newLinks = [...form.socialLinks];
                        newLinks[index].platform = e.target.value;
                        setForm(f => ({ ...f, socialLinks: newLinks }));
                      }}
                      placeholder="e.g., facebook"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: "12px" }}>URL</label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...form.socialLinks];
                        newLinks[index].url = e.target.value;
                        setForm(f => ({ ...f, socialLinks: newLinks }));
                      }}
                      placeholder="https://..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(f => ({
                        ...f,
                        socialLinks: f.socialLinks.filter((_, i) => i !== index)
                      }));
                    }}
                    style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: "6px", padding: "8px", cursor: "pointer", color: "#ef4444" }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setForm(f => ({
                    ...f,
                    socialLinks: [...f.socialLinks, { platform: "", url: "" }]
                  }));
                }}
                className="btn-secondary"
                style={{ marginTop: "8px" }}
              >
                <Plus size={16} /> Add Social Link
              </button>
            </div>
          )}

          {/* Footer Links Tab */}
          {activeTab === "links" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {form.footerLinks.map((section, sectionIndex) => (
                <div key={sectionIndex} style={{ background: "#f9fafb", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        const newLinks = [...form.footerLinks];
                        newLinks[sectionIndex].title = e.target.value;
                        setForm(f => ({ ...f, footerLinks: newLinks }));
                      }}
                      placeholder="Section Title"
                      style={{ fontSize: "14px", fontWeight: 600, padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setForm(f => ({
                          ...f,
                          footerLinks: f.footerLinks.filter((_, i) => i !== sectionIndex)
                        }));
                      }}
                      style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: "6px", padding: "8px", cursor: "pointer", color: "#ef4444", marginLeft: "8px" }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {section.links.map((link, linkIndex) => (
                      <div key={linkIndex} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "12px", alignItems: "flex-end" }}>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const newLinks = [...form.footerLinks];
                            newLinks[sectionIndex].links[linkIndex].label = e.target.value;
                            setForm(f => ({ ...f, footerLinks: newLinks }));
                          }}
                          placeholder="Link Label"
                          style={{ padding: "8px 12px", fontSize: "13px", borderRadius: "6px", border: "1px solid #e5e7eb" }}
                        />
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => {
                            const newLinks = [...form.footerLinks];
                            newLinks[sectionIndex].links[linkIndex].href = e.target.value;
                            setForm(f => ({ ...f, footerLinks: newLinks }));
                          }}
                          placeholder="URL"
                          style={{ padding: "8px 12px", fontSize: "13px", borderRadius: "6px", border: "1px solid #e5e7eb" }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newLinks = [...form.footerLinks];
                            newLinks[sectionIndex].links = newLinks[sectionIndex].links.filter((_, i) => i !== linkIndex);
                            setForm(f => ({ ...f, footerLinks: newLinks }));
                          }}
                          style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: "6px", padding: "8px", cursor: "pointer", color: "#ef4444" }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newLinks = [...form.footerLinks];
                      newLinks[sectionIndex].links.push({ label: "", href: "" });
                      setForm(f => ({ ...f, footerLinks: newLinks }));
                    }}
                    className="btn-secondary"
                    style={{ marginTop: "12px", fontSize: "13px", padding: "8px 12px" }}
                  >
                    <Plus size={14} /> Add Link
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setForm(f => ({
                    ...f,
                    footerLinks: [...f.footerLinks, { title: "", links: [{ label: "", href: "" }] }]
                  }));
                }}
                className="btn-secondary"
              >
                <Plus size={16} /> Add Section
              </button>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === "policies" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937" }}>Footer Policies</h3>
              </div>
              {form.policies.map((policy, index) => (
                <div key={index} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "12px", alignItems: "flex-end" }}>
                  <input
                    type="text"
                    value={policy.label}
                    onChange={(e) => {
                      const newPolicies = [...form.policies];
                      newPolicies[index].label = e.target.value;
                      setForm(f => ({ ...f, policies: newPolicies }));
                    }}
                    placeholder="Policy Label"
                    style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb" }}
                  />
                  <input
                    type="text"
                    value={policy.href}
                    onChange={(e) => {
                      const newPolicies = [...form.policies];
                      newPolicies[index].href = e.target.value;
                      setForm(f => ({ ...f, policies: newPolicies }));
                    }}
                    placeholder="URL"
                    style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setForm(f => ({
                        ...f,
                        policies: f.policies.filter((_, i) => i !== index)
                      }));
                    }}
                    style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: "6px", padding: "8px", cursor: "pointer", color: "#ef4444" }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setForm(f => ({
                    ...f,
                    policies: [...f.policies, { label: "", href: "" }]
                  }));
                }}
                className="btn-secondary"
                style={{ marginTop: "8px" }}
              >
                <Plus size={16} /> Add Policy
              </button>
            </div>
          )}

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "24px", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: "150px", justifyContent: "center" }}>
              {loading ? "Saving..." : "Save Footer"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
