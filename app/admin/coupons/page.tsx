"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Tag } from "lucide-react";
import toast from "react-hot-toast";

interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed" | "free_shipping";
  discountValue: number;
  minPurchase: number;
  expiresAt?: string;
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minPurchase: 0,
    expiresAt: "",
    usageLimit: "",
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (res.ok) setCoupons(data.coupons || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setForm({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchase: coupon.minPurchase,
        expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split("T")[0] : "",
        usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : "",
        isActive: coupon.isActive,
      });
    } else {
      setEditingCoupon(null);
      setForm({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        minPurchase: 0,
        expiresAt: "",
        usageLimit: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) return toast.error("Code is required");

    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      minPurchase: Number(form.minPurchase),
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
    };

    try {
      const url = editingCoupon ? `/api/admin/coupons/${editingCoupon._id}` : "/api/admin/coupons";
      const method = editingCoupon ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(`Coupon ${editingCoupon ? "updated" : "created"}`);
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (err) {
      toast.error("Error deleting coupon");
    }
  };

  return (
    <div className="admin-page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937", display: "flex", alignItems: "center", gap: "8px" }}>
            <Tag size={28} /> Global Coupons
          </h1>
          <p style={{ color: "#6b7280", marginTop: "4px" }}>Manage discount codes and promotional offers</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={18} /> New Coupon
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
          <div className="spinner" />
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ fontWeight: 800, color: "#1f2937", fontSize: "14px" }}>{c.code}</div>
                    {c.expiresAt && <div style={{ fontSize: "12px", color: "#6b7280" }}>Expires: {new Date(c.expiresAt).toLocaleDateString()}</div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#ff6b00", fontSize: "14px" }}>
                      {c.discountType === "percentage" ? `${c.discountValue}% OFF` : c.discountType === "fixed" ? `Rs. ${c.discountValue} OFF` : "FREE SHIPPING"}
                    </div>
                    {c.minPurchase > 0 && <div style={{ fontSize: "12px", color: "#6b7280" }}>Min: Rs. {c.minPurchase}</div>}
                  </td>
                  <td>
                    <div style={{ fontSize: "13px", color: "#374151" }}>{c.timesUsed} used</div>
                    {c.usageLimit && <div style={{ fontSize: "12px", color: "#6b7280" }}>Limit: {c.usageLimit}</div>}
                  </td>
                  <td>
                    <span style={{ fontSize: "12px", padding: "4px 8px", borderRadius: "12px", fontWeight: 600, background: c.isActive ? "#d1fae5" : "#fee2e2", color: c.isActive ? "#065f46" : "#991b1b" }}>
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleOpenModal(c)} style={{ background: "rgba(59,130,246,0.1)", border: "none", borderRadius: "6px", padding: "6px", cursor: "pointer", color: "#3b82f6" }}>
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(c._id)} style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: "6px", padding: "6px", cursor: "pointer", color: "#ef4444" }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>No coupons created yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="admin-form-modal" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "32px 16px" }}>
          <div className="admin-form-content" style={{ background: "white", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "500px", position: "relative" }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "#f3f4f6", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={16} />
            </button>
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px", color: "#1f2937" }}>
              {editingCoupon ? "Edit Coupon" : "Create Coupon"}
            </h2>
            <form onSubmit={handleSubmit} className="admin-product-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input type="text" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER50" style={{ textTransform: "uppercase" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label>Type</label>
                    <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as any })}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (Rs.)</option>
                      <option value="free_shipping">Free Shipping</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Value</label>
                    <input type="number" required={form.discountType !== "free_shipping"} disabled={form.discountType === "free_shipping"} value={form.discountType === "free_shipping" ? 0 : form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} style={{ opacity: form.discountType === "free_shipping" ? 0.5 : 1 }} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Minimum Purchase Amount (Rs.)</label>
                  <input type="number" value={form.minPurchase} onChange={(e) => setForm({ ...form, minPurchase: Number(e.target.value) })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label>Usage Limit</label>
                    <input type="number" placeholder="Unlimited" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 500 }}>
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} style={{ width: "18px", height: "18px", accentColor: "#ff6b00" }} />
                    Coupon is Active
                  </label>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ minWidth: "120px" }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ minWidth: "120px" }}>{editingCoupon ? "Save" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
