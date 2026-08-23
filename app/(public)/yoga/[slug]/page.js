import { notFound } from "next/navigation";
import ProgramPage from "@/components/ProgramPage";
import { getProgramBySlug, getFAQs } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return { title: "Program Not Found | MummaMove" };

  return {
    title: `${program.title} | MummaMove`,
    description: program.excerpt || program.subtitle || program.description?.slice(0, 150),
    openGraph: {
      title: program.title,
      description: program.excerpt || program.subtitle,
      images: program.image ? [{ url: program.image }] : [],
    },
  };
}

export default async function DynamicProgramPage({ params }) {
  const { slug } = await params;
  const [program, faqs] = await Promise.all([
    getProgramBySlug(slug),
    getFAQs([]),
  ]);

  if (!program) {
    notFound();
  }

  return <ProgramPage program={program} faqs={faqs} />;
}
