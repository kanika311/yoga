"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

import { NAV } from "@/lib/constants";
import { api } from "@/lib/api";


function getImageUrl(image) {
  if (!image || typeof image !== "string" || !image.trim()) return "/logo.jpeg";
  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/")) {
    return image;
  }
  return `/${image}`;
}                                                             

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [yogaOpen, setYogaOpen] = useState(false);
  const [settings, setSettings] = useState(null);  
  const [programsList, setProgramsList] = useState([]);

  // ---------------------------------------------
  // Load CMS settings and Programs
  // ---------------------------------------------

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsData, programsData] = await Promise.all([
          api("/api/settings").catch(() => null),
          api("/api/programs").catch(() => []),
        ]);

        if (settingsData) setSettings(settingsData);
        if (Array.isArray(programsData) && programsData.length > 0) {
          setProgramsList(programsData);
        }
      } catch (error) {
        console.error("Failed to load header data:", error);
      }
    }

    loadData();
  }, []);

  // ---------------------------------------------
  // Scroll effect
  // ---------------------------------------------

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // ---------------------------------------------
  // CMS data
  // ---------------------------------------------

  const logo = getImageUrl(settings?.logo);

  const siteName =
    settings?.siteName || "MummaMove";

  const tagline =
    settings?.tagline ||
    "MummaMove";

  const headerBackground =
    scrolled || open
      ? "bg-cream/95 shadow-sm backdrop-blur-md"
      : "bg-cream/95";

  // Dynamic nav items including custom programs
  const navItems = NAV.map((item) => {
    if (item.label === "Yoga" && programsList.length > 0) {
      return {
        ...item,
        children: programsList.map((p) => ({
          href: `/yoga/${p.slug}`,
          label: p.title,
        })),
      };
    }
    return item;
  });

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-forest/10 transition-all duration-300 ${headerBackground}`}
    >
      <div className="mx-auto flex h-[80px] max-w-[1500px] items-center justify-between px-6 lg:px-10 xl:px-14">

        {/* ================= LEFT LOGO ================= */}

        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 sm:gap-4 max-w-[80vw] lg:max-w-none"
        >
          <div className="relative h-[56px] w-[56px] sm:h-[64px] sm:w-[64px] lg:h-[72px] lg:w-[72px] shrink-0 overflow-hidden rounded-full ring-1 ring-gold/30">
            <Image
              src={logo}
              alt={siteName}
              fill
              sizes="72px"
              className="object-cover"
              priority
              unoptimized
            />
          </div>

          <div className="flex flex-col justify-center min-w-0">
            <p className="font-serif text-[20px] sm:text-[23px] lg:text-[25px] font-medium tracking-wide text-forest leading-tight">
              {siteName}
            </p>

            <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] lg:text-[11px] font-medium uppercase tracking-[0.08em] sm:tracking-[0.16em] lg:tracking-[0.22em] text-forest-leaf whitespace-normal sm:whitespace-nowrap">
              {tagline}
            </p>
          </div>
        </Link>

        {/* ================= DESKTOP NAVIGATION ================= */}

        <nav className="hidden items-center gap-10 lg:flex">
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="group relative"
              >
                <button className="flex items-center gap-1.5 whitespace-nowrap text-[16px] font-medium text-forest transition hover:text-gold">
                  {item.label}

                  <ChevronDown
                    size={15}
                    strokeWidth={1.8}
                  />
                </button>

                <div className="invisible absolute left-0 top-full z-50 pt-5 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="min-w-[230px] rounded-xl border border-forest/10 bg-cream p-2 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-4 py-3 text-sm text-forest transition hover:bg-gold/10 hover:text-gold"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-[16px] font-medium text-forest transition hover:text-gold"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* ================= CTA ================= */}

        <div className="hidden shrink-0 lg:block">
          <Link
            href="/book-demo"
            className="flex min-h-[46px] min-w-[200px] items-center justify-center rounded-full bg-gold px-8 text-[16px] font-semibold text-forest transition hover:scale-[1.02] hover:shadow-lg"
          >
            Book a Free Demo
          </Link>
        </div>

        {/* ================= MOBILE BUTTON ================= */}

        <button
          onClick={() =>
            setOpen((value) => !value)
          }
          className="text-forest lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? (
            <X size={30} />
          ) : (
            <Menu size={30} />
          )}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}

      {open && (
        <div className="border-t border-forest/10 bg-cream px-6 py-5 lg:hidden">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="border-b border-forest/10 py-3"
            >
              {item.children ? (
                <>
                  <button
                    onClick={() =>
                      setYogaOpen(
                        (value) => !value
                      )
                    }
                    className="flex w-full items-center justify-between text-left text-base font-medium text-forest"
                  >
                    {item.label}

                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        yogaOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {yogaOpen && (
                    <div className="mt-3 space-y-1">
                      {item.children.map(
                        (child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => {
                              setOpen(false);
                              setYogaOpen(false);
                            }}
                            className="block rounded-lg px-4 py-2 text-sm text-forest-leaf hover:bg-gold/10"
                          >
                            {child.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() =>
                    setOpen(false)
                  }
                  className="block text-base font-medium text-forest"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          <Link
            href="/book-demo"
            onClick={() => setOpen(false)}
            className="mt-5 flex min-h-[55px] w-full items-center justify-center rounded-full bg-gold px-6 font-semibold text-forest"
          >
            Book a Free Demo
          </Link>
        </div>
      )}
    </header>
  );
}