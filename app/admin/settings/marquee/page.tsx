"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, GripVertical } from "lucide-react";

export default function AdminMarqueePage() {
  const [loading, setLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [marqueeItems, setMarqueeItems] = useState([
    { icon: "Lock", text: "Secure & Safe Shopping" },
    { icon: "Users", text: "10,000+ Happy Customers" },
    { icon: "Truck", text: "Free Shipping Over Rs. 1,500" },
    { icon: "ShieldCheck", text: "100% Authentic Products" },
    { icon: "Banknote", text: "Cash on Delivery" },
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
          if (data.marqueeItems && data.marqueeItems.length > 0) {
            setMarqueeItems(data.marqueeItems);
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
      // Fetch current settings first
      const currentRes = await fetch("/api/settings", {
        cache: "no-store",
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
      const currentData = await currentRes.json();

      // Update only marqueeItems
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentData,
          marqueeItems,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save settings");
      }

      toast.success("Marquee banner updated successfully!");
      window.dispatchEvent(new Event('settingsUpdated'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update marquee banner");
    } finally {
      setLoading(false);
    }
  };

  const addMarqueeItem = () => {
    setMarqueeItems([...marqueeItems, { icon: "Lock", text: "" }]);
  };

  const removeMarqueeItem = (index: number) => {
    setMarqueeItems(marqueeItems.filter((_, i) => i !== index));
  };

  const updateMarqueeItem = (index: number, field: "icon" | "text", value: string) => {
    setMarqueeItems(
      marqueeItems.map((item, i) =>
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
    <div style={{ padding: "32px", maxWidth: "900px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937" }}>Marquee Banner</h1>
        <p style={{ color: "#6b7280", marginTop: "4px" }}>Manage the scrolling trust banner items</p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "32px", border: "1px solid #f0f0f0" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937" }}>
                Marquee Items
              </h3>
              <button type="button" onClick={addMarqueeItem} className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                <Plus size={16} /> Add Item
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {marqueeItems.map((item, index) => (
                <div key={index} style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "#f9fafb", padding: "12px", borderRadius: "8px" }}>
                  <GripVertical size={20} style={{ color: "#cbd5e1", marginTop: "8px", cursor: "grab" }} />
                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "140px 1fr", gap: "12px" }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: "12px" }}>Icon</label>
                      <select
                        value={item.icon}
                        onChange={(e) => updateMarqueeItem(index, "icon", e.target.value)}
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      >
                        <option value="Lock">Lock (Secure)</option>
                        <option value="Users">Users (Customers)</option>
                        <option value="Truck">Truck (Shipping)</option>
                        <option value="ShieldCheck">Shield (Authentic)</option>
                        <option value="Banknote">Banknote (COD)</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: "12px" }}>Text</label>
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => updateMarqueeItem(index, "text", e.target.value)}
                        placeholder="Enter marquee text"
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMarqueeItem(index)}
                    style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: "6px", padding: "8px", cursor: "pointer", color: "#ef4444", marginTop: "24px" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              {marqueeItems.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af", background: "#f9fafb", borderRadius: "8px" }}>
                  <p>No marquee items. Add at least one item to display on the homepage.</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "24px", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: "150px", justifyContent: "center" }}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>

      {/* Preview Section */}
      <div style={{ marginTop: "32px", background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f0f0f0" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginBottom: "16px" }}>Preview</h3>
        <div style={{ 
          background: "var(--color-brand)", 
          padding: "12px 20px", 
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative"
        }}>
          <div style={{ 
            display: "flex", 
            gap: "40px", 
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            animation: "scroll 20s linear infinite"
          }}>
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </span>
            ))}
          </div>
        </div>
        <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "12px" }}>
          This is a preview of how your marquee banner will look on the homepage.
        </p>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
