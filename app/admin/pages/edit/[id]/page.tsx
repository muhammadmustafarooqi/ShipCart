"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import RichTextEditor from "@/components/RichTextEditor";
import slugify from "slugify";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageId, setPageId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    isActive: true,
  });

  useEffect(() => {
    if (params.id) {
      fetchPage(params.id as string);
    }
  }, [params.id]);

  const fetchPage = async (slug: string) => {
    try {
      const res = await fetch(`/api/pages/${slug}`);
      const result = await res.json();
      if (result.success) {
        setFormData({
          title: result.data.title,
          slug: result.data.slug,
          content: result.data.content,
          isActive: result.data.isActive,
        });
        setPageId(result.data._id);
      } else {
        toast.error("Page not found");
        router.push("/admin/pages");
      }
    } catch (error) {
      toast.error("Failed to load page");
      router.push("/admin/pages");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: slugify(title, { lower: true, strict: true }),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      return toast.error("Please fill in all required fields.");
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Page updated successfully!");
        router.push("/admin/pages");
      } else {
        toast.error(result.message || "Failed to update page");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="admin-page-container" style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1f2937", fontFamily: "Outfit, sans-serif" }}>Edit Page</h1>
          <p style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>Modify page title, slug, or content settings</p>
        </div>
        <button
          onClick={() => router.push("/admin/pages")}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            background: "white",
            color: "#4b5563",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
      </div>

      {/* Form Container */}
      <div style={{ background: "white", borderRadius: "16px", padding: "32px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Page Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>URL Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>Page Content</label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", color: "#374151" }}>
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              style={{ width: "18px", height: "18px", accentColor: "#ff6b00", cursor: "pointer" }}
            />
            Publish Page (Active)
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", paddingTop: "24px", borderTop: "1px solid #f0f0f0" }}>
            <button
              type="button"
              onClick={() => router.push("/admin/pages")}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                background: "white",
                color: "#4b5563",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ minWidth: "120px", justifyContent: "center", opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
