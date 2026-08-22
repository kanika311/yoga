"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TestimonialsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", role: "", quote: "", image: "", country: "", rating: 5 });

  function load() {
    api("/api/testimonials?all=1").then(setItems);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e) {
    e.preventDefault();
    await api("/api/testimonials", { method: "POST", body: JSON.stringify(form) });
    setForm({ name: "", role: "", quote: "", image: "", country: "", rating: 5 });
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this testimonial?")) return;
    await api(`/api/testimonials/${id}`, { method: "DELETE" });
    load();
  }

  const [uploadingImg, setUploadingImg] = useState(false);

  async function handleTestimonialImageUpload(file) {
    if (!file) return;
    try {
      setUploadingImg(true);
      const formData = new FormData();
      formData.append("image", file);
      const res = await api("/api/upload", { method: "POST", body: formData });
      if (res?.url) {
        setForm((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err) {
      alert("Failed to upload image: " + (err?.message || ""));
    } finally {
      setUploadingImg(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Testimonials</h1>
      <form onSubmit={add} className="mt-6 max-w-2xl space-y-3 rounded-3xl bg-white p-6 md:p-8">
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Role / program (e.g. Prenatal Yoga Student)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        <textarea className="input min-h-24" placeholder="Quote / Review" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required />
        
        <div className="rounded-2xl border border-forest/10 bg-cream/30 p-4">
          <label className="block text-sm font-medium text-forest mb-2">Client Photo</label>
          {form.image && (
            <div className="mb-2">
              <img src={form.image} alt="" className="h-16 w-16 rounded-full object-cover" />
            </div>
          )}
          <div className="flex items-center gap-3">
            <label className="cursor-pointer rounded-xl bg-forest px-4 py-2 text-sm font-medium text-cream hover:bg-forest-mid">
              {uploadingImg ? "Uploading..." : "Upload Photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleTestimonialImageUpload(e.target.files[0])}
              />
            </label>
            <span className="text-xs text-forest-leaf">or paste photo URL below</span>
          </div>
          <input className="input mt-2 text-sm" placeholder="Portrait image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </div>

        <button className="btn-gold" disabled={uploadingImg}>Add testimonial</button>
      </form>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((t) => (
          <div key={t._id} className="rounded-3xl bg-white p-5">
            <p className="font-serif text-xl text-forest">“{t.quote}”</p>
            <p className="mt-3 text-sm text-forest-mid">
              {t.name} · {t.role}
            </p>
            <button className="mt-3 text-sm text-red-700" onClick={() => remove(t._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
