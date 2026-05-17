"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2, Edit, Plus, Package, Truck, Shield, Clock, Users, Star, Award, TrendingUp } from "lucide-react";

interface Stat {
  _id: string;
  value: string;
  label: string;
  icon: string;
  isActive: boolean;
  order: number;
}

const ICONS = [
  { name: "package", icon: Package },
  { name: "truck", icon: Truck },
  { name: "shield", icon: Shield },
  { name: "clock", icon: Clock },
  { name: "users", icon: Users },
  { name: "star", icon: Star },
  { name: "award", icon: Award },
  { name: "trending", icon: TrendingUp },
];

export default function StatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    value: "",
    label: "",
    icon: "package",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId ? `/api/stats/${editingId}` : "/api/stats";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success(editingId ? "Stat updated!" : "Stat created!");
      resetForm();
      fetchStats();
    } catch (error) {
      toast.error("Failed to save stat");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this stat?")) return;

    try {
      const res = await fetch(`/api/stats/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Stat deleted!");
      fetchStats();
    } catch (error) {
      toast.error("Failed to delete stat");
    }
  };

  const handleEdit = (stat: Stat) => {
    setForm({
      value: stat.value,
      label: stat.label,
      icon: stat.icon,
      isActive: stat.isActive,
      order: stat.order,
    });
    setEditingId(stat._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      value: "",
      label: "",
      icon: "package",
      isActive: true,
      order: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getIcon = (iconName: string) => {
    const iconObj = ICONS.find(i => i.name === iconName);
    return iconObj ? iconObj.icon : Package;
  };

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }}>Stats</h1>
          <p style={{ color: "#6b7280", marginTop: "4px" }}>Manage homepage statistics</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus size={20} /> {showForm ? "Cancel" : "Add Stat"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", marginBottom: "32px", border: "1px solid #f0f0f0" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>
            {editingId ? "Edit Stat" : "New Stat"}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label>Value *</label>
                <input type="text" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="e.g., 10,000+" required />
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
            </div>

            <div className="form-group">
              <label>Label *</label>
              <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g., Happy Customers" required />
            </div>

            <div className="form-group">
              <label>Icon</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                {ICONS.map(({ name, icon: Icon }) => (
                  <div
                    key={name}
                    onClick={() => setForm({ ...form, icon: name })}
                    style={{
                      padding: "16px",
                      border: form.icon === name ? "2px solid #ff6b00" : "1px solid #e5e7eb",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      background: form.icon === name ? "#fff7ed" : "white",
                    }}
                  >
                    <Icon size={24} color={form.icon === name ? "#ff6b00" : "#6b7280"} />
                    <span style={{ fontSize: "12px", textTransform: "capitalize" }}>{name}</span>
                  </div>
                ))}
              </div>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
        {stats.map((stat) => {
          const Icon = getIcon(stat.icon);
          return (
            <div key={stat._id} style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #f0f0f0", position: "relative" }}>
              <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", gap: "8px" }}>
                <button onClick={() => handleEdit(stat)} style={{ padding: "6px", background: "#f3f4f6", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(stat._id)} style={{ padding: "6px", background: "#fee2e2", border: "none", borderRadius: "6px", cursor: "pointer", color: "#dc2626" }}>
                  <Trash2 size={14} />
                </button>
              </div>
              <Icon size={32} color="#ff6b00" style={{ marginBottom: "12px" }} />
              <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "4px" }}>{stat.value}</h3>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
