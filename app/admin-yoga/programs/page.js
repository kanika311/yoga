/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  ExternalLink,
  X,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import { api } from "@/lib/api";

const initialForm = {
  title: "",
  slug: "",
  subtitle: "",
  excerpt: "",
  description: "",
  image: "",
  highlights: "",
  benefits: "",
  focusAreas: "",
  published: true,
  order: 0,
};

export default function ProgramsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null); // for editing
  const [showAdd, setShowAdd] = useState(false); // for adding new program
  const [newProgram, setNewProgram] = useState(initialForm);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  function load() {
    setLoading(true);
    api("/api/programs?all=1")
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load programs:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item) {
    setShowAdd(false);
    setActive({
      ...item,
      highlights: Array.isArray(item.highlights) ? item.highlights.join("\n") : (item.highlights || ""),
      benefits: Array.isArray(item.benefits) ? item.benefits.join("\n") : (item.benefits || ""),
      focusAreas: Array.isArray(item.focusAreas) ? item.focusAreas.join("\n") : (item.focusAreas || ""),
      order: item.order !== undefined ? item.order : 0,
    });
  }

  // Auto-generate slug from title for new program
  function handleNewTitleChange(val) {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setNewProgram((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === "" || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
    }));
  }

  // --------------------------------------------------------------------------
  // Reorder Handlers (Move Up / Move Down)
  // --------------------------------------------------------------------------
  async function handleMove(index, direction) {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Optimistically update local state
    setItems(reordered);
    setReordering(true);

    try {
      const payload = reordered.map((prog, idx) => ({
        id: prog._id,
        order: idx,
      }));

      await api("/api/programs/reorder", {
        method: "PUT",
        body: JSON.stringify({ items: payload }),
      });

      setSuccessMsg("Program display order updated on website!");
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch (err) {
      console.error("Reorder failed:", err);
      alert("Failed to save order: " + (err?.message || ""));
      load(); // rollback
    } finally {
      setReordering(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newProgram.title.trim()) {
      alert("Please enter program title.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...newProgram,
        order: Number(newProgram.order) || items.length,
        highlights: newProgram.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
        benefits: newProgram.benefits.split("\n").map((s) => s.trim()).filter(Boolean),
        focusAreas: newProgram.focusAreas.split("\n").map((s) => s.trim()).filter(Boolean),
      };

      const res = await api("/api/programs", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccessMsg(`Program "${res.title}" created successfully and is live on the website!`);
      setNewProgram(initialForm);
      setShowAdd(false);
      load();

      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (err) {
      alert("Failed to create program: " + (err?.message || ""));
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!active) return;

    try {
      setSaving(true);
      const payload = {
        ...active,
        order: Number(active.order) || 0,
        highlights: active.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
        benefits: active.benefits.split("\n").map((s) => s.trim()).filter(Boolean),
        focusAreas: active.focusAreas.split("\n").map((s) => s.trim()).filter(Boolean),
      };

      await api(`/api/programs/${active._id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setSuccessMsg(`Program "${active.title}" updated successfully!`);
      setActive(null);
      load();

      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (err) {
      alert("Failed to update program: " + (err?.message || ""));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, title) {
    if (!confirm(`Are you sure you want to delete "${title}"? This will remove it from the website.`)) {
      return;
    }

    try {
      await api(`/api/programs/${id}`, { method: "DELETE" });
      setSuccessMsg(`Program "${title}" deleted.`);
      load();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Failed to delete program: " + (err?.message || ""));
    }
  }

  async function handleProgramImageUpload(file, isEdit = false) {
    if (!file) return;
    try {
      setUploadingImg(true);
      const formData = new FormData();
      formData.append("image", file);
      const res = await api("/api/upload", { method: "POST", body: formData });
      if (res?.url) {
        if (isEdit) {
          setActive((prev) => ({ ...prev, image: res.url }));
        } else {
          setNewProgram((prev) => ({ ...prev, image: res.url }));
        }
      }
    } catch (err) {
      alert("Failed to upload image: " + (err?.message || ""));
    } finally {
      setUploadingImg(false);
    }
  }

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl text-forest">Programs</h1>
          <p className="mt-1 text-sm text-forest-mid">
            Manage, add new programs, and reorder how they appear on the homepage and navigation menu.
          </p>
        </div>

        <button
          onClick={() => {
            setActive(null);
            setShowAdd(!showAdd);
          }}
          className="btn-gold flex items-center gap-2 self-start sm:self-auto"
        >
          {showAdd ? <X size={16} /> : <Plus size={16} />}
          {showAdd ? "Close Form" : "Add New Program"}
        </button>
      </div>

      {successMsg && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 animate-in fade-in duration-150">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* =========================================================================
          ADD NEW PROGRAM FORM
      ========================================================================= */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="mt-6 max-w-4xl space-y-5 rounded-3xl border border-forest/15 bg-white p-6 shadow-md md:p-8 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-forest/10 pb-4">
            <h2 className="font-serif text-2xl text-forest">Create New Yoga Program</h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Will appear on Homepage & Menu
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                Program Title *
              </label>
              <input
                className="input w-full"
                placeholder="e.g. Garbha Sanskar & Meditation"
                value={newProgram.title}
                onChange={(e) => handleNewTitleChange(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                URL Slug (/yoga/slug) *
              </label>
              <input
                className="input w-full"
                placeholder="e.g. garbha-sanskar"
                value={newProgram.slug}
                onChange={(e) =>
                  setNewProgram({
                    ...newProgram,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
                  })
                }
                required
              />
              <span className="text-[11px] text-forest-leaf mt-1 block">
                Website link will be: <strong>/yoga/{newProgram.slug || "slug"}</strong>
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                Subtitle / Tagline
              </label>
              <input
                className="input w-full"
                placeholder="e.g. Ancient Vedic wisdom, mindful bonding, and meditation for pregnancy"
                value={newProgram.subtitle}
                onChange={(e) => setNewProgram({ ...newProgram, subtitle: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                Display Order Priority
              </label>
              <input
                type="number"
                className="input w-full"
                placeholder="0"
                value={newProgram.order}
                onChange={(e) => setNewProgram({ ...newProgram, order: Number(e.target.value) })}
              />
              <span className="text-[11px] text-forest-leaf mt-1 block">
                Lower number displays first (e.g. 0, 1, 2)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
              Excerpt (Card preview on Homepage)
            </label>
            <textarea
              className="input w-full min-h-[70px] text-sm"
              placeholder="Short summary shown on homepage program cards..."
              value={newProgram.excerpt}
              onChange={(e) => setNewProgram({ ...newProgram, excerpt: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
              Full Program Description
            </label>
            <textarea
              className="input w-full min-h-[100px] text-sm"
              placeholder="Comprehensive description of what this program offers and how it helps mothers..."
              value={newProgram.description}
              onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
            />
          </div>

          {/* Program Image */}
          <div className="rounded-2xl border border-forest/10 bg-cream/30 p-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-2">
              Program Banner Image
            </label>
            {newProgram.image && (
              <div className="mb-3">
                <img
                  src={newProgram.image}
                  alt="Preview"
                  className="h-36 w-auto max-w-full rounded-xl object-cover ring-1 ring-gold/40 shadow-xs"
                />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer rounded-xl bg-forest px-4 py-2 text-xs font-medium text-cream hover:bg-forest-mid flex items-center gap-2">
                <Upload size={14} />
                {uploadingImg ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleProgramImageUpload(e.target.files[0], false)
                  }
                />
              </label>
              <span className="text-xs text-forest-leaf">or paste image URL below:</span>
            </div>
            <input
              className="input mt-2 text-sm w-full bg-white"
              placeholder="https://images.unsplash.com/..."
              value={newProgram.image}
              onChange={(e) => setNewProgram({ ...newProgram, image: e.target.value })}
            />
          </div>

          {/* Highlights, Benefits, Focus Areas */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                Highlights (1 per line)
              </label>
              <textarea
                className="input w-full min-h-[110px] text-xs font-mono"
                placeholder="Free consultation&#10;Personal teacher & dietitian&#10;Labor & lactation prep"
                value={newProgram.highlights}
                onChange={(e) => setNewProgram({ ...newProgram, highlights: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                Benefits (1 per line)
              </label>
              <textarea
                className="input w-full min-h-[110px] text-xs font-mono"
                placeholder="Reduced complications&#10;Optimal birth position&#10;Pelvic floor strength"
                value={newProgram.benefits}
                onChange={(e) => setNewProgram({ ...newProgram, benefits: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                Focus Areas (1 per line)
              </label>
              <textarea
                className="input w-full min-h-[110px] text-xs font-mono"
                placeholder="Trimester 1: Nausea relief&#10;Trimester 2: Flexibility&#10;Trimester 3: Labor prep"
                value={newProgram.focusAreas}
                onChange={(e) => setNewProgram({ ...newProgram, focusAreas: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-forest/10 pt-4">
            <label className="flex items-center gap-2 text-sm font-medium text-forest cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded accent-forest"
                checked={newProgram.published}
                onChange={(e) => setNewProgram({ ...newProgram, published: e.target.checked })}
              />
              Publish immediately on website
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 text-xs font-medium text-forest-mid hover:text-forest"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </button>
              <button type="submit" disabled={saving || uploadingImg} className="btn-gold">
                {saving ? "Creating Program..." : "Create & Publish Program"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =========================================================================
          EDIT PROGRAM FORM
      ========================================================================= */}
      {active && (
        <form
          onSubmit={handleUpdate}
          className="mt-6 max-w-4xl space-y-5 rounded-3xl border border-forest/20 bg-white p-6 shadow-lg md:p-8 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-forest/10 pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
                Editing Program
              </span>
              <h2 className="font-serif text-2xl text-forest">{active.title}</h2>
            </div>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="rounded-full p-1 text-forest-mid hover:bg-cream"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                Program Title *
              </label>
              <input
                className="input w-full"
                value={active.title || ""}
                onChange={(e) => setActive({ ...active, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                URL Slug (/yoga/slug) *
              </label>
              <input
                className="input w-full"
                value={active.slug || ""}
                onChange={(e) =>
                  setActive({
                    ...active,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
                  })
                }
                required
              />
              <span className="text-[11px] text-forest-leaf mt-1 block">
                Link: <strong>/yoga/{active.slug}</strong>
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                Subtitle / Tagline
              </label>
              <input
                className="input w-full"
                value={active.subtitle || ""}
                onChange={(e) => setActive({ ...active, subtitle: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                Display Order Priority
              </label>
              <input
                type="number"
                className="input w-full"
                value={active.order !== undefined ? active.order : 0}
                onChange={(e) => setActive({ ...active, order: Number(e.target.value) })}
              />
              <span className="text-[11px] text-forest-leaf mt-1 block">
                Lower number displays first (e.g. 0, 1, 2)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
              Excerpt (Card preview on Homepage)
            </label>
            <textarea
              className="input w-full min-h-[70px] text-sm"
              value={active.excerpt || ""}
              onChange={(e) => setActive({ ...active, excerpt: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
              Full Program Description
            </label>
            <textarea
              className="input w-full min-h-[100px] text-sm"
              value={active.description || ""}
              onChange={(e) => setActive({ ...active, description: e.target.value })}
            />
          </div>

          {/* Program Image */}
          <div className="rounded-2xl border border-forest/10 bg-cream/30 p-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-2">
              Program Banner Image
            </label>
            {active.image && (
              <div className="mb-3">
                <img
                  src={active.image}
                  alt=""
                  className="h-36 w-auto max-w-full rounded-xl object-cover ring-1 ring-gold/40 shadow-xs"
                />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer rounded-xl bg-forest px-4 py-2 text-xs font-medium text-cream hover:bg-forest-mid flex items-center gap-2">
                <Upload size={14} />
                {uploadingImg ? "Uploading..." : "Upload New Image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleProgramImageUpload(e.target.files[0], true)
                  }
                />
              </label>
              <span className="text-xs text-forest-leaf">or paste image URL below:</span>
            </div>
            <input
              className="input mt-2 text-sm w-full bg-white"
              value={active.image || ""}
              onChange={(e) => setActive({ ...active, image: e.target.value })}
            />
          </div>

          {/* Highlights, Benefits, Focus Areas */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                Highlights (1 per line)
              </label>
              <textarea
                className="input w-full min-h-[110px] text-xs font-mono"
                value={active.highlights || ""}
                onChange={(e) => setActive({ ...active, highlights: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                Benefits (1 per line)
              </label>
              <textarea
                className="input w-full min-h-[110px] text-xs font-mono"
                value={active.benefits || ""}
                onChange={(e) => setActive({ ...active, benefits: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                Focus Areas (1 per line)
              </label>
              <textarea
                className="input w-full min-h-[110px] text-xs font-mono"
                value={active.focusAreas || ""}
                onChange={(e) => setActive({ ...active, focusAreas: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-forest/10 pt-4">
            <label className="flex items-center gap-2 text-sm font-medium text-forest cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded accent-forest"
                checked={active.published !== false}
                onChange={(e) => setActive({ ...active, published: e.target.checked })}
              />
              Published & Live on Website
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 text-xs font-medium text-forest-mid hover:text-forest"
                onClick={() => setActive(null)}
              >
                Cancel
              </button>
              <button type="submit" disabled={saving || uploadingImg} className="btn-gold">
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =========================================================================
          PROGRAMS LIST (WITH REORDERING CONTROLS)
      ========================================================================= */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest-mid">
            <ArrowUpDown size={14} className="text-gold-deep" />
            <span>Display Order on Website (Use ▲ ▼ arrows to rearrange)</span>
          </div>
          {reordering && (
            <span className="text-xs text-gold-deep animate-pulse font-medium">
              Updating order...
            </span>
          )}
        </div>

        <div className="grid gap-3.5">
          {loading ? (
            <div className="p-8 text-center text-sm text-forest-mid">Loading programs...</div>
          ) : items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-forest/20 bg-white p-12 text-center">
              <p className="font-serif text-2xl text-forest">No programs yet</p>
              <p className="mt-1 text-sm text-forest-mid">
                Click &quot;Add New Program&quot; above to create one.
              </p>
            </div>
          ) : (
            items.map((p, index) => {
              const isLive = p.published !== false;
              const isFirst = index === 0;
              const isLast = index === items.length - 1;

              return (
                <div
                  key={p._id}
                  className="flex flex-col gap-4 rounded-3xl border border-forest/10 bg-white p-4 shadow-xs transition hover:border-forest/25 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Reorder Up/Down Control Buttons */}
                    <div className="flex flex-col items-center gap-1 shrink-0 rounded-2xl bg-cream/70 p-1 border border-forest/10">
                      <button
                        type="button"
                        onClick={() => handleMove(index, "up")}
                        disabled={isFirst || reordering}
                        className="rounded-lg p-1 text-forest transition hover:bg-forest hover:text-cream disabled:opacity-20 disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <span className="text-[11px] font-bold text-forest-mid px-1">
                        #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMove(index, "down")}
                        disabled={isLast || reordering}
                        className="rounded-lg p-1 text-forest transition hover:bg-forest hover:text-cream disabled:opacity-20 disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    {/* Program Thumbnail */}
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-16 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-gold/30"
                      />
                    ) : (
                      <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-2xl bg-forest-deep text-lg font-serif font-bold text-gold">
                        {p.title?.charAt(0) || "P"}
                      </div>
                    )}

                    {/* Title and details */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-serif text-xl sm:text-2xl text-forest">{p.title}</p>
                        {isLive ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                            ● Live
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600">
                            ○ Draft
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2.5 text-xs text-forest-mid">
                        <span className="font-mono text-forest-leaf">/yoga/{p.slug}</span>
                        {p.subtitle && <span className="truncate max-w-xs">· {p.subtitle}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      href={`/yoga/${p.slug}`}
                      target="_blank"
                      className="flex items-center gap-1.5 rounded-xl border border-forest/10 bg-cream/50 px-3 py-2 text-xs font-medium text-forest transition hover:bg-forest/10"
                      title="View live page on website"
                    >
                      <ExternalLink size={13} />
                      View Live
                    </Link>

                    <button
                      onClick={() => startEdit(p)}
                      className="flex items-center gap-1.5 rounded-xl bg-forest px-3.5 py-2 text-xs font-semibold text-cream transition hover:bg-forest-mid shadow-xs"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p._id, p.title)}
                      className="p-2 text-forest-leaf transition hover:text-red-600"
                      title="Delete program"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
