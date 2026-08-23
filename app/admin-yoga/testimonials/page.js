/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
  Clock,
  Eye,
  EyeOff,
  Upload,
  Edit2,
  X,
  AlertTriangle,
} from "lucide-react";
import { api } from "@/lib/api";

export default function TestimonialsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // Default to pending so admin immediately sees new reviews
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    quote: "",
    image: "",
    country: "",
    email: "",
    rating: 5,
    published: true,
    status: "approved",
  });

  const [uploadingImg, setUploadingImg] = useState(false);

  function load() {
    setLoading(true);
    api("/api/testimonials?all=1")
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load testimonials:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  // Compute status counts
  const pendingItems = items.filter(
    (t) => t.status === "pending" || (!t.published && t.status !== "rejected")
  );
  const approvedItems = items.filter(
    (t) => t.published === true && t.status !== "rejected"
  );
  const rejectedItems = items.filter((t) => t.status === "rejected");

  // Determine items to show based on active tab
  const filteredItems = items.filter((t) => {
    if (activeTab === "pending") {
      return t.status === "pending" || (!t.published && t.status !== "rejected");
    }
    if (activeTab === "approved") {
      return t.published === true && t.status !== "rejected";
    }
    if (activeTab === "rejected") {
      return t.status === "rejected";
    }
    return true; // "all"
  });

  async function handleApprove(id) {
    try {
      await api(`/api/testimonials/${id}`, {
        method: "PUT",
        body: JSON.stringify({ published: true, status: "approved" }),
      });
      load();
    } catch (err) {
      alert("Failed to approve review: " + (err?.message || ""));
    }
  }

  async function handleReject(id) {
    try {
      await api(`/api/testimonials/${id}`, {
        method: "PUT",
        body: JSON.stringify({ published: false, status: "rejected" }),
      });
      load();
    } catch (err) {
      alert("Failed to reject review: " + (err?.message || ""));
    }
  }

  async function handleUnpublish(id) {
    try {
      await api(`/api/testimonials/${id}`, {
        method: "PUT",
        body: JSON.stringify({ published: false }),
      });
      load();
    } catch (err) {
      alert("Failed to unpublish review: " + (err?.message || ""));
    }
  }

  async function remove(id) {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      await api(`/api/testimonials/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      alert("Failed to delete review: " + (err?.message || ""));
    }
  }

  async function handleTestimonialImageUpload(file, isEdit = false) {
    if (!file) return;
    try {
      setUploadingImg(true);
      const formData = new FormData();
      formData.append("image", file);
      const res = await api("/api/upload", { method: "POST", body: formData });
      if (res?.url) {
        if (isEdit) {
          setEditingItem((prev) => ({ ...prev, image: res.url }));
        } else {
          setForm((prev) => ({ ...prev, image: res.url }));
        }
      }
    } catch (err) {
      alert("Failed to upload image: " + (err?.message || ""));
    } finally {
      setUploadingImg(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    try {
      await api("/api/testimonials", {
        method: "POST",
        body: JSON.stringify({ ...form, published: true, status: "approved" }),
      });
      setForm({
        name: "",
        role: "",
        quote: "",
        image: "",
        country: "",
        email: "",
        rating: 5,
        published: true,
        status: "approved",
      });
      setShowAddForm(false);
      load();
    } catch (err) {
      alert("Failed to add testimonial: " + (err?.message || ""));
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await api(`/api/testimonials/${editingItem._id}`, {
        method: "PUT",
        body: JSON.stringify(editingItem),
      });
      setEditingItem(null);
      load();
    } catch (err) {
      alert("Failed to update testimonial: " + (err?.message || ""));
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl text-forest">Testimonials & Reviews</h1>
          <p className="mt-1 text-sm text-forest-mid">
            Review and moderate client submissions from the website before making them live.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-gold flex items-center gap-2 self-start sm:self-auto"
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? "Close Form" : "Add Testimonial"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <button
          onClick={() => setActiveTab("pending")}
          className={`rounded-2xl p-4 text-left transition-all border ${
            activeTab === "pending"
              ? "bg-amber-500/10 border-amber-500/40 ring-2 ring-amber-500/20"
              : "bg-white border-forest/10 hover:border-amber-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Pending Approval
            </span>
            <Clock size={16} className="text-amber-600" />
          </div>
          <p className="mt-2 font-serif text-3xl text-amber-900 font-bold">
            {pendingItems.length}
          </p>
          <p className="text-[11px] text-amber-700/80 mt-0.5">Needs admin action</p>
        </button>

        <button
          onClick={() => setActiveTab("approved")}
          className={`rounded-2xl p-4 text-left transition-all border ${
            activeTab === "approved"
              ? "bg-emerald-500/10 border-emerald-500/40 ring-2 ring-emerald-500/20"
              : "bg-white border-forest/10 hover:border-emerald-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Live / Approved
            </span>
            <CheckCircle size={16} className="text-emerald-600" />
          </div>
          <p className="mt-2 font-serif text-3xl text-emerald-900 font-bold">
            {approvedItems.length}
          </p>
          <p className="text-[11px] text-emerald-700/80 mt-0.5">Showing on website</p>
        </button>

        <button
          onClick={() => setActiveTab("rejected")}
          className={`rounded-2xl p-4 text-left transition-all border ${
            activeTab === "rejected"
              ? "bg-red-500/10 border-red-500/40 ring-2 ring-red-500/20"
              : "bg-white border-forest/10 hover:border-red-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-700">
              Rejected / Hidden
            </span>
            <XCircle size={16} className="text-red-600" />
          </div>
          <p className="mt-2 font-serif text-3xl text-red-900 font-bold">
            {rejectedItems.length}
          </p>
          <p className="text-[11px] text-red-700/80 mt-0.5">Not visible</p>
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`rounded-2xl p-4 text-left transition-all border ${
            activeTab === "all"
              ? "bg-forest/10 border-forest/40 ring-2 ring-forest/20"
              : "bg-white border-forest/10 hover:border-forest/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-forest-mid">
              Total Reviews
            </span>
            <Star size={16} className="text-gold-deep" />
          </div>
          <p className="mt-2 font-serif text-3xl text-forest font-bold">
            {items.length}
          </p>
          <p className="text-[11px] text-forest-leaf mt-0.5">All submissions</p>
        </button>
      </div>

      {/* Add Testimonial Form Drawer / Accordion */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="mt-6 max-w-3xl space-y-4 rounded-3xl border border-forest/10 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="flex items-center justify-between border-b border-forest/10 pb-3">
            <h3 className="font-serif text-xl text-forest">Add Direct Testimonial</h3>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Auto-approved for website
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">
                Client Name *
              </label>
              <input
                className="input"
                placeholder="e.g. Priya Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">
                Role / Program (e.g. Prenatal Yoga Student)
              </label>
              <input
                className="input"
                placeholder="e.g. Prenatal Yoga, 3rd Trimester"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">
                Country / Location
              </label>
              <input
                className="input"
                placeholder="e.g. UAE / London, UK / Mumbai"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">
                Rating (1 - 5 Stars)
              </label>
              <select
                className="input bg-white"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              >
                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                <option value={3}>⭐⭐⭐ 3 Stars</option>
                <option value={2}>⭐⭐ 2 Stars</option>
                <option value={1}>⭐ 1 Star</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-forest mb-1">
              Review Quote *
            </label>
            <textarea
              className="input min-h-24"
              placeholder="Quote / Review text..."
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              required
            />
          </div>

          <div className="rounded-2xl border border-forest/10 bg-cream/30 p-4">
            <label className="block text-sm font-medium text-forest mb-2">
              Client Photo
            </label>
            {form.image && (
              <div className="mb-3 flex items-center gap-3">
                <img
                  src={form.image}
                  alt=""
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-gold"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: "" })}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove photo
                </button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-forest px-4 py-2 text-sm font-medium text-cream hover:bg-forest-mid">
                <Upload size={14} />
                {uploadingImg ? "Uploading..." : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleTestimonialImageUpload(e.target.files[0], false)
                  }
                />
              </label>
              <span className="text-xs text-forest-leaf">or paste photo URL below</span>
            </div>
            <input
              className="input mt-2 text-sm"
              placeholder="Portrait image URL (optional)"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm text-forest-mid hover:text-forest"
            >
              Cancel
            </button>
            <button className="btn-gold" disabled={uploadingImg}>
              Add & Publish Testimonial
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="mt-8 flex gap-2 border-b border-forest/10 pb-3">
        {[
          { id: "pending", label: "Pending Approval", count: pendingItems.length, highlight: pendingItems.length > 0 },
          { id: "approved", label: "Approved (Live)", count: approvedItems.length },
          { id: "rejected", label: "Rejected", count: rejectedItems.length },
          { id: "all", label: "All Reviews", count: items.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-forest text-cream shadow-xs"
                : "text-forest-mid hover:bg-forest/5"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === tab.id
                  ? "bg-white/20 text-cream"
                  : tab.highlight
                  ? "bg-amber-500 text-white font-bold"
                  : "bg-forest/10 text-forest-mid"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="py-12 text-center text-forest-mid">Loading testimonials...</div>
      ) : filteredItems.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-forest/20 bg-white p-12 text-center">
          <p className="font-serif text-xl text-forest">No reviews found in this category</p>
          <p className="mt-1 text-sm text-forest-mid">
            {activeTab === "pending"
              ? "All submitted reviews have been moderated! Great job."
              : "No reviews match this filter."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {filteredItems.map((t) => {
            const isPending =
              t.status === "pending" || (!t.published && t.status !== "rejected");
            const isApproved = t.published === true && t.status !== "rejected";
            const isRejected = t.status === "rejected";

            return (
              <div
                key={t._id}
                className={`relative flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-xs transition-all ${
                  isPending
                    ? "border-amber-400 bg-amber-50/20"
                    : isRejected
                    ? "border-red-200 bg-red-50/10 opacity-80"
                    : "border-forest/10 hover:border-forest/20"
                }`}
              >
                <div>
                  {/* Status Banner */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex gap-1 text-gold">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} size={15} fill="currentColor" />
                      ))}
                    </div>

                    {isPending && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                        <Clock size={12} /> Pending Approval
                      </span>
                    )}
                    {isApproved && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                        <CheckCircle size={12} /> Live on Website
                      </span>
                    )}
                    {isRejected && (
                      <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                        <XCircle size={12} /> Rejected / Hidden
                      </span>
                    )}
                  </div>

                  {/* Quote */}
                  <p className="font-serif text-lg leading-relaxed text-forest">
                    “{t.quote}”
                  </p>

                  {/* Author Meta */}
                  <div className="mt-4 flex items-center gap-3 border-t border-forest/5 pt-3">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-gold"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-serif font-bold text-cream">
                        {t.name?.charAt(0)?.toUpperCase() || "M"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-forest">
                        {t.name}
                      </p>
                      <p className="truncate text-xs text-forest-mid">
                        {t.role || "MummaMove Client"}
                        {t.country ? ` · ${t.country}` : ""}
                      </p>
                      {t.email && (
                        <p className="truncate text-[11px] text-forest-leaf">
                          ✉️ {t.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-forest/10 pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Approve Button */}
                    {!isApproved && (
                      <button
                        onClick={() => handleApprove(t._id)}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
                      >
                        <CheckCircle size={14} />
                        Approve & Publish
                      </button>
                    )}

                    {/* Reject Button */}
                    {!isRejected && (
                      <button
                        onClick={() => handleReject(t._id)}
                        className="flex items-center gap-1.5 rounded-xl bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-200"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    )}

                    {/* Unpublish Button */}
                    {isApproved && (
                      <button
                        onClick={() => handleUnpublish(t._id)}
                        className="flex items-center gap-1.5 rounded-xl bg-forest/10 px-3 py-1.5 text-xs font-medium text-forest-mid transition hover:bg-forest/20"
                      >
                        <EyeOff size={14} />
                        Unpublish
                      </button>
                    )}

                    {/* Edit Button */}
                    <button
                      onClick={() => setEditingItem(t)}
                      className="flex items-center gap-1 rounded-xl bg-cream px-2.5 py-1.5 text-xs font-medium text-forest-mid transition hover:bg-forest/10"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => remove(t._id)}
                    className="p-1.5 text-forest-leaf transition hover:text-red-600"
                    title="Delete permanently"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Testimonial Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div
            className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-forest/10 pb-3">
              <h3 className="font-serif text-2xl text-forest">Edit Testimonial</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="rounded-full p-1 text-forest-mid hover:bg-cream"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">
                    Client Name
                  </label>
                  <input
                    className="input text-sm"
                    value={editingItem.name || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">
                    Role / Program
                  </label>
                  <input
                    className="input text-sm"
                    value={editingItem.role || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, role: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">
                    Country / Location
                  </label>
                  <input
                    className="input text-sm"
                    value={editingItem.country || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, country: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">
                    Rating (1-5)
                  </label>
                  <select
                    className="input text-sm bg-white"
                    value={editingItem.rating || 5}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        rating: Number(e.target.value),
                      })
                    }
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                    <option value={3}>⭐⭐⭐ 3 Stars</option>
                    <option value={2}>⭐⭐ 2 Stars</option>
                    <option value={1}>⭐ 1 Star</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest mb-1">
                  Quote / Review
                </label>
                <textarea
                  className="input min-h-[90px] text-sm"
                  value={editingItem.quote || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, quote: e.target.value })
                  }
                  required
                />
              </div>

              {/* Status Selector */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">
                    Moderation Status
                  </label>
                  <select
                    className="input text-sm bg-white"
                    value={editingItem.status || (editingItem.published ? "approved" : "pending")}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setEditingItem({
                        ...editingItem,
                        status: newStatus,
                        published: newStatus === "approved",
                      });
                    }}
                  >
                    <option value="approved">Approved & Live</option>
                    <option value="pending">Pending Review</option>
                    <option value="rejected">Rejected / Hidden</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">
                    Live On Website
                  </label>
                  <select
                    className="input text-sm bg-white"
                    value={editingItem.published ? "yes" : "no"}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        published: e.target.value === "yes",
                      })
                    }
                  >
                    <option value="yes">Yes (Visible)</option>
                    <option value="no">No (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Client Photo */}
              <div className="rounded-xl border border-forest/10 bg-cream/30 p-3">
                <label className="block text-xs font-semibold text-forest mb-1.5">
                  Client Photo
                </label>
                {editingItem.image && (
                  <div className="mb-2 flex items-center gap-3">
                    <img
                      src={editingItem.image}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-gold"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditingItem({ ...editingItem, image: "" })
                      }
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-forest px-3 py-1.5 text-xs text-cream hover:bg-forest-mid">
                    <Upload size={12} />
                    {uploadingImg ? "Uploading..." : "Upload New"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleTestimonialImageUpload(e.target.files[0], true)
                      }
                    />
                  </label>
                  <input
                    className="input flex-1 text-xs"
                    placeholder="Photo URL"
                    value={editingItem.image || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, image: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-medium text-forest-mid hover:text-forest"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold text-xs">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

