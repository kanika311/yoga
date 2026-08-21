import ProgramPage from "@/components/ProgramPage";
import { apiSafe } from "@/lib/api";
import { PHOTOS } from "@/lib/constants";

export const metadata = { title: "Prenatal Yoga" };

const FALLBACK = {
  slug: "prenatal",
  title: "Pregnancy Care Program",
  subtitle: "Prepare your body and mind for pregnancy, labor and beyond",
  description:
    "Personalized care with prenatal yoga, diet and lifestyle counseling, plus childbirth and lactation prep. Because each pregnancy is unique, sessions consider your body, health background and particular requirements. During labor we stay in touch with you or your partner.",
  image: PHOTOS.prenatal,
  highlights: [
    "Free consultation",
    "Personal teacher and dietitian",
    "Labor and lactation preparation",
    "Couples labor readiness",
    "Support across 15 countries",
  ],
  benefits: [
    "Reduced pregnancy complications and anxiety",
    "Better chances of a normal delivery",
    "Optimal baby birth position",
    "Increased physical stamina",
    "Preparation for postpartum recovery",
    "Lower potential risk for you and your baby",
  ],
  focusAreas: [
    "Trimester 2: flexibility, balance, pelvic floor, back pain, circulation",
    "Trimester 3: childbirth prep, stamina, ideal baby position, labor readiness",
  ],
};

export default async function PrenatalPage() {
  const [program, faqs] = await Promise.all([
    apiSafe("/api/programs/prenatal", FALLBACK),
    apiSafe("/api/faqs", []),
  ]);
  return <ProgramPage program={{ ...FALLBACK, ...program }} faqs={faqs} />;
}
