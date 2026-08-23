"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Dumbbell,
  Inbox,
  HelpCircle,
  Quote,
  Settings,
  LogOut,
} from "lucide-react";
import Guard from "@/components/admin/Guard";
import { useAuth } from "@/hooks/useAuth";

const LINKS = [
  { href: "/admin-yoga", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin-yoga/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin-yoga/programs", label: "Programs", icon: Dumbbell },
  { href: "/admin-yoga/blogs", label: "Blogs", icon: BookOpen },
  { href: "/admin-yoga/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin-yoga/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin-yoga/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({ children }) {
  const path = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/admin-yoga/login");
  }

  return (
    <Guard>
      <div className="flex min-h-screen bg-cream">
        <aside className="hidden w-64 shrink-0 flex-col bg-forest-deep text-cream md:flex">
          <Link href="/admin-yoga" className="flex items-center gap-3 px-5 py-6">
            <Image src="/logo.jpeg" alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="font-serif text-lg">MummaMove CMS</p>
            </div>
          </Link>
          <nav className="flex-1 space-y-1 px-3">
            {LINKS.map((link) => {
              const active = path === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                    active ? "bg-gold text-forest-deep" : "text-cream/80 hover:bg-white/10"
                  }`}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/10 p-4">
            {user && (
              <div className="mb-3 px-2">
                <p className="truncate text-xs font-semibold text-gold">{user.name || "Admin"}</p>
                <p className="truncate text-[11px] text-cream/60">{user.email}</p>
              </div>
            )}
            <Link href="/" className="mb-2 block px-2 text-xs text-cream/50 hover:text-gold">
              View website →
            </Link>
            <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-cream/80 hover:bg-white/10">
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-forest/10 bg-white px-5 py-4 md:hidden">
            <p className="font-serif text-lg text-forest">CMS</p>
            <button onClick={handleLogout} className="text-sm text-forest-mid">
              Sign out
            </button>
          </header>
          <nav className="flex gap-2 overflow-x-auto border-b border-forest/10 bg-white px-3 py-2 md:hidden">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="whitespace-nowrap rounded-full bg-cream px-3 py-1 text-xs text-forest">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex-1 p-5 md:p-8">{children}</div>
        </div>
      </div>
    </Guard>
  );
}
