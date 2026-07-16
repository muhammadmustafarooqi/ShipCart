"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/pages");
      const result = await res.json();
      if (result.success) {
        setPages(result.data);
      }
    } catch (error) {
      toast.error("Failed to load pages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const res = await fetch(`/api/pages/${slug}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast.success("Page deleted");
        fetchPages();
      } else {
        toast.error(result.message || "Failed to delete page");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading pages...</div>;
  }

  return (
    <div className="admin-page-container" style={{ maxWidth: "1450px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937", fontFamily: "Outfit, sans-serif" }}>Custom Pages</h1>
          <p style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>Manage informational and policy pages</p>
        </div>
        <Link href="/admin/pages/new" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <Plus size={18} /> Add New Page
        </Link>
      </div>

      {/* Pages Card Table */}
      <div style={{ background: "white", borderRadius: "16px", padding: "32px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                    No pages created yet. Click "Add New Page" to get started.
                  </td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr key={page._id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: "13px", color: "#1f2937" }}>{page.title}</div>
                    </td>
                    <td style={{ fontSize: "13px", color: "#9ca3af" }}>
                      /{page.slug}
                    </td>
                    <td>
                      {page.isActive ? (
                        <span className="status-badge status-delivered">
                          Active
                        </span>
                      ) : (
                        <span className="status-badge status-pending">
                          Draft
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}>
                        <Link
                          href={`/admin/pages/edit/${page.slug}`}
                          style={{ color: "#2563eb", display: "inline-flex", alignItems: "center" }}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(page._id)}
                          style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", padding: 0 }}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
