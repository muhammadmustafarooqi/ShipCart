"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Package } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
}

interface Pack {
  quantity: number;
  price: number;
  label?: string;
}

interface Bundle {
  _id: string;
  product: Product;
  packs: Pack[];
  isActive: boolean;
}

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);

  const [form, setForm] = useState<{ product: string; packs: Pack[]; isActive: boolean }>({
    product: "",
    packs: [{ quantity: 2, price: 0, label: "" }],
    isActive: true,
  });

  const fetchData = async () => {
    try {
      const [resBundles, resProducts] = await Promise.all([
        fetch("/api/admin/bundles"),
        fetch("/api/products?limit=1000")
      ]);
      const dataBundles = await resBundles.json();
      const dataProducts = await resProducts.json();
      if (resBundles.ok) setBundles(dataBundles.bundles || []);
      if (resProducts.ok) setProducts(dataProducts.products || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (bundle?: Bundle) => {
    if (bundle) {
      setEditingBundle(bundle);
      setForm({
        product: bundle.product?._id || "",
        packs: bundle.packs || [{ quantity: 2, price: 0, label: "" }],
        isActive: bundle.isActive,
      });
    } else {
      setEditingBundle(null);
      setForm({
        product: "",
        packs: [{ quantity: 2, price: 0, label: "Best Seller 🔥" }],
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const addPack = () => {
    setForm(prev => ({
      ...prev,
      packs: [...prev.packs, { quantity: prev.packs.length + 2, price: 0, label: "" }]
    }));
  };

  const removePack = (index: number) => {
    setForm(prev => ({
      ...prev,
      packs: prev.packs.filter((_, i) => i !== index)
    }));
  };

  const updatePack = (index: number, field: keyof Pack, value: any) => {
    setForm(prev => {
      const newPacks = [...prev.packs];
      newPacks[index] = { ...newPacks[index], [field]: value };
      return { ...prev, packs: newPacks };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product) return toast.error("Product is required");
    if (form.packs.length === 0) return toast.error("At least one pack is required");
    
    // Ensure numbers
    const payload = {
      ...form,
      packs: form.packs.map(p => ({
        ...p,
        quantity: Number(p.quantity),
        price: Number(p.price)
      }))
    };

    try {
      const url = editingBundle ? `/api/admin/bundles/${editingBundle._id}` : "/api/admin/bundles";
      const method = editingBundle ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(`Bundle offers ${editingBundle ? "updated" : "created"}`);
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete these bundle offers?")) return;
    try {
      const res = await fetch(`/api/admin/bundles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Bundle deleted");
      fetchData();
    } catch (err) {
      toast.error("Error deleting bundle");
    }
  };

  return (
    <div className="admin-page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937", display: "flex", alignItems: "center", gap: "8px" }}>
            <Package size={28} /> Product Packs
          </h1>
          <p style={{ color: "#6b7280", marginTop: "4px" }}>Manage volume discounts and pack offers</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={18} /> New Pack Offer
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
                <th>Product</th>
                <th>Packs Available</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bundles.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div style={{ fontWeight: 800, color: "#1f2937", fontSize: "14px" }}>{b.product?.name || "Unknown"}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>Standard Price: Rs. {b.product?.price || 0}</div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {(b.packs || []).map(p => (
                        <span key={p.quantity} style={{ fontSize: "12px", padding: "4px 8px", background: "#f3f4f6", borderRadius: "100px", fontWeight: 600 }}>
                          {p.quantity} for Rs. {p.price}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: "12px", padding: "4px 8px", borderRadius: "12px", fontWeight: 600, background: b.isActive ? "#d1fae5" : "#fee2e2", color: b.isActive ? "#065f46" : "#991b1b" }}>
                      {b.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleOpenModal(b)} style={{ background: "rgba(59,130,246,0.1)", border: "none", borderRadius: "6px", padding: "6px", cursor: "pointer", color: "#3b82f6" }}>
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(b._id)} style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: "6px", padding: "6px", cursor: "pointer", color: "#ef4444" }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {bundles.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>No bundle offers created yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="admin-form-modal" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "32px 16px" }}>
          <div className="admin-form-content" style={{ background: "white", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "700px", position: "relative" }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "#f3f4f6", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={16} />
            </button>
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px", color: "#1f2937" }}>
              {editingBundle ? "Edit Pack Offers" : "Create Pack Offers"}
            </h2>
            <form onSubmit={handleSubmit} className="admin-product-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Select Product *</label>
                  <select 
                    required 
                    value={form.product} 
                    onChange={(e) => setForm({ ...form, product: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
                  >
                    <option value="">-- Choose a product --</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.name} (Rs. {p.price})</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 500 }}>
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} style={{ width: "18px", height: "18px", accentColor: "#ff6b00" }} />
                    Offers are Active
                  </label>
                </div>

                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ marginBottom: 0 }}>Pack Variations</label>
                    <button type="button" onClick={addPack} style={{ background: "#f3f4f6", border: "none", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Plus size={14} /> Add Pack
                    </button>
                  </div>
                  
                  {form.packs.map((pack, index) => (
                    <div key={index} style={{ display: "flex", gap: "12px", alignItems: "flex-end", marginBottom: "12px", background: "#f9fafb", padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}>Quantity</label>
                        <input type="number" required min="1" value={pack.quantity} onChange={(e) => updatePack(index, 'quantity', e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}>Total Price (Rs.)</label>
                        <input type="number" required min="0" value={pack.price} onChange={(e) => updatePack(index, 'price', e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <label style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}>Label (e.g. Best Seller)</label>
                        <input type="text" value={pack.label || ''} onChange={(e) => updatePack(index, 'label', e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Optional" />
                      </div>
                      <button type="button" onClick={() => removePack(index)} style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: "6px", width: "36px", height: "36px", cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {form.packs.length === 0 && (
                    <p style={{ fontSize: "13px", color: "#6b7280", textAlign: "center", padding: "12px", background: "#f9fafb", borderRadius: "8px" }}>No packs added. Add at least one.</p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ minWidth: "120px" }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ minWidth: "120px" }}>{editingBundle ? "Save Changes" : "Create Offers"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
