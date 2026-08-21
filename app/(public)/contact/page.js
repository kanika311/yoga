import { Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";
import { PHOTOS, SITE } from "@/lib/constants";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        image={PHOTOS.stones}
        eyebrow="Contact"
        title="Leave us a message"
        subtitle="Share your details for a consultation. We will match you with the right teacher and a plan that fits your time zone."
      />
      <section className="section grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-forest p-8 text-cream md:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-gold-soft">Studio</p>
          <h2 className="mt-2 font-serif text-4xl">MummaMove</h2>
          <ul className="mt-8 space-y-5 text-cream/85">
            <li className="flex gap-3"><MapPin className="text-gold" />{SITE.address}</li>
            <li className="flex gap-3"><Mail className="text-gold" /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li className="flex gap-3"><Phone className="text-gold" /><a href={`tel:+91${SITE.phoneRaw}`}>{SITE.phone}</a></li>
          </ul>
          <p className="mt-10 text-sm text-cream/70">Online sessions by appointment · 15+ time zones</p>
        </div>
        <InquiryForm type="contact" />
      </section>
    </>
  );
}
