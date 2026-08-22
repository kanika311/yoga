"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { api } from "@/lib/api";

export default function BlogForm({ id }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "Wellness",
    author: "MummaMove",
    published: true,
  });

  useEffect(() => {
    if (!id) return;
    api(`/api/blogs/id/${id}`).then((b) =>
      setForm({
        title: b.title || "",
        slug: b.slug || "",
        excerpt: b.excerpt || "",
        content: b.content || "",
        image: b.image || "",
        category: b.category || "Wellness",
        author: b.author || "MummaMove",
        published: b.published !== false,
      })
    );
  }, [id]);

  function set(k, v) {
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === "title" && !id) {
        next.slug = v
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }
      return next;
    });
  }

  async function handleFileUpload(file) {
    if (!file) return;
    try {
      setUploading(true);
      setUploadError("");
      const formData = new FormData();
      formData.append("image", file);
      const res = await api("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res?.url) {
        set("image", res.url);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploadError(err?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (id) await api(`/api/blogs/${id}`, { method: "PUT", body: JSON.stringify(form) });
      else await api("/api/blogs", { method: "POST", body: JSON.stringify(form) });
      router.push("/admin-yoga/blogs");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-5 rounded-3xl bg-white p-6 md:p-8 shadow-sm">
      <label className="block text-sm font-medium text-forest">
        Title
        <input className="input mt-1.5" value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="e.g. Benefits of Prenatal Yoga" />
      </label>

      <label className="block text-sm font-medium text-forest">
        Slug
        <input className="input mt-1.5" value={form.slug} onChange={(e) => set("slug", e.target.value)} required placeholder="e.g. benefits-of-prenatal-yoga" />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-forest">
          Category
          <input className="input mt-1.5" value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Wellness, Trimester 1, Nutrition" />
        </label>
        <label className="block text-sm font-medium text-forest">
          Author
          <input className="input mt-1.5" value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="e.g. MummaMove" />
        </label>
      </div>

      {/* ================= IMAGE UPLOAD SECTION ================= */}
      <div className="rounded-2xl border border-forest/10 bg-cream/30 p-4">
        <label className="block text-sm font-medium text-forest mb-2">
          Featured Image
        </label>

        {form.image ? (
          <div className="mb-4">
            <div className="relative h-48 w-full max-w-md overflow-hidden rounded-xl border border-forest/15 bg-cream">
              <Image
                src={form.image}
                alt="Blog preview"
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => set("image", "")}
                className="absolute right-2 top-2 rounded-full bg-forest-deep/80 p-1.5 text-white transition hover:bg-red-600"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
            <p className="mt-1 text-xs text-forest-leaf truncate max-w-md">{form.image}</p>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-mid disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload Image
              </>
            )}
          </button>

          <span className="text-xs text-forest-leaf">or enter image URL below</span>
        </div>

        {uploadError && (
          <p className="mt-2 text-xs text-red-600 font-medium">{uploadError}</p>
        )}

        <div className="mt-3">
          <input
            className="input text-sm"
            placeholder="https://images.unsplash.com/... or /uploads/..."
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
          />
        </div>
      </div>

      <label className="block text-sm font-medium text-forest">
        Excerpt / Summary
        <textarea className="input mt-1.5 min-h-24" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Short overview of the article..." />
      </label>

      <label className="block text-sm font-medium text-forest">
        Content
        <textarea className="input mt-1.5 min-h-56" value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="Write your article content here..." />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-forest cursor-pointer">
        <input type="checkbox" className="rounded" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
        Publish live on website
      </label>

      <div className="pt-2">
        <button className="btn-gold min-w-[160px]" disabled={saving || uploading}>
          {saving ? "Saving…" : id ? "Update article" : "Publish article"}
        </button>
      </div>
    </form>
  );
}
