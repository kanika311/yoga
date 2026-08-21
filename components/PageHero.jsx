import Image from "next/image";
import Link from "next/link";

export default function PageHero({ image, eyebrow, title, subtitle, cta }) {
  return (
    <section className="relative isolate flex min-h-[72vh] items-end overflow-hidden">
      <Image src={image} alt="" fill priority className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest/55 to-forest/20" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-36 md:px-8 md:pb-24">
        {eyebrow && <p className="text-xs uppercase tracking-[0.32em] text-gold-soft">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl font-serif text-4xl text-cream md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-5 max-w-2xl text-lg text-cream/85">{subtitle}</p>}
        {cta && (
          <Link href={cta.href} className="btn-gold mt-8">
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
