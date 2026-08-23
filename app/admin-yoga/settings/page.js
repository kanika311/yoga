"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Globe,
  KeyRound,
  Users,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ShieldCheck,
  UserCheck,
  Lock,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const defaultForm = {
  siteName: "MummaMove",
  tagline: "MummaMove",
  email: "",
  phone: "",
  whatsapp: "",
  whatsappMessage: "Hi, I would like a free prenatal yoga consultation.",
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
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("site"); // "site" | "password" | "admins"

  // ----------------------------------------------------
  // Tab 1: Site Settings State
  // ----------------------------------------------------
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState("");
  const [uploading, setUploading] = useState("");
  const [saving, setSaving] = useState(false);

  // ----------------------------------------------------
  // Tab 2: Change Password State
  // ----------------------------------------------------
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ----------------------------------------------------
  // Tab 3: Admin Accounts State
  // ----------------------------------------------------
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showNewAdminPass, setShowNewAdminPass] = useState(false);
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState("");
  const [adminError, setAdminError] = useState("");

  // Load site settings
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

  // Load admins list when switching to admins tab
  function loadAdmins() {
    setLoadingAdmins(true);
    api("/api/admins")
      .then((data) => {
        setAdmins(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load admins:", err);
      })
      .finally(() => {
        setLoadingAdmins(false);
      });
  }

  useEffect(() => {
    if (activeTab === "admins") {
      loadAdmins();
    }
  }, [activeTab]);

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

  // Save site settings
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

  // Handle Change Password
  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError("Please fill all required password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    try {
      setPasswordSaving(true);
      const res = await api("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify(passwordForm),
      });

      setPasswordSuccess(res?.message || "Password has been changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setPasswordSuccess("");
      }, 4000);
    } catch (err) {
      console.error("Change password error:", err);
      setPasswordError(err?.message || "Failed to update password.");
    } finally {
      setPasswordSaving(false);
    }
  }

  // Handle Create New Admin
  async function handleAddAdmin(e) {
    e.preventDefault();
    setAdminError("");
    setAdminSuccess("");

    if (!newAdminForm.name.trim() || !newAdminForm.email.trim() || !newAdminForm.password) {
      setAdminError("Please fill in name, email, and password.");
      return;
    }

    if (newAdminForm.password.length < 6) {
      setAdminError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setAdminSaving(true);
      const res = await api("/api/admins", {
        method: "POST",
        body: JSON.stringify(newAdminForm),
      });

      setAdminSuccess(res?.message || "New admin created successfully!");
      setNewAdminForm({ name: "", email: "", password: "" });
      setShowAddAdmin(false);
      loadAdmins();
      setTimeout(() => {
        setAdminSuccess("");
      }, 4000);
    } catch (err) {
      console.error("Add admin error:", err);
      setAdminError(err?.message || "Failed to create admin.");
    } finally {
      setAdminSaving(false);
    }
  }

  // Handle Delete Admin
  async function handleDeleteAdmin(id, email) {
    if (!confirm(`Are you sure you want to delete admin "${email}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await api(`/api/admins/${id}`, { method: "DELETE" });
      setAdminSuccess(res?.message || "Admin deleted successfully.");
      loadAdmins();
      setTimeout(() => {
        setAdminSuccess("");
      }, 3000);
    } catch (err) {
      alert("Failed to delete admin: " + (err?.message || ""));
    }
  }

  // Loading
  if (!form) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="font-serif text-4xl text-forest">Settings & Security</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your website information, passwords, and admin access accounts.
        </p>
      </div>

      {/* TOP TABS NAVIGATION */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-forest/10 pb-3">
        <button
          onClick={() => setActiveTab("site")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            activeTab === "site"
              ? "bg-forest text-cream shadow-xs"
              : "bg-white text-forest-mid border border-forest/10 hover:bg-forest/5"
          }`}
        >
          <Globe size={16} />
          Site Settings
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            activeTab === "password"
              ? "bg-forest text-cream shadow-xs"
              : "bg-white text-forest-mid border border-forest/10 hover:bg-forest/5"
          }`}
        >
          <KeyRound size={16} />
          Change Password
        </button>

        <button
          onClick={() => setActiveTab("admins")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            activeTab === "admins"
              ? "bg-forest text-cream shadow-xs"
              : "bg-white text-forest-mid border border-forest/10 hover:bg-forest/5"
          }`}
        >
          <Users size={16} />
          Admin Accounts
          {admins.length > 0 && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === "admins" ? "bg-white/20 text-cream" : "bg-forest/10 text-forest"
              }`}
            >
              {admins.length}
            </span>
          )}
        </button>
      </div>

      {/* =========================================================================
          TAB 1: SITE SETTINGS
      ========================================================================= */}
      {activeTab === "site" && (
        <form onSubmit={save} className="max-w-4xl space-y-6">
          {/* BASIC INFORMATION */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-forest">Basic Information</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium">
                Site Name
                <input
                  className="input mt-1 w-full"
                  value={form.siteName || ""}
                  onChange={(event) => setField("siteName", event.target.value)}
                  placeholder="MummaMove"
                />
              </label>

              <label className="block text-sm font-medium">
                Tagline
                <input
                  className="input mt-1 w-full"
                  value={form.tagline || ""}
                  onChange={(event) => setField("tagline", event.target.value)}
                  placeholder="Prenatal & Postnatal Yoga"
                />
              </label>

              <label className="block text-sm font-medium">
                Email
                <input
                  type="email"
                  className="input mt-1 w-full"
                  value={form.email || ""}
                  onChange={(event) => setField("email", event.target.value)}
                  placeholder="info@mummamove.com"
                />
              </label>

              <label className="block text-sm font-medium">
                Phone
                <input
                  type="tel"
                  className="input mt-1 w-full"
                  value={form.phone || ""}
                  onChange={(event) => setField("phone", event.target.value)}
                  placeholder="+91 9876543210"
                />
              </label>

              <label className="block text-sm font-medium">
                WhatsApp Number
                <input
                  type="tel"
                  className="input mt-1 w-full"
                  value={form.whatsapp || ""}
                  onChange={(event) => setField("whatsapp", event.target.value)}
                  placeholder="+91 9876543210"
                />
                <span className="mt-1 block text-xs text-gray-400">Include country code.</span>
              </label>

              <label className="block text-sm font-medium">
                Working Hours
                <input
                  className="input mt-1 w-full"
                  value={form.hours || ""}
                  onChange={(event) => setField("hours", event.target.value)}
                  placeholder="Mon - Sat: 9 AM - 7 PM"
                />
              </label>
            </div>

            <label className="mt-4 block text-sm font-medium">
              Address
              <textarea
                className="input mt-1 min-h-24 w-full"
                value={form.address || ""}
                onChange={(event) => setField("address", event.target.value)}
                placeholder="Enter complete address"
              />
            </label>
          </div>

          {/* ABOUT */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-forest">About Website</h2>
            <label className="block text-sm font-medium">
              About
              <textarea
                className="input mt-1 min-h-40 w-full"
                value={form.about || ""}
                onChange={(event) => setField("about", event.target.value)}
                placeholder="Write about MummaMove..."
              />
            </label>
          </div>

          {/* FOUNDER */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-forest">Founder Information</h2>

            <label className="block text-sm font-medium">
              Founder Name
              <input
                className="input mt-1 w-full"
                value={form.founderName || ""}
                onChange={(event) => setField("founderName", event.target.value)}
                placeholder="Founder name"
              />
            </label>

            <label className="mt-4 block text-sm font-medium">
              Founder Bio
              <textarea
                className="input mt-1 min-h-40 w-full"
                value={form.founderBio || ""}
                onChange={(event) => setField("founderBio", event.target.value)}
                placeholder="Write founder biography..."
              />
            </label>

            <div className="mt-6">
              <label className="block text-sm font-medium">Founder / Trainer Photo</label>
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
                    onChange={(event) => uploadImage(event.target.files?.[0], "founderImage")}
                  />
                  {uploading === "founderImage" && (
                    <p className="mt-2 text-sm text-gray-500">Uploading founder image...</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* WEBSITE LOGO */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-forest">Website Logo</h2>
            <p className="mb-4 text-sm text-gray-500">
              Upload the logo displayed in the website header and footer.
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
              onChange={(event) => uploadImage(event.target.files?.[0], "logo")}
            />
            {uploading === "logo" && <p className="mt-2 text-sm text-gray-500">Uploading logo...</p>}
          </div>

          {/* WEBSITE BANNER */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-forest">Website Banner</h2>
            <p className="mb-4 text-sm text-gray-500">Upload the homepage hero/banner image.</p>

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
              onChange={(event) => uploadImage(event.target.files?.[0], "bannerImage")}
            />
            {uploading === "bannerImage" && (
              <p className="mt-2 text-sm text-gray-500">Uploading banner...</p>
            )}
          </div>

          {/* SOCIAL MEDIA */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-forest">
              Social Media & Contact Links
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              These links will automatically appear in the website footer.
            </p>

            <div className="space-y-5">
              <label className="block text-sm font-medium">
                Instagram
                <input
                  type="url"
                  className="input mt-1 w-full"
                  value={form.social?.instagram || ""}
                  onChange={(event) => setSocial("instagram", event.target.value)}
                  placeholder="https://instagram.com/mummamove"
                />
              </label>

              <label className="block text-sm font-medium">
                LinkedIn
                <input
                  type="url"
                  className="input mt-1 w-full"
                  value={form.social?.linkedin || ""}
                  onChange={(event) => setSocial("linkedin", event.target.value)}
                  placeholder="https://linkedin.com/company/mummamove"
                />
              </label>

              <label className="block text-sm font-medium">
                YouTube
                <input
                  type="url"
                  className="input mt-1 w-full"
                  value={form.social?.youtube || ""}
                  onChange={(event) => setSocial("youtube", event.target.value)}
                  placeholder="https://youtube.com/@mummamove"
                />
              </label>

              <label className="block text-sm font-medium">
                WhatsApp Number
                <input
                  type="tel"
                  className="input mt-1 w-full"
                  value={form.whatsapp || ""}
                  onChange={(event) => setField("whatsapp", event.target.value)}
                  placeholder="+91 9876543210"
                />
              </label>
            </div>
          </div>

          {/* ==========================================
              WHATSAPP & CHAT MESSAGE SETTINGS
          =========================================== */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366] text-white">
                <svg viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor">
                  <path d="M19.11 17.47c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.13 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
                  <path d="M16.03 3C9.4 3 4 8.4 4 15.03c0 2.12.55 4.1 1.52 5.83L4 29l8.3-1.48A12 12 0 0 0 16.03 27C22.66 27 28 21.6 28 14.97 28 8.4 22.66 3 16.03 3zm0 21.82c-1.9 0-3.67-.5-5.2-1.38l-.37-.22-4.92.88.9-4.8-.24-.39a9.8 9.8 0 0 1-1.5-5.28c0-5.42 4.41-9.83 9.83-9.83 5.42 0 9.83 4.41 9.83 9.83 0 5.42-4.41 9.83-9.83 9.83z" />
                </svg>
              </span>
              <h2 className="text-xl font-semibold text-forest">
                WhatsApp Floating Button & Pre-filled Message
              </h2>
            </div>
            <p className="mb-5 text-sm text-forest-mid">
              Customize the phone number and default chat message that opens when visitors click the floating WhatsApp button on your website.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-1">
                  WhatsApp Contact Number
                </label>
                <input
                  type="tel"
                  className="input bg-white w-full"
                  value={form.whatsapp || ""}
                  onChange={(event) => setField("whatsapp", event.target.value)}
                  placeholder="+91 9917580547"
                />
                <span className="mt-1 block text-xs text-forest-leaf">
                  Include country code (e.g. +91 9917580547).
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-forest mb-1">
                  Default Pre-filled Message
                </label>
                <textarea
                  className="input bg-white w-full min-h-[85px] text-sm"
                  value={
                    form.whatsappMessage !== undefined
                      ? form.whatsappMessage
                      : "Hi, I would like a free prenatal yoga consultation."
                  }
                  onChange={(event) => setField("whatsappMessage", event.target.value)}
                  placeholder="Hi, I would like a free prenatal yoga consultation."
                />
                <span className="mt-1 block text-xs text-forest-leaf">
                  This text automatically fills in WhatsApp when a user clicks the button.
                </span>
              </div>

              {/* Live Preview Box */}
              <div className="rounded-xl border border-emerald-200 bg-white p-3.5 mt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 mb-1.5">
                  Live Message Preview on Visitor&apos;s WhatsApp:
                </p>
                <div className="inline-block max-w-full rounded-2xl rounded-tr-none bg-[#E7FFDB] px-3.5 py-2 text-xs text-gray-800 shadow-xs border border-[#D0F0C0]">
                  {form.whatsappMessage || "Hi, I would like a free prenatal yoga consultation."}
                </div>
              </div>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex items-center">
            <button
              type="submit"
              disabled={saving || !!uploading}
              className="btn-gold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>

            {saved && <span className="ml-4 text-sm text-forest-leaf">{saved}</span>}
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 2: CHANGE PASSWORD
      ========================================================================= */}
      {activeTab === "password" && (
        <div className="max-w-2xl">
          <form
            onSubmit={handleChangePassword}
            className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm md:p-8"
          >
            <div className="flex items-center gap-3 border-b border-forest/10 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
                <KeyRound size={20} />
              </div>
              <div>
                <h2 className="font-serif text-xl text-forest">Change Your Password</h2>
                <p className="text-xs text-forest-mid">
                  Logged in as: <strong className="text-forest">{currentUser?.email}</strong>
                </p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-sm text-emerald-800 border border-emerald-200">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-sm text-red-800 border border-red-200">
                <AlertCircle size={18} className="shrink-0 text-red-600" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="mt-6 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    className="input w-full pr-10"
                    placeholder="Enter your current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-leaf hover:text-forest"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                  New Password (min. 6 characters) *
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    className="input w-full pr-10"
                    placeholder="Enter your new password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-leaf hover:text-forest"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    className="input w-full pr-10"
                    placeholder="Re-enter your new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-leaf hover:text-forest"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                type="submit"
                disabled={passwordSaving}
                className="btn-gold flex items-center gap-2"
              >
                <Lock size={16} />
                {passwordSaving ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ADMIN ACCOUNTS
      ========================================================================= */}
      {activeTab === "admins" && (
        <div className="max-w-4xl space-y-6">
          {/* Top Bar with Add Admin Button */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl text-forest">Administrator Accounts</h2>
              <p className="text-xs text-forest-mid mt-0.5">
                All registered admin users who have full access to this CMS.
              </p>
            </div>

            <button
              onClick={() => setShowAddAdmin(!showAddAdmin)}
              className="btn-gold flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus size={16} />
              {showAddAdmin ? "Close Form" : "Add New Admin"}
            </button>
          </div>

          {adminSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-sm text-emerald-800 border border-emerald-200">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
              <span>{adminSuccess}</span>
            </div>
          )}

          {adminError && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-sm text-red-800 border border-red-200">
              <AlertCircle size={18} className="shrink-0 text-red-600" />
              <span>{adminError}</span>
            </div>
          )}

          {/* Add New Admin Form Drawer */}
          {showAddAdmin && (
            <form
              onSubmit={handleAddAdmin}
              className="rounded-2xl border border-forest/15 bg-cream/30 p-6 shadow-sm animate-in fade-in duration-200"
            >
              <div className="flex items-center justify-between border-b border-forest/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-gold-deep" size={20} />
                  <h3 className="font-serif text-lg text-forest">Create New Administrator</h3>
                </div>
                <span className="text-xs font-semibold text-forest-mid bg-white px-2.5 py-1 rounded-full border border-forest/10">
                  Role: Admin
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                    Full Name *
                  </label>
                  <input
                    className="input bg-white"
                    placeholder="e.g. Pooja Sharma"
                    value={newAdminForm.name}
                    onChange={(e) =>
                      setNewAdminForm({ ...newAdminForm, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                    Admin Email *
                  </label>
                  <input
                    type="email"
                    className="input bg-white"
                    placeholder="e.g. pooja@mummamove.com"
                    value={newAdminForm.email}
                    onChange={(e) =>
                      setNewAdminForm({ ...newAdminForm, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-mid mb-1">
                  Password (min. 6 characters) *
                </label>
                <div className="relative max-w-md">
                  <input
                    type={showNewAdminPass ? "text" : "password"}
                    className="input bg-white w-full pr-10"
                    placeholder="Enter password for new admin"
                    value={newAdminForm.password}
                    onChange={(e) =>
                      setNewAdminForm({ ...newAdminForm, password: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewAdminPass(!showNewAdminPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-leaf hover:text-forest"
                  >
                    {showNewAdminPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3 border-t border-forest/10 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAdmin(false)}
                  className="px-4 py-2 text-xs font-medium text-forest-mid hover:text-forest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adminSaving}
                  className="btn-gold flex items-center gap-2 text-xs"
                >
                  <Plus size={14} />
                  {adminSaving ? "Creating..." : "Create Admin Account"}
                </button>
              </div>
            </form>
          )}

          {/* Admins List */}
          <div className="rounded-2xl border border-forest/10 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-forest/10 bg-cream/20">
              <h3 className="font-serif text-lg text-forest">Registered Admins</h3>
            </div>

            {loadingAdmins ? (
              <div className="p-8 text-center text-forest-mid text-sm">
                Loading admin accounts...
              </div>
            ) : admins.length === 0 ? (
              <div className="p-8 text-center text-forest-mid text-sm">
                No admin accounts found.
              </div>
            ) : (
              <div className="divide-y divide-forest/5">
                {admins.map((adm) => {
                  const isCurrent =
                    adm._id === currentUser?.id || adm.email === currentUser?.email;

                  return (
                    <div
                      key={adm._id}
                      className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-cream/10 transition"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-deep font-serif font-bold text-gold">
                          {adm.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-forest">{adm.name}</p>
                            {isCurrent && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                                <UserCheck size={12} /> You (Active)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-forest-mid">{adm.email}</p>
                          <p className="text-[11px] text-forest-leaf mt-0.5">
                            Role: <span className="capitalize">{adm.role || "Admin"}</span>
                            {adm.createdAt &&
                              ` · Joined ${new Date(adm.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}`}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {isCurrent ? (
                          <span className="text-xs text-forest-leaf italic">Current Session</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteAdmin(adm._id, adm.email)}
                            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                            title="Delete Admin"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}