"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";


function getImageUrl(image) {
  if (!image || typeof image !== "string" || !image.trim()) return "/logo.jpeg";
  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/")) {
    return image;
  }
  return `/${image}`;
}

export default function Footer() {
  const [settings, setSettings] =
    useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await api("/api/settings");

        console.log("FOOTER SETTINGS:", data);

        setSettings(data);
      } catch (error) {
        console.error(
          "Failed to load footer settings:",
          error
        );
      }
    }

    loadSettings();
  }, []);

  const logo = getImageUrl(settings?.logo);

  const siteName =
    settings?.siteName || "MummaMove";

  const tagline =
    settings?.tagline ||
    "MummaMove";

  return (
    <footer className="border-t border-forest/10 bg-cream">
      <div className="mx-auto max-w-[1500px] px-6 py-14 lg:px-10 xl:px-14">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* ================= LOGO ================= */}

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-4"
            >
              <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full ring-1 ring-gold/30">
                <Image
                  src={logo}
                  alt={siteName}
                  fill
                  sizes="72px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div>
                <p className="font-serif text-[25px] font-medium tracking-wide text-forest">
                  {siteName}
                </p>

                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] sm:tracking-[0.2em] text-forest-leaf">
                  {tagline}
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-forest-leaf">
              Move better. Feel better. Live healthier
              with mindful yoga and movement practices.
            </p>
          </div>

          {/* ================= QUICK LINKS ================= */}

          <div>
            <h3 className="mb-5 font-serif text-lg font-semibold text-forest">
              Quick Links
            </h3>

            <div className="space-y-3">
              <Link
                href="/"
                className="block text-sm text-forest-leaf transition hover:text-gold"
              >
                Home
              </Link>

              <Link
                href="/about"
                className="block text-sm text-forest-leaf transition hover:text-gold"
              >
                About
              </Link>

              <Link
                href="/yoga/prenatal"
                className="block text-sm text-forest-leaf transition hover:text-gold"
              >
                Programs
              </Link>

              <Link
                href="/blog"
                className="block text-sm text-forest-leaf transition hover:text-gold"
              >
                Blogs
              </Link>

              <Link
                href="/contact"
                className="block text-sm text-forest-leaf transition hover:text-gold"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* ================= PROGRAMS ================= */}

          <div>
            <h3 className="mb-5 font-serif text-lg font-semibold text-forest">
              Yoga
            </h3>

            <div className="space-y-3">
              <Link
                href="/yoga"
                className="block text-sm text-forest-leaf transition hover:text-gold"
              >
                Yoga Classes
              </Link>

              <Link
                href="/programs"
                className="block text-sm text-forest-leaf transition hover:text-gold"
              >
                Programs
              </Link>

              <Link
                href="/book-demo"
                className="block text-sm text-forest-leaf transition hover:text-gold"
              >
                Book a Free Demo
              </Link>
            </div>
          </div>

          {/* ================= CONTACT ================= */}

          <div>
            <h3 className="mb-5 font-serif text-lg font-semibold text-forest">
              Contact
            </h3>

            <div className="space-y-3 text-sm text-forest-leaf">
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="block transition hover:text-gold"
                >
                  {settings.email}
                </a>
              )}

              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="block transition hover:text-gold"
                >
                  {settings.phone}
                </a>
              )}

              {settings?.address && (
                <p className="leading-6">
                  {settings.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}

        <div className="mt-12 flex flex-col gap-4 border-t border-forest/10 pt-6 text-sm text-forest-leaf md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteName}.
            All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link
              href="/privacy-policy"
              className="transition hover:text-gold"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-gold"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}