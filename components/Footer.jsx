import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-forest-deep text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 md:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Heal-In Sutras" width={52} height={52} className="h-12 w-12 rounded-full object-cover" />
            <div>
              <p className="font-serif text-2xl">Heal-In Sutras</p>
              <p className="font-script text-gold">Yoga for a healthy life</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream/75">
            Online yoga led by experts, customized for moms-to-be, new mamas, and healing needs — from the comfort of home.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-xl">Yoga Studio</h3>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link href="/yoga/prenatal" className="hover:text-gold">Pregnancy Care Program</Link></li>
            <li><Link href="/yoga/fertility" className="hover:text-gold">Fertility Rebalance Program</Link></li>
            <li><Link href="/yoga/postnatal" className="hover:text-gold">Postnatal Recovery Program</Link></li>
            <li><Link href="/yoga/prenatal" className="hover:text-gold">First · Second · Third trimester yoga</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-xl">Explore</h3>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link href="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-gold">Journal</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link href="/book-demo" className="hover:text-gold">Book a Free Demo</Link></li>
            <li><Link href="/admin-yoga" className="hover:text-gold">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-xl">Contact</h3>
          <ul className="space-y-3 text-sm text-cream/80">
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 text-gold" /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li className="flex gap-2"><Phone size={16} className="mt-0.5 text-gold" /><a href={`tel:+91${SITE.phoneRaw}`}>{SITE.phone}</a></li>
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 text-gold" />{SITE.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-cream/50">
        Copyright © {new Date().getFullYear()} healinsutras.com · All rights reserved
      </div>
    </footer>
  );
}
