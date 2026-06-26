"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2, Edit, Plus } from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  image: string;
  avatarColor: string;
  rating: number;
  text: string;
  product: string;
  isActive: boolean;
  order: number;
}

const AVATAR_COLORS = ["#ff6b00", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    image: "",
    avatarColor: "#ff6b00",
    rating: 5,
    text: "",
    product: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success(editingId ? "Testimonial updated!" : "Testimonial created!");
      resetForm();
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to save testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Testimonial deleted!");
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to delete testimonial");
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setForm({
      name: testimonial.name,
      image: testimonial.image,
      avatarColor: testimonial.avatarColor,
      rating: testimonial.rating,
      text: testimonial.text,
      product: testimonial.product,
      isActive: testimonial.isActive,
      order: testimonial.order,
    });
    setEditingId(testimonial._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      image: "",
      avatarColor: "#ff6b00",
      rating: 5,
      text: "",
      product: "",
      isActive: true,
      order: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="admin-page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }}>Testimonials</h1>
          <p style={{ color: "#6b7280", marginTop: "4px" }}>Manage customer reviews</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus size={20} /> {showForm ? "Cancel" : "Add Testimonial"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", marginBottom: "32px", border: "1px solid #f0f0f0" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>
            {editingId ? "Edit Testimonial" : "New Testimonial"}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label>Customer Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL (optional - leave empty for initials)</label>
              <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label>Avatar Color (if no image)</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {AVATAR_COLORS.map(color => (
                    <div
                      key={color}
                      onClick={() => setForm({ ...form, avatarColor: color })}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        background: color,
                        cursor: "pointer",
                        border: form.avatarColor === color ? "3px solid #000" : "2px solid #e5e7eb",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Rating *</label>
                <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} required>
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
            </div>

            <div className="form-group">
              <label>Review Text *</label>
              <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} required />
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Active (show on website)
            </label>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {testimonials.map((t) => (
          <div key={t._id} style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #f0f0f0", display: "flex", gap: "16px" }}>
            {t.image ? (
              <img src={t.image} alt={t.name} style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: t.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "20px" }}>
                {getInitials(t.name)}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: "16px" }}>{t.name}</h3>
                  <div style={{ color: "#fbbf24", fontSize: "14px" }}>{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => handleEdit(t)} style={{ padding: "8px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(t._id)} style={{ padding: "8px", background: "#fee2e2", border: "none", borderRadius: "8px", cursor: "pointer", color: "#dc2626" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p style={{ color: "#6b7280", marginTop: "8px", fontSize: "14px" }}>{t.text}</p>
              {t.product && <p style={{ color: "#9ca3af", fontSize: "12px", marginTop: "4px" }}>Product: {t.product}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
