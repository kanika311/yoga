import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { PHOTOS } from "@/lib/constants";
import { apiSafe } from "@/lib/api";

export const metadata = { title: "About Us" };

export default async function AboutPage() {
  const settings = await apiSafe("/api/settings", {});

  return (
    <>
      <PageHero
        image={PHOTOS.studio}
        eyebrow="Our story"
        title="MummaMove's trump card"
        subtitle="Certified experts, a rigorous selection process, and programs designed around the individual — not a packed studio."
        cta={{ href: "/book-demo", label: "Free Consultation" }}
      />

      <section className="section grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <Image
            src={settings.founderImage || PHOTOS.founder}
            alt={settings.founderName || "Priya Sharma"}
            fill
            className="object-cover"
            sizes="(min-width:1024px) 40vw, 100vw"
          />
        </div>
        <div>
          <p className="eyebrow">Holistic wellness expertise</p>
          <h2 className="display">{settings.founderName || "Priya Sharma"}</h2>
          <p className="mt-5 leading-relaxed text-forest-mid">
            {settings.founderBio ||
              "Priya Sharma is a multifaceted expert in naturopathy, yoga, nutrition, and alternative therapies. She offers personalized guidance in diet and lifestyle changes. Together with her team, she has trained a diverse clientele worldwide in prenatal, postnatal, and fertility yoga."}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["Global experience", "Prenatal, postnatal and fertility training for clients worldwide."],
              ["Quality assurance", "Experts selected through a rigorous process for skill and dedication."],
              ["Industry recognition", "Known for custom therapeutic programs, not generic classes."],
              ["All-inclusive care", "Teacher, dietitian, lifestyle, lactation and labor support."],
            ].map(([t, b]) => (
              <div key={t} className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="font-serif text-xl text-forest">{t}</h3>
                <p className="mt-1 text-sm text-forest-mid">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="section grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">The MummaMove advantage</p>
            <h2 className="display">Passionate care, reflected in every session</h2>
            <p className="mt-5 leading-relaxed text-forest-mid">
              {settings.about ||
                "MummaMove is an online yoga training platform for prenatal, postnatal and therapeutic yoga. Customized sessions integrate diet plans and lifestyle changes as per each client's body and health needs. Follow-up programs keep wellbeing on track. We are not just another class you may come across online."}
            </p>
            <Link href="/book-demo" className="btn-forest mt-8">
              Free trial class
            </Link>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem]">
            <Image src={PHOTOS.nature} alt="Sunlight through forest leaves" fill className="object-cover" sizes="50vw" />
          </div>
        </div>
      </section>

      <CTABand title="Start with a free trial class" />
    </>
  );
}
