"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2, Edit, Plus } from "lucide-react";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  isActive: boolean;
  order: number;
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const res = await fetch("/api/faqs");
      const data = await res.json();
      setFaqs(data);
    } catch (error) {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId ? `/api/faqs/${editingId}` : "/api/faqs";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success(editingId ? "FAQ updated!" : "FAQ created!");
      resetForm();
      fetchFAQs();
    } catch (error) {
      toast.error("Failed to save FAQ");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;

    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("FAQ deleted!");
      fetchFAQs();
    } catch (error) {
      toast.error("Failed to delete FAQ");
    }
  };

  const handleEdit = (faq: FAQ) => {
    setForm({
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
      order: faq.order,
    });
    setEditingId(faq._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      question: "",
      answer: "",
      isActive: true,
      order: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }}>FAQs</h1>
          <p style={{ color: "#6b7280", marginTop: "4px" }}>Manage frequently asked questions</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus size={20} /> {showForm ? "Cancel" : "Add FAQ"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", marginBottom: "32px", border: "1px solid #f0f0f0" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>
            {editingId ? "Edit FAQ" : "New FAQ"}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="form-group">
              <label>Question *</label>
              <input type="text" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
            </div>

            <div className="form-group">
              <label>Answer *</label>
              <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} required />
            </div>

            <div className="form-group">
              <label>Display Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
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
        {faqs.map((faq) => (
          <div key={faq._id} style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
              <h3 style={{ fontWeight: 700, fontSize: "16px", flex: 1 }}>{faq.question}</h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => handleEdit(faq)} style={{ padding: "8px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(faq._id)} style={{ padding: "8px", background: "#fee2e2", border: "none", borderRadius: "8px", cursor: "pointer", color: "#dc2626" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
