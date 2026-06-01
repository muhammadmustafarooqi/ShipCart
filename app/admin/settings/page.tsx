"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [form, setForm] = useState({
    storeName: "AllnOne Store",
    whatsappNumber: "923001234567",
    deliveryFee: 200,
    freeDeliveryAbove: 3000,
    announcementBarText: "Free Delivery on Orders Above PKR 3000 | COD Available Nationwide",
    announcementBarActive: true,
  });

  // Load settings from database on mount
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
          setForm({
            storeName: data.storeName || "ALLInONE Store",
            whatsappNumber: data.whatsappNumber || "923001234567",
            deliveryFee: data.deliveryFee || 200,
            freeDeliveryAbove: data.freeDeliveryAbove || 3000,
            announcementBarText: data.announcementBarText || "Free Delivery on Orders Above PKR 3000 | COD Available Nationwide",
            announcementBarActive: data.announcementBarActive ?? true,
          });
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
      // Fetch current settings to preserve all existing data
      const currentRes = await fetch("/api/settings", {
        cache: "no-store",
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
      const currentData = await currentRes.json();

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentData,
          ...form,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save settings");
      }

      toast.success("Settings updated successfully!");
      window.dispatchEvent(new Event('settingsUpdated'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update settings");
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
