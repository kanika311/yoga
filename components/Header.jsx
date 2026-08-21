"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { NAV } from "@/lib/constants";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [yogaOpen, setYogaOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        scrolled || open ? "bg-cream/95 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Mummy Move" width={56} height={56} className="h-12 w-12 rounded-full object-cover ring-1 ring-gold/40 md:h-14 md:w-14" />
          <div className="leading-tight">
            <p className={`font-serif text-lg md:text-xl ${scrolled || open ? "text-forest" : "text-cream"}`}>Mummy Move</p>
            <p className={`text-[10px] uppercase tracking-[0.22em] ${scrolled || open ? "text-forest-leaf" : "text-gold-soft"}`}>Yoga for a healthy life</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label} className="relative group">
                <button className={`flex items-center gap-1 text-sm tracking-wide ${scrolled ? "text-forest" : "text-cream"} group-hover:text-gold`}>
                  {item.label}
                  <ChevronDown size={14} />
                </button>
                <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
                  <div className="min-w-52 rounded-2xl bg-white p-2 shadow-soft">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="block rounded-xl px-4 py-2.5 text-sm text-forest hover:bg-cream">
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
                className={`text-sm tracking-wide transition hover:text-gold ${scrolled ? "text-forest" : "text-cream"}`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:block">
          <Link href="/book-demo" className="btn-gold">
            Book a Free Demo
          </Link>
        </div>

        <button className={`lg:hidden ${scrolled ? "text-forest" : "text-cream"}`} onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-forest/10 bg-cream px-5 py-4 lg:hidden">
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-forest/5 py-2">
              {item.children ? (
                <>
                  <button className="flex w-full items-center justify-between text-forest" onClick={() => setYogaOpen((v) => !v)}>
                    {item.label}
                    <ChevronDown size={16} className={yogaOpen ? "rotate-180" : ""} />
                  </button>
                  {yogaOpen &&
                    item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="block py-2 pl-3 text-sm text-forest-mid" onClick={() => setOpen(false)}>
                        {child.label}
                      </Link>
                    ))}
                </>
              ) : (
                <Link href={item.href} className="block text-forest" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <Link href="/book-demo" className="btn-gold mt-4 w-full" onClick={() => setOpen(false)}>
            Book a Free Demo
          </Link>
        </div>
      )}
    </header>
  );
}
