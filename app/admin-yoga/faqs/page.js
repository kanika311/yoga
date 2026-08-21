"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function FaqsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ question: "", answer: "", category: "general" });

  function load() {
    api("/api/faqs?all=1").then(setItems);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e) {
    e.preventDefault();
    await api("/api/faqs", { method: "POST", body: JSON.stringify(form) });
    setForm({ question: "", answer: "", category: "general" });
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this FAQ?")) return;
    await api(`/api/faqs/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">FAQs</h1>
      <form onSubmit={add} className="mt-6 max-w-2xl space-y-3 rounded-3xl bg-white p-6">
        <input className="input" placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
        <textarea className="input min-h-24" placeholder="Answer" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required />
        <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <button className="btn-gold">Add FAQ</button>
      </form>
      <div className="mt-8 space-y-3">
        {items.map((f) => (
          <div key={f._id} className="rounded-2xl bg-white p-5">
            <div className="flex justify-between gap-3">
              <p className="font-serif text-xl text-forest">{f.question}</p>
              <button className="text-sm text-red-700" onClick={() => remove(f._id)}>
                Delete
              </button>
            </div>
            <p className="mt-2 text-sm text-forest-mid">{f.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
