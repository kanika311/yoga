"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { api } from "@/lib/api";

const defaultForm = {
  siteName: "MummaMove",
  tagline: "MummaMove",

  email: "",
  phone: "",
  whatsapp: "",
  address: "A-43 Dheeraj Nagar, Yamuna Enclave, Faridabad, 121003",

  about: "",

  founderName: "",
  founderBio: "",
  founderImage: "",

  logo: "",
  bannerImage: "",

  hours: "",

  social: {
    instagram: "",
    linkedin: "",
    youtube: "",
  },
};

export default function SettingsAdmin() {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState("");
  const [uploading, setUploading] = useState("");
  const [saving, setSaving] = useState(false);

  // Load settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await api("/api/settings");

        setForm({
          ...defaultForm,
          ...data,

          social: {
            ...defaultForm.social,
            ...(data.social || {}),
          },
        });
      } catch (error) {
        console.error("Failed to load settings:", error);
        setSaved("Failed to load settings");
      }
    }

    loadSettings();
  }, []);

  // Set normal field
  function setField(key, value) {
    setForm((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        [key]: value,
      };
    });
  }

  // Set social field
  function setSocial(key, value) {
    setForm((previous) => {
      if (!previous) return previous;

      return {
        ...previous,

        social: {
          ...previous.social,
          [key]: value,
        },
      };
    });
  }

  // Upload image
  async function uploadImage(file, field) {
    if (!file) return;

    try {
      setUploading(field);
      setSaved("");

      const formData = new FormData();

      formData.append("image", file);

      const response = await api("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response?.url) {
        setField(field, response.url);
      }

      setSaved("Image uploaded successfully");

      setTimeout(() => {
        setSaved("");
      }, 2500);
    } catch (error) {
      console.error("Image upload error:", error);

      setSaved("Image upload failed");

      setTimeout(() => {
        setSaved("");
      }, 3000);
    } finally {
      setUploading("");
    }
  }

  // Save settings
  async function save(event) {
    event.preventDefault();

    if (!form) return;

    try {
      setSaving(true);
      setSaved("");

      await api("/api/settings", {
        method: "PUT",
        body: JSON.stringify(form),
      });

      setSaved("Settings saved successfully");

      setTimeout(() => {
        setSaved("");
      }, 3000);
    } catch (error) {
      console.error("Save settings error:", error);

      setSaved("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  // Loading
  if (!form) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="pb-10">

      {/* PAGE HEADER */}

      <div className="mb-8">
        <h1 className="font-serif text-4xl text-forest">
          Site Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage your website information,
          contact details, images and social
          media links.
        </p>
      </div>

      <form
        onSubmit={save}
        className="max-w-4xl space-y-6"
      >

        {/* ==========================================
            BASIC INFORMATION
        =========================================== */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-semibold text-forest">
            Basic Information
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            {/* SITE NAME */}

            <label className="block text-sm font-medium">
              Site Name

              <input
                className="input mt-1 w-full"
                value={form.siteName || ""}
                onChange={(event) =>
                  setField(
                    "siteName",
                    event.target.value
                  )
                }
                placeholder="MummaMove"
              />
            </label>

            {/* TAGLINE */}

            <label className="block text-sm font-medium">
              Tagline

              <input
                className="input mt-1 w-full"
                value={form.tagline || ""}
                onChange={(event) =>
                  setField(
                    "tagline",
                    event.target.value
                  )
                }
                placeholder=""
              />
            </label>

            {/* EMAIL */}

            <label className="block text-sm font-medium">
              Email

              <input
                type="email"
                className="input mt-1 w-full"
                value={form.email || ""}
                onChange={(event) =>
                  setField(
                    "email",
                    event.target.value
                  )
                }
                placeholder="info@healinsutras.com"
              />
            </label>

            {/* PHONE */}

            <label className="block text-sm font-medium">
              Phone

              <input
                type="tel"
                className="input mt-1 w-full"
                value={form.phone || ""}
                onChange={(event) =>
                  setField(
                    "phone",
                    event.target.value
                  )
                }
                placeholder="+91 9876543210"
              />
            </label>

            {/* WHATSAPP */}

            <label className="block text-sm font-medium">
              WhatsApp Number

              <input
                type="tel"
                className="input mt-1 w-full"
                value={form.whatsapp || ""}
                onChange={(event) =>
                  setField(
                    "whatsapp",
                    event.target.value
                  )
                }
                placeholder="+91 9876543210"
              />

              <span className="mt-1 block text-xs text-gray-400">
                Include country code.
              </span>
            </label>

            {/* HOURS */}

            <label className="block text-sm font-medium">
              Working Hours

              <input
                className="input mt-1 w-full"
                value={form.hours || ""}
                onChange={(event) =>
                  setField(
                    "hours",
                    event.target.value
                  )
                }
                placeholder="Mon - Sat: 9 AM - 7 PM"
              />
            </label>

          </div>

          {/* ADDRESS */}

          <label className="mt-4 block text-sm font-medium">
            Address

            <textarea
              className="input mt-1 min-h-24 w-full"
              value={form.address || ""}
              onChange={(event) =>
                setField(
                  "address",
                  event.target.value
                )
              }
              placeholder="Enter complete address"
            />
          </label>

        </div>


        {/* ==========================================
            ABOUT
        =========================================== */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-semibold text-forest">
            About Website
          </h2>

          <label className="block text-sm font-medium">
            About

            <textarea
              className="input mt-1 min-h-40 w-full"
              value={form.about || ""}
              onChange={(event) =>
                setField(
                  "about",
                  event.target.value
                )
              }
              placeholder="Write about MummaMove..."
            />
          </label>

        </div>


        {/* ==========================================
            FOUNDER
        =========================================== */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-semibold text-forest">
            Founder Information
          </h2>

          {/* FOUNDER NAME */}

          <label className="block text-sm font-medium">
            Founder Name

            <input
              className="input mt-1 w-full"
              value={form.founderName || ""}
              onChange={(event) =>
                setField(
                  "founderName",
                  event.target.value
                )
              }
              placeholder="Founder name"
            />
          </label>

          {/* FOUNDER BIO */}

          <label className="mt-4 block text-sm font-medium">
            Founder Bio

            <textarea
              className="input mt-1 min-h-40 w-full"
              value={form.founderBio || ""}
              onChange={(event) =>
                setField(
                  "founderBio",
                  event.target.value
                )
              }
              placeholder="Write founder biography..."
            />
          </label>

          {/* FOUNDER IMAGE */}

          <div className="mt-6">

            <label className="block text-sm font-medium">
              Founder / Admin Photo
            </label>

            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">

              {form.founderImage && (
                <div className="relative h-28 w-28 overflow-hidden rounded-full border">

                  <Image
                    src={form.founderImage}
                    alt="Founder"
                    fill
                    className="object-cover"
                    unoptimized
                  />

                </div>
              )}

              <div>

                <input
                  type="file"
                  accept="image/*"
                  className="block text-sm"
                  onChange={(event) =>
                    uploadImage(
                      event.target.files?.[0],
                      "founderImage"
                    )
                  }
                />

                {uploading === "founderImage" && (
                  <p className="mt-2 text-sm text-gray-500">
                    Uploading founder image...
                  </p>
                )}

              </div>

            </div>

          </div>

        </div>


        {/* ==========================================
            WEBSITE LOGO
        =========================================== */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-2 text-xl font-semibold text-forest">
            Website Logo
          </h2>

          <p className="mb-4 text-sm text-gray-500">
            Upload the logo displayed in the
            website header and footer.
          </p>

          {form.logo && (
            <div className="relative mb-4 h-28 w-full max-w-sm overflow-hidden rounded-lg border bg-gray-50">

              <Image
                src={form.logo}
                alt="Website Logo"
                fill
                className="object-contain p-4"
                unoptimized
              />

            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="block text-sm"
            onChange={(event) =>
              uploadImage(
                event.target.files?.[0],
                "logo"
              )
            }
          />

          {uploading === "logo" && (
            <p className="mt-2 text-sm text-gray-500">
              Uploading logo...
            </p>
          )}

        </div>


        {/* ==========================================
            WEBSITE BANNER
        =========================================== */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-2 text-xl font-semibold text-forest">
            Website Banner
          </h2>

          <p className="mb-4 text-sm text-gray-500">
            Upload the homepage hero/banner image.
          </p>

          {form.bannerImage && (
            <div className="relative mb-4 h-52 w-full overflow-hidden rounded-xl border">

              <Image
                src={form.bannerImage}
                alt="Website Banner"
                fill
                className="object-cover"
                unoptimized
              />

            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="block text-sm"
            onChange={(event) =>
              uploadImage(
                event.target.files?.[0],
                "bannerImage"
              )
            }
          />

          {uploading === "bannerImage" && (
            <p className="mt-2 text-sm text-gray-500">
              Uploading banner...
            </p>
          )}

        </div>


        {/* ==========================================
            SOCIAL MEDIA
        =========================================== */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-2 text-xl font-semibold text-forest">
            Social Media & Contact Links
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            These links will automatically appear
            in the website footer.
          </p>

          <div className="space-y-5">

            {/* INSTAGRAM */}

            <label className="block text-sm font-medium">
              Instagram

              <input
                type="url"
                className="input mt-1 w-full"
                value={
                  form.social?.instagram || ""
                }
                onChange={(event) =>
                  setSocial(
                    "instagram",
                    event.target.value
                  )
                }
                placeholder="https://instagram.com/healinsutras"
              />

              <span className="mt-1 block text-xs text-gray-400">
                Instagram profile URL
              </span>
            </label>


            {/* LINKEDIN */}

            <label className="block text-sm font-medium">
              LinkedIn

              <input
                type="url"
                className="input mt-1 w-full"
                value={
                  form.social?.linkedin || ""
                }
                onChange={(event) =>
                  setSocial(
                    "linkedin",
                    event.target.value
                  )
                }
                placeholder="https://linkedin.com/company/healinsutras"
              />

              <span className="mt-1 block text-xs text-gray-400">
                LinkedIn company/profile URL
              </span>
            </label>


            {/* YOUTUBE */}

            <label className="block text-sm font-medium">
              YouTube

              <input
                type="url"
                className="input mt-1 w-full"
                value={
                  form.social?.youtube || ""
                }
                onChange={(event) =>
                  setSocial(
                    "youtube",
                    event.target.value
                  )
                }
                placeholder="https://youtube.com/@healinsutras"
              />

              <span className="mt-1 block text-xs text-gray-400">
                YouTube channel URL
              </span>
            </label>


            {/* WHATSAPP */}

            <label className="block text-sm font-medium">
              WhatsApp Number

              <input
                type="tel"
                className="input mt-1 w-full"
                value={form.whatsapp || ""}
                onChange={(event) =>
                  setField(
                    "whatsapp",
                    event.target.value
                  )
                }
                placeholder="+91 9876543210"
              />

              <span className="mt-1 block text-xs text-gray-400">
                Include country code, e.g. +91 9876543210
              </span>
            </label>

          </div>

        </div>


        {/* ==========================================
            SAVE
        =========================================== */}

        <div className="flex items-center">

          <button
            type="submit"
            disabled={
              saving || !!uploading
            }
            className="btn-gold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>

          {saved && (
            <span className="ml-4 text-sm text-forest-leaf">
              {saved}
            </span>
          )}

        </div>

      </form>

    </div>
  );
}