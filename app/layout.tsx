import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Great_Vibes } from "next/font/google";
import Script from "next/script";
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

export const metadata: Metadata = {
  title: {
    default: "MummaMove | Prenatal, Postnatal & Fertility Yoga",
    template: "%s | MummaMove",
  },
  description:
    "Personalized online yoga for prenatal, postnatal and fertility care. Diet, lifestyle, labor and lactation support from certified experts.",
  icons: { icon: "/logo.jpeg" },
  verification: {
    google: "XtUvcB69Z-ZoVdqYr_Mc833dtysRXs1G0XjyKkQvw1M",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} ${vibes.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans" suppressHydrationWarning>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3NCPBCL0K6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-3NCPBCL0K6');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
