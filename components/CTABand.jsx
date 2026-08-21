import Link from "next/link";

export default function CTABand({
  title = "Begin with a complimentary demo",
  body = "Tell us about your health, trimester or fertility goals. We will match you with a teacher and a plan.",
}) {
  return (
    <section className="relative overflow-hidden bg-forest">
      <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
      <div className="section relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="eyebrow text-gold-soft">Heal-In Sutras</p>
          <h2 className="font-serif text-4xl text-cream md:text-5xl">{title}</h2>
          <p className="mt-4 max-w-xl text-cream/80">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/book-demo" className="btn-gold">Book a Free Demo</Link>
          <Link href="/contact" className="btn-outline">Leave a Message</Link>
        </div>
      </div>
    </section>
  );
}
