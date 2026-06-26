"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

export default function AdminNavbarPage() {
  const [loading, setLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [navLinks, setNavLinks] = useState<NavLink[]>([
    { label: "Home", href: "/" },
    { label: "Shop All", href: "/products" },
    { label: "Kitchen", href: "/products?category=kitchen-cooking" },
    { label: "Personal Care", href: "/products?category=personal-care-beauty" },
    { label: "Electronics", href: "/products?category=electronics-gadgets" },
  ]);

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
          if (data.navbar?.links && data.navbar.links.length > 0) {
            setNavLinks(data.navbar.links);
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
    
    if (navLinks.length === 0) {
      toast.error("At least one navigation link is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          navbar: { links: navLinks },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save settings");
      }

      const savedData = await response.json();
      console.log("Navbar saved successfully:", savedData);
      
      toast.success("Navbar updated successfully!");
      
      // Dispatch event and wait a bit for propagation
      window.dispatchEvent(new Event('settingsUpdated'));
      
      // Also refetch to confirm the save
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
              if (data.navbar?.links) {
                setNavLinks(data.navbar.links);
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
      toast.error(error instanceof Error ? error.message : "Failed to update navbar");
    } finally {
      setLoading(false);
    }
  };

  const addNavLink = () => {
    setNavLinks([...navLinks, { label: "", href: "" }]);
  };

  const removeNavLink = (index: number) => {
    setNavLinks(navLinks.filter((_, i) => i !== index));
  };

  const updateNavLink = (index: number, field: "label" | "href", value: string) => {
    setNavLinks(
      navLinks.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  if (isLoadingSettings) {
    return (
      <div style={{ padding: "32px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="admin-page-container" style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937" }}>Navigation Menu</h1>
        <p style={{ color: "#6b7280", marginTop: "4px" }}>Manage the main navigation links in the navbar</p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "32px", border: "1px solid #f0f0f0" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937" }}>
                Navigation Links
              </h3>
              <button type="button" onClick={addNavLink} className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                <Plus size={16} /> Add Link
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {navLinks.map((link, index) => (
                <div key={index} style={{ display: "flex", gap: "12px", alignItems: "flex-end", background: "#f9fafb", padding: "12px", borderRadius: "8px" }}>
                  <GripVertical size={20} style={{ color: "#cbd5e1", marginTop: "8px", cursor: "grab", flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: "12px" }}>Label</label>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateNavLink(index, "label", e.target.value)}
                        placeholder="e.g., Home"
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: "12px" }}>URL</label>
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => updateNavLink(index, "href", e.target.value)}
                        placeholder="e.g., /products"
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNavLink(index)}
                    style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: "6px", padding: "8px", cursor: "pointer", color: "#ef4444", flexShrink: 0 }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "24px", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: "150px", justifyContent: "center" }}>
              {loading ? "Saving..." : "Save Navigation"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
