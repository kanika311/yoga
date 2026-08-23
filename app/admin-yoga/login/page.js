"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLogin() {
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();

  const [email, setEmail] = useState("admin@mummamove.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect automatically to admin dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/admin-yoga");
    }
  }, [user, authLoading, router]);

  async function onSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("Login response:", data);

      if (!data?.token || !data?.user) {
        throw new Error("Login successful but authentication data was not received.");
      }

      // Update Auth context and store token
      login(data.token, data.user);

      // Redirect to admin dashboard
      router.replace("/admin-yoga");
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest-deep px-5">
      <Image
        src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=2000&q=80"
        alt="Yoga background"
        fill
        priority
        className="object-cover opacity-30"
      />

      <div className="absolute inset-0 bg-black/20" />

      <form
        onSubmit={onSubmit}
        className="relative z-10 w-full max-w-md rounded-[2rem] bg-cream p-8 shadow-soft"
      >
        {/* Logo */}
        <div className="mb-6 flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt="Healinsutras"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />

          <div>
            <p className="font-serif text-2xl text-forest">
              Admin CMS
            </p>

            <p className="text-xs uppercase tracking-[0.22em] text-gold-deep">
              /admin-yoga
            </p>
          </div>
        </div>

        {/* Email */}
        <label className="block text-sm text-forest-mid">
          Email

          <input
            className="input mt-1 w-full"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@mummamove.com"
            required
          />
        </label>

        {/* Password */}
        <label className="mt-4 block text-sm text-forest-mid">
          Password

          <input
            className="input mt-1 w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </label>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Login button */}
        <button
          type="submit"
          className="btn-gold mt-6 w-full"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}