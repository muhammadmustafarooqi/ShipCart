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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Page</h1>
        <button
          onClick={() => router.push("/admin/pages")}
          className="text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--orange)] focus:border-[var(--orange)] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--orange)] focus:border-[var(--orange)] outline-none"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Content
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        </div>

        <div className="mb-8 flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-5 h-5 text-[var(--orange)] rounded border-gray-300 focus:ring-[var(--orange)]"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Publish Page (Active)
          </label>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="bg-[var(--orange)] text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
