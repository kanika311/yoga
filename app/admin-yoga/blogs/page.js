"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function BlogsAdmin() {
  const [items, setItems] = useState([]);

  function load() {
    api("/api/blogs?all=1").then(setItems).catch(() => setItems([]));
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    if (!confirm("Delete this article?")) return;
    await api(`/api/blogs/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl text-forest">Blogs</h1>
        <Link href="/admin-yoga/blogs/new" className="btn-gold">
          New article
        </Link>
      </div>
      <div className="mt-8 overflow-hidden rounded-3xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b._id} className="border-t border-forest/5">
                <td className="px-4 py-3">{b.title}</td>
                <td className="px-4 py-3">{b.published ? "Live" : "Draft"}</td>
                <td className="space-x-3 px-4 py-3 text-right">
                  <Link href={`/admin-yoga/blogs/${b._id}`} className="text-gold-deep">
                    Edit
                  </Link>
                  <button onClick={() => remove(b._id)} className="text-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
