"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function InquiriesAdmin() {
  const [items, setItems] = useState([]);

  function load() {
    api("/api/inquiries").then(setItems);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status) {
    await api(`/api/inquiries/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this inquiry?")) return;
    await api(`/api/inquiries/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Inquiries & demos</h1>
      <div className="mt-8 space-y-4">
        {items.map((i) => (
          <div key={i._id} className="rounded-3xl bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-serif text-2xl text-forest">{i.name}</p>
                <p className="text-sm text-forest-mid">
                  {i.email} · {i.countryCode} {i.phone} · {i.timezone}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-gold-deep">
                  {i.type} · {i.program || "No program selected"}
                </p>
              </div>
              <div className="flex gap-2">
                <select className="input !w-auto" value={i.status} onChange={(e) => updateStatus(i._id, e.target.value)}>
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="scheduled">scheduled</option>
                  <option value="closed">closed</option>
                </select>
                <button className="text-sm text-red-700" onClick={() => remove(i._id)}>
                  Delete
                </button>
              </div>
            </div>
            {i.message && <p className="mt-3 text-sm text-forest-mid">{i.message}</p>}
          </div>
        ))}
        {items.length === 0 && <p className="text-forest-mid">No inquiries yet.</p>}
      </div>
    </div>
  );
}
