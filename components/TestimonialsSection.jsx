/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, MessageSquarePlus, X, CheckCircle2, Upload, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

const PROGRAMS = [
  "Prenatal Yoga (1st Trimester)",
  "Prenatal Yoga (2nd Trimester)",
  "Prenatal Yoga (3rd Trimester)",
  "Postnatal Recovery & Pelvic Health",
  "Fertility & Hormonal Balance",
  "Garbha Sanskar & Meditation",
  "Personalized 1-on-1 Journey",
  "Other",
];

const RATING_LABELS = {
  1: "Poor experience",
  2: "Fair experience",
  3: "Good session",
  4: "Very good & helpful",
  5: "Exceptional & life-changing!",
};

export default function TestimonialsSection({ initialTestimonials = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImg, setUploadingImg] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "Prenatal Yoga (2nd Trimester)",
    customRole: "",
    quote: "",
    rating: 5,
    country: "",
    email: "",
    image: "",
  });

  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        handleCloseModal();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  async function handleImageUpload(file) {
    if (!file) return;
    try {
      setUploadingImg(true);
      setError("");
      const formData = new FormData();
      formData.append("image", file);
      const res = await api("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res?.url) {
        setForm((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setError(err?.message || "Failed to upload photo. You can submit without a photo.");
    } finally {
      setUploadingImg(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) {
      setError("Please fill in your name and review.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const finalRole =
        form.role === "Other" && form.customRole.trim()
          ? form.customRole.trim()
          : form.role;

      const payload = {
        name: form.name.trim(),
        role: finalRole,
        quote: form.quote.trim(),
        rating: form.rating,
        country: form.country.trim(),
        email: form.email.trim(),
        image: form.image.trim(),
      };

      const res = await api("/api/testimonials", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("Review submitted:", res);
      setSuccess(true);
    } catch (err) {
      console.error("Review submission error:", err);
      setError(err?.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCloseModal() {
    setIsOpen(false);
    setTimeout(() => {
      setSuccess(false);
      setError("");
      setForm({
        name: "",
        role: "Prenatal Yoga (2nd Trimester)",
        customRole: "",
        quote: "",
        rating: 5,
        country: "",
        email: "",
        image: "",
      });
    }, 300);
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="section">
        {/* Header with Title and "Write a Review" Button */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="eyebrow">Client Voices</span>
              <span className="flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold-deep">
                <Sparkles size={12} /> Verified Journeys
              </span>
            </div>
            <h2 className="display mt-1">Trusted across 15 nations</h2>
            <p className="mt-2 max-w-xl text-forest-mid">
              Hear from mothers and practitioners who transformed their pregnancy, birth preparation, and postpartum recovery with MummaMove.
            </p>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="btn-gold flex items-center gap-2 whitespace-nowrap shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <MessageSquarePlus size={18} />
            Write a Review
          </button>
        </div>

        {/* Testimonials Grid */}
        {initialTestimonials.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {initialTestimonials.map((t, idx) => (
              <blockquote
                key={t._id || idx}
                className="group relative flex flex-col justify-between rounded-[2rem] border border-forest/10 bg-cream/70 p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-cream hover:shadow-soft"
              >
                <div>
                  {/* Rating Stars & Location */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex gap-1 text-gold">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    {t.country && (
                      <span className="rounded-full bg-forest/5 px-2.5 py-0.5 text-[11px] font-medium text-forest-mid">
                        📍 {t.country}
                      </span>
                    )}
                  </div>

                  {/* Quote */}
                  <p className="font-serif text-lg leading-relaxed text-forest">
                    “{t.quote}”
                  </p>
                </div>

                {/* Footer / Author */}
                <footer className="mt-6 flex items-center gap-3.5 border-t border-forest/5 pt-4">
                  {t.image ? (
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-gold/30"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest-deep text-base font-serif font-bold text-gold">
                      {t.name?.charAt(0)?.toUpperCase() || "M"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-forest">{t.name}</p>
                    <p className="truncate text-xs text-forest-leaf">{t.role || "MummaMove Mother"}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-dashed border-forest/20 bg-cream/30 p-12 text-center">
            <p className="font-serif text-2xl text-forest">Be the first to share your journey</p>
            <p className="mt-2 text-sm text-forest-mid">
              Your story inspires countless mothers preparing for child birth & wellness.
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="btn-gold mt-6 inline-flex items-center gap-2"
            >
              <MessageSquarePlus size={18} />
              Share Your Story
            </button>
          </div>
        )}
      </div>

      {/* Review Submission Modal with z-[9999] and overflow containment */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs transition-opacity duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-[2rem] bg-white shadow-2xl overflow-hidden border border-forest/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-forest/10 px-6 py-4 md:px-8 bg-cream/40 shrink-0">
              <div className="pr-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
                  MummaMove Community
                </span>
                <h3 className="font-serif text-2xl text-forest md:text-3xl mt-0.5">
                  Share Your Experience
                </h3>
                <p className="text-xs text-forest-mid mt-0.5">
                  Your words help expectant & new mothers choose the right holistic guidance.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-forest shadow-xs transition hover:bg-forest/10 hover:rotate-90 duration-200"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 md:px-8">
              {success ? (
                /* Success Confirmation Screen */
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="font-serif text-3xl text-forest">
                    Thank You, {form.name.split(" ")[0]}!
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-forest-mid">
                    Your review has been submitted successfully. To keep our community authentic and safe, our team will review and approve it before it goes live on the website.
                  </p>
                  <div className="mt-6 rounded-2xl bg-cream/70 p-4 text-xs text-forest-leaf">
                    ✨ Thank you for inspiring other mothers on their pregnancy & healing path!
                  </div>
                  <button onClick={handleCloseModal} className="btn-gold mt-8 w-full">
                    Close Window
                  </button>
                </div>
              ) : (
                /* Review Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1.5">
                      Your Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex gap-1 text-gold">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = (hoverRating || form.rating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setForm({ ...form, rating: star })}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 transition-transform hover:scale-125 focus:outline-hidden"
                            >
                              <Star
                                size={26}
                                className={active ? "fill-gold text-gold" : "text-gray-300"}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-xs font-medium text-gold-deep">
                        {RATING_LABELS[hoverRating || form.rating]}
                      </span>
                    </div>
                  </div>

                  {/* Name & Location */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-forest mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="input text-sm"
                        placeholder="e.g. Ananya Sharma"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-forest mb-1">
                        City / Country
                      </label>
                      <input
                        className="input text-sm"
                        placeholder="e.g. Mumbai, India / London, UK"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Program / Journey */}
                  <div>
                    <label className="block text-xs font-semibold text-forest mb-1">
                      Program / Journey Attended
                    </label>
                    <select
                      className="input text-sm bg-white"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      {PROGRAMS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>

                    {form.role === "Other" && (
                      <input
                        className="input mt-2 text-sm"
                        placeholder="Specify your yoga / wellness program..."
                        value={form.customRole}
                        onChange={(e) => setForm({ ...form, customRole: e.target.value })}
                        required
                      />
                    )}
                  </div>

                  {/* Email (Private) */}
                  <div>
                    <label className="block text-xs font-semibold text-forest mb-1">
                      Email Address <span className="text-xs font-normal text-forest-leaf">(Optional, kept private)</span>
                    </label>
                    <input
                      className="input text-sm"
                      type="email"
                      placeholder="e.g. ananya@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-xs font-semibold text-forest mb-1">
                      Your Story & Experience <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="input min-h-[90px] text-sm"
                      placeholder="Share how the sessions supported your mind, body, breathing, trimester, or labor preparation..."
                      value={form.quote}
                      onChange={(e) => setForm({ ...form, quote: e.target.value })}
                      required
                    />
                  </div>

                  {/* Photo Upload (Optional) */}
                  <div className="rounded-2xl border border-forest/10 bg-cream/40 p-3">
                    <label className="block text-xs font-semibold text-forest mb-1.5">
                      Your Photo <span className="font-normal text-forest-leaf">(Optional)</span>
                    </label>

                    {form.image ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={form.image}
                          alt="Preview"
                          className="h-11 w-11 rounded-full object-cover ring-2 ring-gold"
                        />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, image: "" })}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Remove Photo
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-forest px-3.5 py-1.5 text-xs font-medium text-cream transition hover:bg-forest-mid">
                          <Upload size={13} />
                          {uploadingImg ? "Uploading..." : "Upload Photo"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingImg}
                            onChange={(e) =>
                              e.target.files?.[0] && handleImageUpload(e.target.files[0])
                            }
                          />
                        </label>
                        <span className="text-[11px] text-forest-leaf">
                          JPG, PNG, or WEBP (Max 5MB)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Error Notification */}
                  {error && (
                    <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700">
                      {error}
                    </div>
                  )}

                  {/* Approval Notice */}
                  <div className="flex items-start gap-2 rounded-xl bg-gold/10 p-3 text-xs text-forest-mid">
                    <span className="text-sm">🛡️</span>
                    <span>
                      <strong>Admin Verification:</strong> Your review will be published on the website after approval by our moderation team.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || uploadingImg}
                    className="btn-gold w-full text-center py-3"
                  >
                    {submitting ? "Submitting Review..." : "Submit Review for Approval"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
