import ProgramPage from "@/components/ProgramPage";
import { apiSafe } from "@/lib/api";
import { PHOTOS } from "@/lib/constants";

export const metadata = { title: "Postnatal Yoga" };

const FALLBACK = {
  slug: "postnatal",
  title: "Postnatal Recovery Program",
  subtitle: "Elevate your postpartum experience — mind, body and soul",
  description:
    "We understand the unique challenges and joys of motherhood. One-on-one online sessions support you physically, emotionally and mentally, blending yoga with lifestyle adjustments, dietary guidance, lactation support and baby-growth advice. Choose times that work with your baby's schedule.",
  image: PHOTOS.postnatal,
  highlights: [
    "One-on-one on your schedule",
    "Pelvic floor and core restoration",
    "Lactation and baby support",
    "Nutrition coaching",
    "Serving 15 countries",
  ],
  benefits: [
    "Strengthening of the pelvic floor",
    "Toning and weight management",
    "Helps knit back separated abdominal muscles",
    "Addresses specific pregnancy-related issues",
    "Reduction of postnatal anxiety and depression",
    "Promotes hormonal balance",
  ],
  focusAreas: [
    "Core strength and stability",
    "Pelvic floor health",
    "Posture correction",
    "Stress relief and relaxation",
    "Bonding and energy restoration",
  ],
};

import { getProgramBySlug, getFAQs } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PostnatalPage() {
  const [program, faqs] = await Promise.all([
    getProgramBySlug("postnatal", FALLBACK),
    getFAQs([]),
  ]);
  return <ProgramPage program={{ ...FALLBACK, ...program }} faqs={faqs} />;
}
