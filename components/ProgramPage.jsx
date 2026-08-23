import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import FAQList from "@/components/FAQList";
import CTABand from "@/components/CTABand";
import { INCLUSIONS } from "@/lib/constants";

export default function ProgramPage({ program, faqs }) {
  return (
    <>
      <PageHero
        image={program.image}
        eyebrow="MummaMove"
        title={program.title}
        subtitle={program.subtitle}
        cta={{ href: "/book-demo", label: "Book a Free Demo" }}
      />

      <section className="section grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Personalized online care</p>
          <h2 className="display">{program.subtitle}</h2>
          <p className="mt-5 text-forest-mid leading-relaxed">{program.description}</p>
          <Link href="/book-demo" className="btn-forest mt-8">
            Book my 1 free class
          </Link>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <Image src={program.image} alt={program.title} fill className="object-cover" sizes="(min-width:1024px) 40vw, 100vw" />
        </div>
      </section>

      <section className="bg-white">
        <div className="section">
          <p className="eyebrow">What you receive</p>
          <h2 className="display mb-10">Every step, every smile</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(program.highlights || []).map((item) => (
              <div key={item} className="rounded-3xl border border-forest/10 bg-cream p-6">
                <Check className="text-gold" size={22} />
                <p className="mt-3 font-serif text-2xl text-forest">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Benefits</p>
          <h2 className="display mb-6">What clients can expect</h2>
          <ul className="space-y-3">
            {(program.benefits || []).map((b) => (
              <li key={b} className="flex gap-3 text-forest-mid">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[2rem] bg-forest p-8 text-cream md:p-12">
          <p className="text-xs uppercase tracking-[0.28em] text-gold-soft">Focus areas</p>
          <ul className="mt-6 space-y-4">
            {(program.focusAreas || []).map((f) => (
              <li key={f} className="border-b border-white/10 pb-4 font-serif text-2xl">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream-dark">
        <div className="section">
          <p className="eyebrow">Women embrace</p>
          <h2 className="display mb-10">Care beyond the mat</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {INCLUSIONS.map((inc) => (
              <div key={inc.title} className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="font-serif text-2xl text-forest">{inc.title}</h3>
                <p className="mt-2 text-sm text-forest-mid">{inc.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {faqs?.length > 0 && (
        <section className="section max-w-4xl">
          <p className="eyebrow">Questions</p>
          <h2 className="display mb-8">Frequently asked</h2>
          <FAQList items={faqs} />
        </section>
      )}

      <CTABand />
    </>
  );
}
