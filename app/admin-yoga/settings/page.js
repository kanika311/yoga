"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function SettingsAdmin() {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    api("/api/settings").then(setForm);
  }, []);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save(e) {
    e.preventDefault();
    await api("/api/settings", { method: "PUT", body: JSON.stringify(form) });
    setSaved("Saved");
    setTimeout(() => setSaved(""), 2000);
  }

  if (!form) return <p>Loading…</p>;

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Site settings</h1>
      <form onSubmit={save} className="mt-6 max-w-2xl space-y-3">
        {["siteName", "tagline", "email", "phone", "whatsapp", "address", "founderName", "hours"].map((k) => (
          <label key={k} className="block text-sm capitalize">
            {k}
            <input className="input mt-1" value={form[k] || ""} onChange={(e) => set(k, e.target.value)} />
          </label>
        ))}
        <label className="block text-sm">
          About
          <textarea className="input mt-1 min-h-28" value={form.about || ""} onChange={(e) => set("about", e.target.value)} />
        </label>
        <label className="block text-sm">
          Founder bio
          <textarea className="input mt-1 min-h-28" value={form.founderBio || ""} onChange={(e) => set("founderBio", e.target.value)} />
        </label>
        <label className="block text-sm">
          Founder image URL
          <input className="input mt-1" value={form.founderImage || ""} onChange={(e) => set("founderImage", e.target.value)} />
        </label>
        <button className="btn-gold">Save settings</button>
        {saved && <span className="ml-3 text-sm text-forest-leaf">{saved}</span>}
      </form>
    </div>
  );
}
