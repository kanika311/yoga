import { Cormorant_Garamond, Outfit, Great_Vibes } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const vibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vibes",
});

export const metadata = {
  title: {
    default: "MummaMove | Prenatal, Fertility & Postnatal Yoga",
    template: "%s | Mumm Move",
  },
  description:
    "Personalized online yoga for fertility, prenatal and postnatal care. Diet, lifestyle, labor and lactation support from certified experts.",
  icons: { icon: "/logo.jpeg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable} ${vibes.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
