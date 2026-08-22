"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ProgramsAdmin() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);

  function load() {
    api("/api/programs?all=1").then(setItems);
  }

  useEffect(() => {
    load();
  }, []);

  function start(item) {
    setActive({
      ...item,
      highlights: (item.highlights || []).join("\n"),
      benefits: (item.benefits || []).join("\n"),
      focusAreas: (item.focusAreas || []).join("\n"),
    });
  }

  async function save(e) {
    e.preventDefault();
    const payload = {
      ...active,
      highlights: active.highlights.split("\n").filter(Boolean),
      benefits: active.benefits.split("\n").filter(Boolean),
      focusAreas: active.focusAreas.split("\n").filter(Boolean),
    };
    await api(`/api/programs/${active._id}`, { method: "PUT", body: JSON.stringify(payload) });
    setActive(null);
    load();
  }

  const [uploadingImg, setUploadingImg] = useState(false);

  async function handleProgramImageUpload(file) {
    if (!file) return;
    try {
      setUploadingImg(true);
      const formData = new FormData();
      formData.append("image", file);
      const res = await api("/api/upload", { method: "POST", body: formData });
      if (res?.url) {
        setActive((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err) {
      alert("Failed to upload image: " + (err?.message || ""));
    } finally {
      setUploadingImg(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Programs</h1>
      <p className="mt-1 text-sm text-forest-mid">Edit prenatal, fertility and postnatal program copy and images.</p>
      <div className="mt-8 grid gap-4">
        {items.map((p) => (
          <div key={p._id} className="flex items-center justify-between rounded-3xl bg-white p-5">
            <div>
              <p className="font-serif text-2xl text-forest">{p.title}</p>
              <p className="text-sm text-forest-mid">/{p.slug}</p>
            </div>
            <button className="btn-forest" onClick={() => start(p)}>
              Edit
            </button>
          </div>
        ))}
      </div>

      {active && (
        <form onSubmit={save} className="mt-8 max-w-3xl space-y-4 rounded-3xl bg-white p-6 md:p-8">
          <h2 className="font-serif text-2xl">Edit {active.title}</h2>
          {["title", "subtitle", "slug"].map((k) => (
            <label key={k} className="block text-sm capitalize font-medium text-forest">
              {k}
              <input className="input mt-1.5" value={active[k] || ""} onChange={(e) => setActive({ ...active, [k]: e.target.value })} />
            </label>
          ))}

          <div className="rounded-2xl border border-forest/10 bg-cream/30 p-4">
            <label className="block text-sm font-medium text-forest mb-2">Program Image</label>
            {active.image && (
              <div className="mb-3">
                <img src={active.image} alt="" className="h-36 w-auto max-w-full rounded-xl object-cover" />
              </div>
            )}
            <div className="flex items-center gap-3">
              <label className="cursor-pointer rounded-xl bg-forest px-4 py-2 text-sm font-medium text-cream hover:bg-forest-mid">
                {uploadingImg ? "Uploading..." : "Upload Program Image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleProgramImageUpload(e.target.files[0])}
                />
              </label>
              <span className="text-xs text-forest-leaf">or paste image URL</span>
            </div>
            <input
              className="input mt-2 text-sm"
              placeholder="Image URL"
              value={active.image || ""}
              onChange={(e) => setActive({ ...active, image: e.target.value })}
            />
          </div>

          <label className="block text-sm font-medium text-forest">
            Excerpt
            <textarea className="input mt-1.5 min-h-20" value={active.excerpt || ""} onChange={(e) => setActive({ ...active, excerpt: e.target.value })} />
          </label>
          <label className="block text-sm">
            Description
            <textarea className="input mt-1 min-h-28" value={active.description || ""} onChange={(e) => setActive({ ...active, description: e.target.value })} />
          </label>
          {["highlights", "benefits", "focusAreas"].map((k) => (
            <label key={k} className="block text-sm">
              {k} (one per line)
              <textarea className="input mt-1 min-h-28" value={active[k]} onChange={(e) => setActive({ ...active, [k]: e.target.value })} />
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={active.published !== false} onChange={(e) => setActive({ ...active, published: e.target.checked })} />
            Published
          </label>
          <div className="flex gap-3">
            <button className="btn-gold">Save</button>
            <button type="button" className="btn-outline !text-forest !border-forest/20" onClick={() => setActive(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
