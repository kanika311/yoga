import Image from "next/image";
import Link from "next/link";

import {
  Mail,
  MapPin,
  Phone,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";

export default async function Footer() {
  await connectDB();

  const settings =
    await Settings.findOne().lean();

  /**
   * BASIC INFORMATION
   */

  const siteName =
    settings?.siteName ||
    "MummaMove";

  const tagline =
    settings?.tagline ||
    "Yoga for a healthy life";

  const email =
    settings?.email || "";

  const phone =
    settings?.phone || "";

  const whatsapp =
    settings?.whatsapp || "";

  const address =
    settings?.address || "";

  /**
   * LOGO
   */

  const logo =
    settings?.logo ||
    "/logo.png";

  /**
   * SOCIAL LINKS
   */

  const instagram =
    settings?.social?.instagram ||
    "";

  const linkedin =
    settings?.social?.linkedin ||
    "";

  const youtube =
    settings?.social?.youtube ||
    "";

  /**
   * Convert WhatsApp number
   *
   * Example:
   *
   * +91 98765 43210
   *
   * becomes:
   *
   * 919876543210
   */

  const whatsappNumber =
    whatsapp.replace(/\D/g, "");

  const whatsappUrl =
    whatsappNumber
      ? `https://wa.me/${whatsappNumber}`
      : "";

  return (
    <footer className="bg-forest-deep text-cream">

      {/* ==================================================
          FOOTER CONTENT
      ================================================== */}

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 md:px-8">


        {/* ==================================================
            BRAND
        ================================================== */}

        <div>

          <div className="flex items-center gap-3">

            {/* LOGO */}

            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">

              <Image
                src={logo}
                alt={siteName}
                fill
                className="object-cover"
                unoptimized
              />

            </div>


            {/* NAME */}

            <div>

              <p className="font-serif text-2xl">
                {siteName}
              </p>

              <p className="font-script text-gold">
                {tagline}
              </p>

            </div>

          </div>


          {/* DESCRIPTION */}

          <p className="mt-4 text-sm leading-relaxed text-cream/75">
            Online yoga led by experts,
            customized for moms-to-be,
            new mamas, and healing needs —
            from the comfort of home.
          </p>


          {/* ==================================================
              SOCIAL ICONS
          ================================================== */}

          <div className="mt-6">

            <p className="mb-3 text-sm font-medium">
              Follow Us
            </p>


            <div className="flex items-center gap-3">


              {/* INSTAGRAM */}

              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition duration-200 hover:border-gold hover:bg-gold hover:text-forest-deep"
                >
                  <Instagram size={18} />
                </a>
              )}


              {/* LINKEDIN */}

              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition duration-200 hover:border-gold hover:bg-gold hover:text-forest-deep"
                >
                  <Linkedin size={18} />
                </a>
              )}


              {/* YOUTUBE */}

              {youtube && (
                <a
                  href={youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition duration-200 hover:border-gold hover:bg-gold hover:text-forest-deep"
                >
                  <Youtube size={18} />
                </a>
              )}


              {/* WHATSAPP */}

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition duration-200 hover:border-gold hover:bg-gold hover:text-forest-deep"
                >
                  <MessageCircle size={18} />
                </a>
              )}

            </div>

          </div>

        </div>


        {/* ==================================================
            YOGA STUDIO
        ================================================== */}

        <div>

          <h3 className="mb-4 font-serif text-xl">
            Yoga Studio
          </h3>

          <ul className="space-y-2 text-sm text-cream/80">

            <li>
              <Link
                href="/yoga/prenatal"
                className="transition hover:text-gold"
              >
                Pregnancy Care Program
              </Link>
            </li>

            <li>
              <Link
                href="/yoga/fertility"
                className="transition hover:text-gold"
              >
                Fertility Rebalance Program
              </Link>
            </li>

            <li>
              <Link
                href="/yoga/postnatal"
                className="transition hover:text-gold"
              >
                Postnatal Recovery Program
              </Link>
            </li>

            <li>
              <Link
                href="/yoga/prenatal"
                className="transition hover:text-gold"
              >
                First · Second · Third trimester yoga
              </Link>
            </li>

          </ul>

        </div>


        {/* ==================================================
            EXPLORE
        ================================================== */}

        <div>

          <h3 className="mb-4 font-serif text-xl">
            Explore
          </h3>

          <ul className="space-y-2 text-sm text-cream/80">

            <li>
              <Link
                href="/about"
                className="transition hover:text-gold"
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                href="/blog"
                className="transition hover:text-gold"
              >
                Blogs
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className="transition hover:text-gold"
              >
                Contact
              </Link>
            </li>

            <li>
              <Link
                href="/book-demo"
                className="transition hover:text-gold"
              >
                Book a Free Demo
              </Link>
            </li>

          </ul>

        </div>


        {/* ==================================================
            CONTACT
        ================================================== */}

        <div>

          <h3 className="mb-4 font-serif text-xl">
            Contact
          </h3>


          <ul className="space-y-3 text-sm text-cream/80">


            {/* EMAIL */}

            {email && (
              <li className="flex gap-2">

                <Mail
                  size={16}
                  className="mt-0.5 shrink-0 text-gold"
                />

                <a
                  href={`mailto:${email}`}
                  className="break-all transition hover:text-gold"
                >
                  {email}
                </a>

              </li>
            )}


            {/* PHONE */}

            {phone && (
              <li className="flex gap-2">

                <Phone
                  size={16}
                  className="mt-0.5 shrink-0 text-gold"
                />

                <a
                  href={`tel:${phone.replace(
                    /\s/g,
                    ""
                  )}`}
                  className="transition hover:text-gold"
                >
                  {phone}
                </a>

              </li>
            )}


            {/* WHATSAPP */}

            {whatsappUrl && (
              <li className="flex gap-2">

                <MessageCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-gold"
                />

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-gold"
                >
                  WhatsApp
                </a>

              </li>
            )}


            {/* ADDRESS */}

            {address && (
              <li className="flex gap-2">

                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-gold"
                />

                <span>
                  {address}
                </span>

              </li>
            )}

          </ul>

        </div>

      </div>


      {/* ==================================================
          COPYRIGHT
      ================================================== */}

      <div className="border-t border-white/10 py-5 text-center text-xs text-cream/50">

        Copyright ©{" "}
        {new Date().getFullYear()}{" "}
        {siteName} · All rights reserved

      </div>

    </footer>
  );
}