"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, X, Upload, Package, Star, Sparkles, Eye } from "lucide-react";
import { PRODUCT_CATEGORIES, PRODUCT_COLORS } from "@/lib/utils";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number;
  images: string[];
  previewVideoUrl?: string;
  category: string;
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  description: string;
  shortDescription: string;
  tags: string[];
  colors: string[];
}

const EMPTY_PRODUCT = {
  name: "",
  price: 0,
  comparePrice: 0,
  images: [] as string[],
  previewVideoUrl: "",
  category: "",
  stock: 10,
  isFeatured: false,
  isNewArrival: false,
  isActive: true,
  description: "",
  shortDescription: "",
  tags: [] as string[],
  colors: [] as string[],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products?limit=100");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openAddForm = () => {
    setEditingProduct(null);
    setForm(EMPTY_PRODUCT);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice || 0,
      images: product.images,
      previewVideoUrl: product.previewVideoUrl || "",
      category: product.category,
      stock: product.stock,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isActive: product.isActive,
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      tags: product.tags || [],
      colors: product.colors || [],
    });
    setShowForm(true);
  };

  const handleAddImage = () => {
    if (imageUrl.trim() && !form.images.includes(imageUrl.trim())) {
      setForm((f) => ({ ...f, images: [...f.images, imageUrl.trim()] }));
      setImageUrl("");
    }
  };

  const handleRemoveImage = (url: string) => {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const handleAddColor = () => {
    if (colorInput.trim() && !form.colors.includes(colorInput.trim())) {
      setForm((f) => ({ ...f, colors: [...f.colors, colorInput.trim()] }));
      setColorInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || form.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to update");
        toast.success("Product updated!");
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to create");
        toast.success("Product created!");
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      fetchProducts();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937" }}>Products</h1>
          <p style={{ color: "#6b7280", marginTop: "4px" }}>{products.length} products total</p>
        </div>
        <button onClick={openAddForm} className="btn-primary">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Products Table */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
          <div className="spinner" />
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Flags</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div style={{ width: "52px", height: "52px", borderRadius: "8px", overflow: "hidden", background: "#f5f5f5" }}>
                      {product.images[0] ? (
                        <Image src={product.images[0]} alt={product.name} width={52} height={52} style={{ width: "100%", height: "100%", objectFit: "cover" }} unoptimized />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                          <Package size={22} strokeWidth={2} aria-hidden />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: "13px", maxWidth: "200px" }}>{product.name}</div>
                    <div style={{ fontSize: "11px", color: "#9ca3af" }}>{product.slug}</div>
                  </td>
                  <td style={{ fontSize: "13px" }}>{product.category}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#ff6b00", fontSize: "13px" }}>Rs. {product.price.toLocaleString()}</div>
                    {product.comparePrice > 0 && (
                      <div style={{ fontSize: "11px", color: "#9ca3af", textDecoration: "line-through" }}>Rs. {product.comparePrice.toLocaleString()}</div>
                    )}
                  </td>
                  <td style={{ fontSize: "13px", fontWeight: product.stock <= 5 ? 700 : 400, color: product.stock <= 5 ? "#ef4444" : "#374151" }}>
                    {product.stock}
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {product.isFeatured && (
                        <span style={{ fontSize: "11px", background: "rgba(255,107,0,0.1)", color: "#ff6b00", padding: "2px 8px", borderRadius: "4px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Star size={12} aria-hidden /> Featured
                        </span>
                      )}
                      {product.isNewArrival && (
                        <span style={{ fontSize: "11px", background: "#d1fae5", color: "#065f46", padding: "2px 8px", borderRadius: "4px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Sparkles size={12} aria-hidden /> New
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button onClick={() => handleToggleActive(product)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                      {product.isActive ? <ToggleRight size={28} style={{ color: "#10b981" }} /> : <ToggleLeft size={28} style={{ color: "#9ca3af" }} />}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => openEditForm(product)} style={{ background: "rgba(59,130,246,0.1)", border: "none", borderRadius: "6px", padding: "6px", cursor: "pointer", color: "#3b82f6" }}>
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleDelete(product._id)} style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: "6px", padding: "6px", cursor: "pointer", color: "#ef4444" }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="admin-form-modal" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "32px 16px" }}>
          <div className="admin-form-content" style={{ background: "white", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "700px", position: "relative" }}>
            <button onClick={() => setShowForm(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "#f3f4f6", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={16} />
            </button>

            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px", color: "#1f2937" }}>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="admin-product-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ gridColumn: "1/-1" }}>
                  <label>Product Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Rechargeable Coffee Beater" required />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} required>
                    <option value="">Select Category</option>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: parseInt(e.target.value) || 0 }))} min={0} />
                </div>

                <div className="form-group">
                  <label>Price (PKR) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))} min={0} required />
                </div>

                <div className="form-group">
                  <label>Compare Price (PKR)</label>
                  <input type="number" value={form.comparePrice} onChange={(e) => setForm((f) => ({ ...f, comparePrice: parseFloat(e.target.value) || 0 }))} min={0} placeholder="Original price for discount" />
                </div>

                <div className="form-group" style={{ gridColumn: "1/-1" }}>
                  <label>Short Description</label>
                  <input type="text" value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} placeholder="Brief one-line description" />
                </div>

                <div className="form-group" style={{ gridColumn: "1/-1" }}>
                  <label>Full Description</label>
                  <textarea rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Detailed product description" />
                </div>

                {/* Images */}
                <div className="form-group" style={{ gridColumn: "1/-1" }}>
                  <label>Product Images (URLs)</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" style={{ flex: 1, padding: "10px 14px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} />
                    <button type="button" onClick={handleAddImage} className="btn-primary" style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                      <Upload size={14} /> Add
                    </button>
                  </div>
                  {form.images.length > 0 && (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {form.images.map((img, i) => (
                        <div key={i} style={{ position: "relative", width: "70px", height: "70px" }}>
                          <Image src={img} alt="" width={70} height={70} style={{ borderRadius: "8px", objectFit: "cover", width: "100%", height: "100%" }} unoptimized />
                          <button type="button" onClick={() => handleRemoveImage(img)} style={{ position: "absolute", top: "-4px", right: "-4px", background: "#ef4444", border: "none", borderRadius: "50%", width: "18px", height: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <X size={10} style={{ color: "white" }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ gridColumn: "1/-1" }}>
                  <label>Card hover preview video (optional URL)</label>
                  <input
                    type="url"
                    value={form.previewVideoUrl}
                    onChange={(e) => setForm((f) => ({ ...f, previewVideoUrl: e.target.value }))}
                    placeholder="https://…/clip.mp4 — plays on hover (max ~5s), muted"
                    style={{ width: "100%", padding: "10px 14px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }}
                  />
                  <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
                    If set, this overrides image carousel on hover. Leave empty to cycle product images instead.
                  </p>
                </div>

                {/* Tags */}
                <div className="form-group" style={{ gridColumn: "1/-1" }}>
                  <label>Tags</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())} placeholder="Add a tag and press Enter" style={{ flex: 1, padding: "10px 14px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} />
                    <button type="button" onClick={handleAddTag} className="btn-secondary" style={{ padding: "10px 14px" }}>Add</button>
                  </div>
                  {form.tags.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {form.tags.map((tag) => (
                        <span key={tag} style={{ background: "#fff3e8", color: "#ff6b00", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 500, display: "flex", alignItems: "center", gap: "6px" }}>
                          {tag}
                          <button type="button" onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))} style={{ background: "none", border: "none", cursor: "pointer", color: "#ff6b00", display: "flex" }}>
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Colors */}
                <div className="form-group" style={{ gridColumn: "1/-1" }}>
                  <label>Available Colors</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <select 
                      value="" 
                      onChange={(e) => {
                        if (e.target.value && !form.colors.includes(e.target.value)) {
                          setForm((f) => ({ ...f, colors: [...f.colors, e.target.value] }));
                        }
                      }}
                      style={{ flex: 1, padding: "10px 14px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}
                    >
                      <option value="">Select a color to add</option>
                      {PRODUCT_COLORS.map((color) => (
                        <option key={color} value={color} disabled={form.colors.includes(color)}>{color}</option>
                      ))}
                    </select>
                    <input 
                      value={colorInput} 
                      onChange={(e) => setColorInput(e.target.value)} 
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddColor())} 
                      placeholder="Or type custom color" 
                      style={{ flex: 1, padding: "10px 14px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} 
                    />
                    <button type="button" onClick={handleAddColor} className="btn-secondary" style={{ padding: "10px 14px" }}>Add</button>
                  </div>
                  {form.colors.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {form.colors.map((color) => (
                        <span key={color} style={{ background: "#e0e7ff", color: "#4338ca", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                          {color}
                          <button type="button" onClick={() => setForm((f) => ({ ...f, colors: f.colors.filter((c) => c !== color) }))} style={{ background: "none", border: "none", cursor: "pointer", color: "#4338ca", display: "flex" }}>
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Toggles */}
                <div className="form-group" style={{ gridColumn: "1/-1" }}>
                  <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                    {[
                      { key: "isFeatured", label: "Featured product", Icon: Star },
                      { key: "isNewArrival", label: "New arrival", Icon: Sparkles },
                      { key: "isActive", label: "Active (visible)", Icon: Eye },
                    ].map(({ key, label, Icon }) => (
                      <label key={key} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 500, fontSize: "14px" }}>
                        <Icon size={16} style={{ color: "#6b7280", flexShrink: 0 }} aria-hidden />
                        <input
                          type="checkbox"
                          checked={form[key as keyof typeof form] as boolean}
                          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                          style={{ width: "18px", height: "18px", accentColor: "#ff6b00" }}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px", flexWrap: "wrap" }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ flex: "1 1 auto", minWidth: "120px" }}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: "1 1 auto", minWidth: "120px" }}>
                  {submitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
