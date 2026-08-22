import ProgramPage from "@/components/ProgramPage";
import { apiSafe } from "@/lib/api";
import { PHOTOS } from "@/lib/constants";

export const metadata = { title: "Fertility Yoga" };

const FALLBACK = {
  slug: "fertility",
  title: "Fertility Rebalance Program",
  subtitle: "Naturally boost your reproductive health",
  description:
    "Personalized care with fertility yoga, stress management, pranayama, diet and lifestyle counseling. The program targets core fertility issues — including concerns related to ovulatory disorders, PCOS/PCOD and hormonal imbalance — by identifying root causes and building a plan around your body.",
  image: PHOTOS.fertility,
  highlights: [
    "Root-cause methodology",
    "Pranayama and meditation",
    "Dietitian-led nutrition",
    "Stress reduction",
    "Complimentary trial session",
  ],
  benefits: [
    "Reduced stress and anxiety",
    "Increased circulation to the pelvic area",
    "Weight management",
    "Focus on fertility boosters",
    "Hormonal balance",
    "Improved blood circulation",
  ],
  focusAreas: [
    "Personalized approach",
    "Holistic wellness",
    "Expert guidance",
    "Lifestyle optimization",
    "Education and empowerment",
  ],
};

import { getProgramBySlug, getFAQs } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function FertilityPage() {
  const [program, faqs] = await Promise.all([
    getProgramBySlug("fertility", FALLBACK),
    getFAQs([]),
  ]);
  return <ProgramPage program={{ ...FALLBACK, ...program }} faqs={faqs} />;
}
