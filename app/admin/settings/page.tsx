"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    storeName: "ALLInONE Store",
    whatsappNumber: "923001234567",
    deliveryFee: 200,
    freeDeliveryAbove: 1500,
    announcementBarText: "Free Delivery on Orders Above PKR 1500 | COD Available Nationwide",
    announcementBarActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call for settings
      await new Promise((res) => setTimeout(res, 800));
      toast.success("Settings updated successfully!");
    } catch {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: "800px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937" }}>Store Settings</h1>
        <p style={{ color: "#6b7280", marginTop: "4px" }}>Manage your store configuration</p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "32px", border: "1px solid #f0f0f0" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginBottom: "16px", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
              General Information
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Store Name</label>
                <input 
                  type="text" 
                  value={form.storeName} 
                  onChange={(e) => setForm(f => ({ ...f, storeName: e.target.value }))} 
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>WhatsApp Number (format: 92XXXXXXXXXX)</label>
                <input 
                  type="text" 
                  value={form.whatsappNumber} 
                  onChange={(e) => setForm(f => ({ ...f, whatsappNumber: e.target.value }))} 
                />
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginBottom: "16px", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
              Shipping Rules
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Standard Delivery Fee (PKR)</label>
                <input 
                  type="number" 
                  value={form.deliveryFee} 
                  onChange={(e) => setForm(f => ({ ...f, deliveryFee: Number(e.target.value) }))} 
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Free Delivery Threshold (PKR)</label>
                <input 
                  type="number" 
                  value={form.freeDeliveryAbove} 
                  onChange={(e) => setForm(f => ({ ...f, freeDeliveryAbove: Number(e.target.value) }))} 
                />
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginBottom: "16px", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
              Announcement Bar
            </h3>
            <div className="form-group" style={{ margin: 0, marginBottom: "16px" }}>
              <label>Text Content</label>
              <input 
                type="text" 
                value={form.announcementBarText} 
                onChange={(e) => setForm(f => ({ ...f, announcementBarText: e.target.value }))} 
              />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 500, fontSize: "14px" }}>
              <input
                type="checkbox"
                checked={form.announcementBarActive}
                onChange={(e) => setForm((f) => ({ ...f, announcementBarActive: e.target.checked }))}
                style={{ width: "18px", height: "18px", accentColor: "#ff6b00" }}
              />
              Show Announcement Bar on Website
            </label>
          </div>

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "24px", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: "150px", justifyContent: "center" }}>
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
