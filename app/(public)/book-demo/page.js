import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";
import { PHOTOS } from "@/lib/constants";

export const metadata = { title: "Book a Free Demo" };

export default function BookDemoPage() {
  return (
    <>
      <PageHero
        image={PHOTOS.meditation}
        eyebrow="Complimentary"
        title="Book your free demo class"
        subtitle="Tell us about your health, trimester or fertility goals. We will arrange a free session so you can feel the Heal-In Sutras approach first-hand."
      />
      <section className="section grid items-start gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">How it works</p>
          <h2 className="display">Three simple steps</h2>
          <ol className="mt-8 space-y-6">
            {[
              ["Share your story", "Health status, body type, time zone and any ailments — so we can prepare."],
              ["Meet your teacher", "A complimentary demo, customized rather than a generic group class."],
              ["Begin your program", "Prenatal, fertility or postnatal care with diet and lifestyle support."],
            ].map(([t, b], i) => (
              <li key={t} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold font-serif text-lg text-forest-deep">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-serif text-2xl text-forest">{t}</h3>
                  <p className="text-sm text-forest-mid">{b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <InquiryForm type="demo" />
      </section>
    </>
  );
}
