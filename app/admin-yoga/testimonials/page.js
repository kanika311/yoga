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

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Testimonials</h1>
      <form onSubmit={add} className="mt-6 max-w-2xl space-y-3 rounded-3xl bg-white p-6">
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Role / program" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        <textarea className="input min-h-24" placeholder="Quote" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required />
        <input className="input" placeholder="Unsplash portrait URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <button className="btn-gold">Add testimonial</button>
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
