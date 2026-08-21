"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@healinsutras.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      router.push("/admin-yoga");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest-deep px-5">
      <Image
        src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=2000&q=80"
        alt=""
        fill
        className="object-cover opacity-30"
      />
      <form onSubmit={onSubmit} className="relative z-10 w-full max-w-md rounded-[2rem] bg-cream p-8 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/logo.png" alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
          <div>
            <p className="font-serif text-2xl text-forest">Admin CMS</p>
            <p className="text-xs uppercase tracking-[0.22em] text-gold-deep">/admin-yoga</p>
          </div>
        </div>
        <label className="text-sm text-forest-mid">
          Email
          <input className="input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="mt-4 block text-sm text-forest-mid">
          Password
          <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <button className="btn-gold mt-6 w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
