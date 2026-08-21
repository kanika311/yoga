"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";

export default function SettingsAdmin() {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState("");
  const [uploading, setUploading] = useState("");

  useEffect(() => {
    api("/api/settings").then(setForm);
  }, []);

  function set(key, value) {
    setForm((f) => ({
      ...f,
      [key]: value,
    }));
  }

  // Upload image
  async function uploadImage(file, field) {
    if (!file) return;

    try {
      setUploading(field);

      const formData = new FormData();
      formData.append("image", file);

      const response = await api("/api/upload", {
        method: "POST",
        body: formData,
      });

      // Assuming backend returns:
      // { url: "https://..." }

      if (response?.url) {
        set(field, response.url);
      }

      setSaved("Image uploaded successfully");

      setTimeout(() => {
        setSaved("");
      }, 2000);
    } catch (error) {
      console.error(error);
      setSaved("Image upload failed");

      setTimeout(() => {
        setSaved("");
      }, 2000);
    } finally {
      setUploading("");
    }
  }

  async function save(e) {
    e.preventDefault();

    try {
      await api("/api/settings", {
        method: "PUT",
        body: JSON.stringify(form),
      });

      setSaved("Settings saved successfully");

      setTimeout(() => {
        setSaved("");
      }, 2000);
    } catch (error) {
      console.error(error);
      setSaved("Failed to save settings");
    }
  }

  if (!form) {
    return <p>Loading...</p>;
  }

  return (
    <div className="pb-10">
      <h1 className="font-serif text-4xl text-forest">
        Site Settings
      </h1>

      <form
        onSubmit={save}
        className="mt-6 max-w-3xl space-y-6"
      >
        {/* ================= BASIC SETTINGS ================= */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-forest">
            Basic Information
          </h2>

          {[
            "siteName",
            "tagline",
            "email",
            "phone",
            "whatsapp",
            "address",
            "founderName",
            "hours",
          ].map((key) => (
            <label
              key={key}
              className="mb-4 block text-sm font-medium"
            >
              <span className="capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </span>

              <input
                className="input mt-1 w-full"
                value={form[key] || ""}
                onChange={(e) => set(key, e.target.value)}
              />
            </label>
          ))}
        </div>

        {/* ================= ABOUT ================= */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-forest">
            About Website
          </h2>

          <label className="block text-sm font-medium">
            About
          </label>

          <textarea
            className="input mt-1 min-h-32 w-full"
            value={form.about || ""}
            onChange={(e) => set("about", e.target.value)}
          />
        </div>

        {/* ================= FOUNDER ================= */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-forest">
            Founder Information
          </h2>

          <label className="block text-sm font-medium">
            Founder Name
          </label>

          <input
            className="input mt-1 w-full"
            value={form.founderName || ""}
            onChange={(e) =>
              set("founderName", e.target.value)
            }
          />

          <label className="mt-4 block text-sm font-medium">
            Founder Bio
          </label>

          <textarea
            className="input mt-1 min-h-32 w-full"
            value={form.founderBio || ""}
            onChange={(e) =>
              set("founderBio", e.target.value)
            }
          />

          {/* Founder Image */}
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
                  onChange={(e) =>
                    uploadImage(
                      e.target.files?.[0],
                      "founderImage"
                    )
                  }
                />

                {uploading === "founderImage" && (
                  <p className="mt-2 text-sm text-gray-500">
                    Uploading...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= WEBSITE LOGO ================= */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-forest">
            Website Logo
          </h2>

          <p className="mb-3 text-sm text-gray-500">
            Upload the logo that will be displayed in the
            website header and other sections.
          </p>

          <div className="flex flex-col gap-4">
            {form.logo && (
              <div className="relative h-24 w-60 overflow-hidden rounded-lg border bg-gray-50 p-3">
                <Image
                  src={form.logo}
                  alt="Website Logo"
                  fill
                  className="object-contain p-3"
                  unoptimized
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                uploadImage(
                  e.target.files?.[0],
                  "logo"
                )
              }
            />

            {uploading === "logo" && (
              <p className="text-sm text-gray-500">
                Uploading logo...
              </p>
            )}
          </div>
        </div>

        {/* ================= BANNER ================= */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-forest">
            Website Banner
          </h2>

          <p className="mb-3 text-sm text-gray-500">
            Upload the banner/hero image that should appear
            on the website homepage.
          </p>

          {form.bannerImage && (
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl border">
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
            onChange={(e) =>
              uploadImage(
                e.target.files?.[0],
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

        {/* ================= SAVE ================= */}

        <div className="flex items-center">
          <button
            type="submit"
            className="btn-gold"
            disabled={!!uploading}
          >
            Save Settings
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