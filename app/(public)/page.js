import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, Leaf, Target, Star } from "lucide-react";
import { apiSafe } from "@/lib/api";
import { INCLUSIONS, PHOTOS } from "@/lib/constants";
import FAQList from "@/components/FAQList";
import CTABand from "@/components/CTABand";

const FALLBACK_PROGRAMS = [
  {
    slug: "prenatal",
    title: "Pregnancy Care Program",
    excerpt:
      "Customized sessions from first to third trimester, with diet, lifestyle, childbirth and lactation prep.",
    image: PHOTOS.prenatal,
  },
  {
    slug: "fertility",
    title: "Fertility Rebalance Program",
    excerpt:
      "Pelvic circulation, hormonal balance, fertility boosters and stress relief through yoga and counseling.",
    image: PHOTOS.fertility,
  },
  {
    slug: "postnatal",
    title: "Postnatal Recovery Program",
    excerpt:
      "Restore tissues, core and mood after baby with yoga, nutrition and sessions that fit your schedule.",
    image: PHOTOS.postnatal,
  },
];

export const metadata = {
  title: "Holistic Wellness Journey",
};

export default async function HomePage() {
  const [programs, faqs, testimonials] = await Promise.all([
    apiSafe("/api/programs", FALLBACK_PROGRAMS),
    apiSafe("/api/faqs", []),
    apiSafe("/api/testimonials", []),
  ]);

  return (
    <>
      <section className="relative isolate min-h-screen overflow-hidden">
        <Image src={PHOTOS.hero} alt="Woman in a grounded yoga pose" fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/90 via-forest/70 to-forest/25" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pb-20 pt-32 md:px-8">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <Image src="/logo.png" alt="" width={88} height={88} className="h-20 w-20 rounded-full object-cover ring-2 ring-gold/60 md:h-24 md:w-24" />
              <p className="font-script text-4xl text-gold-soft md:text-5xl">Yoga for a healthy life</p>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold-soft">Fertility · Prenatal · Postnatal</p>
            <h1 className="mt-4 font-serif text-5xl leading-[0.95] text-cream md:text-7xl">
              Holistic
              <br />
              Wellness Journey
            </h1>
            <p className="mt-6 max-w-lg text-lg text-cream/85">
              Holistic healing, tailored to you. Personal trainers, dietitians and birthing experts — online, across 15 countries.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book-demo" className="btn-gold">Free Consultation</Link>
              <Link href="/yoga/prenatal" className="btn-outline">Explore Programs</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-forest-deep">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-center text-cream md:grid-cols-4 md:px-8">
          {[
            ["15+", "Countries served"],
            ["1:1", "Personal teachers"],
            ["Free", "Demo session"],
            ["Holistic", "Yoga + diet + lifestyle"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="font-serif text-4xl text-gold-soft">{n}</p>
              <p className="mt-1 text-sm text-cream/70">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Tailored wellness</p>
        <h2 className="display max-w-3xl">Personal trainers and a holistic approach for your unique body</h2>
        <p className="mt-5 max-w-2xl text-forest-mid">
          Given the uniqueness of you and your health needs, a tailored solution is essential. Sessions are customized to health status, body type and history of ailments — then refined as you progress.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: "Tailored Program", body: "Sessions customized to your health status, body type and history of any ailments." },
            { icon: Leaf, title: "Holistic Approach", body: "Yoga plus consultation on diet, lifestyle, labor and lactation." },
            { icon: HeartHandshake, title: "End Goal", body: "Designed around problem areas for effective results that address the root cause." },
          ].map((item) => (
            <div key={item.title} className="rounded-[1.75rem] bg-white p-8 shadow-soft">
              <item.icon className="text-gold" />
              <h3 className="mt-4 font-serif text-2xl text-forest">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-forest-mid">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="section">
          <div className="gold-rule mb-8">
            <span className="leaf-mark" />
          </div>
          <p className="eyebrow">Programs</p>
          <h2 className="display mb-12">Transforming lives through tailored wellness</h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {programs.map((p) => (
              <Link key={p.slug} href={`/yoga/${p.slug}`} className="group card">
                <div className="relative h-72">
                  <Image src={p.image} alt={p.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width:1024px) 30vw, 100vw" />
                </div>
                <div className="p-7">
                  <h3 className="font-serif text-3xl text-forest">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-forest-mid">{p.excerpt}</p>
                  <span className="mt-5 inline-block text-sm font-medium text-gold-deep">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[420px]">
            <Image src={PHOTOS.studio} alt="Bright yoga practice in natural light" fill className="object-cover" sizes="50vw" />
          </div>
          <div className="flex items-center bg-forest px-8 py-16 text-cream md:px-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold-soft">The Mummy Move difference</p>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl">Not another generic maternity class</h2>
              <p className="mt-5 leading-relaxed text-cream/80">
                Certified teachers, naturopaths, dietitians and birthing experts work together. We match you with the right trainer, design a session around your body, and stay with you through labor, lactation and recovery.
              </p>
              <Link href="/about" className="btn-gold mt-8">Meet the studio</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Every step, every tear, every smile</p>
        <h2 className="display mb-10">Our holistic embrace</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INCLUSIONS.map((inc) => (
            <div key={inc.title} className="rounded-3xl border border-forest/10 bg-white p-6">
              <h3 className="font-serif text-2xl text-forest">{inc.title}</h3>
              <p className="mt-2 text-sm text-forest-mid">{inc.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4">
        {[PHOTOS.gallery1, PHOTOS.gallery2, PHOTOS.gallery3, PHOTOS.gallery4].map((src, i) => (
          <div key={src} className="relative h-48 md:h-72">
            <Image src={src} alt={`Mummy Move practice ${i + 1}`} fill className="object-cover" sizes="25vw" />
          </div>  
        ))}
      </section>

      {testimonials.length > 0 && (
        <section className="bg-white">
          <div className="section">
            <p className="eyebrow">Client voices</p>
            <h2 className="display mb-10">Trusted across 15 nations</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <blockquote key={t._id || t.name} className="rounded-[1.75rem] bg-cream p-7">
                  <div className="mb-3 flex gap-1 text-gold">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="font-serif text-xl leading-relaxed text-forest">“{t.quote}”</p>
                  <footer className="mt-5 flex items-center gap-3">
                    {t.image && (
                      <Image src={t.image} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                    )}
                    <div>
                      <p className="font-medium text-forest">{t.name}</p>
                      <p className="text-xs text-forest-leaf">{t.role}</p>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="section max-w-4xl">
          <p className="eyebrow">FAQ</p>
          <h2 className="display mb-8">More details about the sessions</h2>
          <FAQList items={faqs} />
        </section>
      )}

      <CTABand />
    </>
  );
}
