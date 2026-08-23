"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    inquiries: 0,
    blogs: 0,
    programs: 0,
    faqs: 0,
    testimonials: 0,
    pendingReviews: 0,
  });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([
      api("/api/inquiries"),
      api("/api/blogs?all=1"),
      api("/api/programs?all=1"),
      api("/api/faqs?all=1"),
      api("/api/testimonials?all=1").catch(() => []),
    ])
      .then(([inquiries, blogs, programs, faqs, testimonials]) => {
        const testList = Array.isArray(testimonials) ? testimonials : [];
        const pendingCount = testList.filter(
          (t) => t.status === "pending" || (!t.published && t.status !== "rejected")
        ).length;

        setStats({
          inquiries: inquiries?.length || 0,
          blogs: blogs?.length || 0,
          programs: programs?.length || 0,
          faqs: faqs?.length || 0,
          testimonials: testList.length,
          pendingReviews: pendingCount,
        });
        setRecent(Array.isArray(inquiries) ? inquiries.slice(0, 6) : []);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Dashboard</h1>
      <p className="mt-1 text-sm text-forest-mid">Manage MummaMove content, inquiries and settings.</p>

      {stats.pendingReviews > 0 && (
        <Link
          href="/admin-yoga/testimonials"
          className="mt-6 flex items-center justify-between rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 transition hover:bg-amber-100"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-semibold">
              You have {stats.pendingReviews} new client {stats.pendingReviews === 1 ? "review" : "reviews"} pending approval!
            </span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 underline">
            Review Now →
          </span>
        </Link>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Inquiries", stats.inquiries, "/admin-yoga/inquiries"],
          ["Reviews", stats.testimonials, "/admin-yoga/testimonials"],
          ["Blogs", stats.blogs, "/admin-yoga/blogs"],
          ["Programs", stats.programs, "/admin-yoga/programs"],
          ["FAQs", stats.faqs, "/admin-yoga/faqs"],
        ].map(([l, n, href]) => (
          <Link key={l} href={href} className="rounded-3xl bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-xs uppercase tracking-[0.2em] text-gold-deep">{l}</p>
            <p className="mt-2 font-serif text-4xl text-forest">{n}</p>
          </Link>
        ))}
      </div>
      <h2 className="mt-12 font-serif text-2xl text-forest">Latest inquiries</h2>
      <div className="mt-4 overflow-hidden rounded-3xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-forest-mid">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((i) => (
              <tr key={i._id} className="border-t border-forest/5">
                <td className="px-4 py-3">{i.name}</td>
                <td className="px-4 py-3 capitalize">{i.type}</td>
                <td className="px-4 py-3">{i.program || "—"}</td>
                <td className="px-4 py-3">{i.status}</td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-forest-mid" colSpan={4}>
                  No inquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
