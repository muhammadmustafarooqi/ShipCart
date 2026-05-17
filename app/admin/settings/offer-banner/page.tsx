"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const DEFAULT_OFFER = {
  isActive: true,
  kickerText: "Limited-time offer",
  kickerSubtext: "Ends when slots fill — same-day replies on WhatsApp",
  titleLine1: "FREE delivery + COD",
  titleLine2: "on carts",
  highlightText: "Rs. 1,500+",
  description: "Nationwide shipping, pay when it lands — no advance on standard orders. Stack cart value once and both perks unlock at checkout.",
  perk1Title: "Free shipping",
  perk1Text: "Orders Rs. 1,500+ ship on us",
  perk2Title: "COD unlocked",
  perk2Text: "Pay on delivery, zero prepay",
  buttonText: "Shop the offer",
  buttonLink: "/products",
  secondaryButtonText: "Featured picks",
  secondaryButtonLink: "/products?featured=true",
  statValue: "Rs. 1,500",
  statLabel: "Minimum cart for free delivery",
  stat2Value: "COD",
  stat2Label: "No advance on standard orders",
  panelNote: "Same dispatch and support as the rest of the store — only checkout perks change so you keep full confidence.",
};

export default function AdminOfferBannerPage() {
  const [loading, setLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [form, setForm] = useState(DEFAULT_OFFER);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.offerBanner) {
            setForm(data.offerBanner);
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
      const currentRes = await fetch("/api/settings");
      const currentData = await currentRes.json();

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentData,
          offerBanner: form,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save settings");
      }

      toast.success("Offer banner updated successfully!");
      window.dispatchEvent(new Event('settingsUpdated'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update offer banner");
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
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937" }}>Offer Banner</h1>
        <p style={{ color: "#6b7280", marginTop: "4px" }}>Manage the promotional offer banner on homepage</p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "32px", border: "1px solid #f0f0f0" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          {/* Active Toggle */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600, fontSize: "15px" }}>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                style={{ width: "18px", height: "18px", accentColor: "#ff6b00" }}
              />
              Show Offer Banner on Homepage
            </label>
          </div>

          {/* Kicker Section */}
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginBottom: "16px", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
              Top Badge
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Badge Text</label>
                <input 
                  type="text" 
                  value={form.kickerText} 
                  onChange={(e) => setForm(f => ({ ...f, kickerText: e.target.value }))} 
                  placeholder="Limited-time offer"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Subtext</label>
                <input 
                  type="text" 
                  value={form.kickerSubtext} 
                  onChange={(e) => setForm(f => ({ ...f, kickerSubtext: e.target.value }))} 
                  placeholder="Ends when slots fill"
                />
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginBottom: "16px", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
              Main Title
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Title Line 1</label>
                <input 
                  type="text" 
                  value={form.titleLine1} 
                  onChange={(e) => setForm(f => ({ ...f, titleLine1: e.target.value }))} 
                  placeholder="FREE delivery + COD"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Title Line 2</label>
                <input 
                  type="text" 
                  value={form.titleLine2} 
                  onChange={(e) => setForm(f => ({ ...f, titleLine2: e.target.value }))} 
                  placeholder="on carts"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Highlight Text</label>
                <input 
                  type="text" 
                  value={form.highlightText} 
                  onChange={(e) => setForm(f => ({ ...f, highlightText: e.target.value }))} 
                  placeholder="Rs. 1,500+"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginBottom: "16px", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
              Description
            </h3>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Main Description</label>
              <textarea 
                value={form.description} 
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} 
                rows={3}
                placeholder="Nationwide shipping, pay when it lands..."
              />
            </div>
          </div>

          {/* Perks */}
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginBottom: "16px", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
              Feature Perks
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280", marginBottom: "12px" }}>Perk 1</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Title</label>
                    <input 
                      type="text" 
                      value={form.perk1Title} 
                      onChange={(e) => setForm(f => ({ ...f, perk1Title: e.target.value }))} 
                      placeholder="Free shipping"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Description</label>
                    <input 
                      type="text" 
                      value={form.perk1Text} 
                      onChange={(e) => setForm(f => ({ ...f, perk1Text: e.target.value }))} 
                      placeholder="Orders Rs. 1,500+ ship on us"
                    />
                  </div>
                </div>
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280", marginBottom: "12px" }}>Perk 2</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Title</label>
                    <input 
                      type="text" 
                      value={form.perk2Title} 
                      onChange={(e) => setForm(f => ({ ...f, perk2Title: e.target.value }))} 
                      placeholder="COD unlocked"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Description</label>
                    <input 
                      type="text" 
                      value={form.perk2Text} 
                      onChange={(e) => setForm(f => ({ ...f, perk2Text: e.target.value }))} 
                      placeholder="Pay on delivery, zero prepay"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginBottom: "16px", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
              Call-to-Action Buttons
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280", marginBottom: "12px" }}>Primary Button</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Button Text</label>
                    <input 
                      type="text" 
                      value={form.buttonText} 
                      onChange={(e) => setForm(f => ({ ...f, buttonText: e.target.value }))} 
                      placeholder="Shop the offer"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Button Link</label>
                    <input 
                      type="text" 
                      value={form.buttonLink} 
                      onChange={(e) => setForm(f => ({ ...f, buttonLink: e.target.value }))} 
                      placeholder="/products"
                    />
                  </div>
                </div>
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280", marginBottom: "12px" }}>Secondary Button</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Button Text</label>
                    <input 
                      type="text" 
                      value={form.secondaryButtonText} 
                      onChange={(e) => setForm(f => ({ ...f, secondaryButtonText: e.target.value }))} 
                      placeholder="Featured picks"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Button Link</label>
                    <input 
                      type="text" 
                      value={form.secondaryButtonLink} 
                      onChange={(e) => setForm(f => ({ ...f, secondaryButtonLink: e.target.value }))} 
                      placeholder="/products?featured=true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginBottom: "16px", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
              Side Panel Stats
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280", marginBottom: "12px" }}>Stat 1</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Value</label>
                    <input 
                      type="text" 
                      value={form.statValue} 
                      onChange={(e) => setForm(f => ({ ...f, statValue: e.target.value }))} 
                      placeholder="Rs. 1,500"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Label</label>
                    <input 
                      type="text" 
                      value={form.statLabel} 
                      onChange={(e) => setForm(f => ({ ...f, statLabel: e.target.value }))} 
                      placeholder="Minimum cart for free delivery"
                    />
                  </div>
                </div>
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280", marginBottom: "12px" }}>Stat 2</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Value</label>
                    <input 
                      type="text" 
                      value={form.stat2Value} 
                      onChange={(e) => setForm(f => ({ ...f, stat2Value: e.target.value }))} 
                      placeholder="COD"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Label</label>
                    <input 
                      type="text" 
                      value={form.stat2Label} 
                      onChange={(e) => setForm(f => ({ ...f, stat2Label: e.target.value }))} 
                      placeholder="No advance on standard orders"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group" style={{ margin: 0, marginTop: "16px" }}>
              <label>Panel Note</label>
              <textarea 
                value={form.panelNote} 
                onChange={(e) => setForm(f => ({ ...f, panelNote: e.target.value }))} 
                rows={2}
                placeholder="Same dispatch and support as the rest of the store..."
              />
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "24px", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: "150px", justifyContent: "center" }}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
