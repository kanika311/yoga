"use client";

import { useState } from "react";
import { api } from "@/lib/api";

const TIMEZONES = [
  "IST (India)",
  "GST (UAE)",
  "GMT (UK)",
  "CET (Europe)",
  "SGT (Singapore)",
  "EST (US East)",
  "PST (US West)",
  "AEST (Australia)",
];

export default function InquiryForm({ type = "contact", defaultProgram = "" }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    timezone: "IST (India)",
    program: defaultProgram,
    message: "",
  });

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await api("/api/inquiries", { method: "POST", body: JSON.stringify({ ...form, type }) });
      setStatus("received");
      setForm({
        name: "",
        email: "",
        countryCode: "+91",
        phone: "",
        timezone: "IST (India)",
        program: defaultProgram,
        message: "",
      });
    } catch (err) {
      setStatus(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (status === "received") {
    return (
      <div className="rounded-[1.75rem] bg-white p-8 text-center shadow-soft">
        <p className="font-script text-3xl text-gold">Thank you</p>
        <h3 className="mt-2 font-serif text-3xl text-forest">We will reach out shortly</h3>
        <p className="mt-3 text-sm text-forest-mid">
          A Heal-In Sutras specialist will review your details and connect for a complimentary consultation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-forest-mid">
          Name
          <input className="input mt-1" required value={form.name} onChange={(e) => set("name", e.target.value)} />
        </label>
        <label className="text-sm text-forest-mid">
          Email
          <input className="input mt-1" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
        </label>
        <label className="text-sm text-forest-mid">
          Country code
          <input className="input mt-1" value={form.countryCode} onChange={(e) => set("countryCode", e.target.value)} />
        </label>
        <label className="text-sm text-forest-mid">
          Contact no.
          <input className="input mt-1" required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </label>
        <label className="text-sm text-forest-mid">
          Time zone
          <select className="input mt-1" value={form.timezone} onChange={(e) => set("timezone", e.target.value)}>
            {TIMEZONES.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-forest-mid">
          Program
          <select className="input mt-1" value={form.program} onChange={(e) => set("program", e.target.value)}>
            <option value="">Select a program</option>
            <option>Pregnancy Care Program</option>
            <option>Fertility Rebalance Program</option>
            <option>Postnatal Recovery Program</option>
          </select>
        </label>
      </div>
      <label className="mt-4 block text-sm text-forest-mid">
        Your message
        <textarea className="input mt-1 min-h-32" value={form.message} onChange={(e) => set("message", e.target.value)} />
      </label>
      {status && status !== "received" && <p className="mt-3 text-sm text-red-700">{status}</p>}
      <button className="btn-gold mt-6 w-full md:w-auto" disabled={loading}>
        {loading ? "Sending…" : type === "demo" ? "Book my free class" : "Submit"}
      </button>
    </form>
  );
}
