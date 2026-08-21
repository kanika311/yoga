"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function BlogForm({ id }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
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
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4">
      <label className="block text-sm">
        Title
        <input className="input mt-1" value={form.title} onChange={(e) => set("title", e.target.value)} required />
      </label>
      <label className="block text-sm">
        Slug
        <input className="input mt-1" value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          Category
          <input className="input mt-1" value={form.category} onChange={(e) => set("category", e.target.value)} />
        </label>
        <label className="block text-sm">
          Author
          <input className="input mt-1" value={form.author} onChange={(e) => set("author", e.target.value)} />
        </label>
      </div>
      <label className="block text-sm">
        Unsplash image URL
        <input className="input mt-1" value={form.image} onChange={(e) => set("image", e.target.value)} />
      </label>
      <label className="block text-sm">
        Excerpt
        <textarea className="input mt-1 min-h-24" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
      </label>
      <label className="block text-sm">
        Content
        <textarea className="input mt-1 min-h-56" value={form.content} onChange={(e) => set("content", e.target.value)} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
        Published
      </label>
      <button className="btn-gold" disabled={saving}>
        {saving ? "Saving…" : "Save article"}
      </button>
    </form>
  );
}
