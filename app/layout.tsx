import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";
import { Analytics } from "@/components/Analytics";
import { TrackingListener } from "@/components/TrackingListener";
import { ScrollReveal } from "@/components/ScrollReveal";
import { JsonLd } from "@/components/JsonLd";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Estação de Açaí para Eventos no RJ | Recanto do Açaí",
  description:
    "Estação de açaí e sorvete gourmet servida na hora pela nossa equipe — para casamentos, 15 anos, aniversários e qualquer celebração no Rio. Peça seu orçamento no WhatsApp.",
  keywords: [
    "açaí para eventos",
    "estação de açaí",
    "açaí para casamento",
    "buffet de açaí RJ",
    "açaí para festa",
    "sorvete para eventos",
    "açaí Zona Norte RJ",
    "Guadalupe",
    "Marechal Hermes",
  ],
  authors: [{ name: "Recanto do Açaí" }],
  openGraph: {
    title: "Recanto do Açaí · Estações — Açaí & Sorvete Gourmet para Eventos",
    description:
      "A estação que vira o ponto alto da sua festa. Açaí e sorvete premium servidos na hora pela nossa equipe.",
    url: site.url,
    siteName: "Recanto do Açaí · Estações",
    locale: "pt_BR",
    type: "website",
    // og:image (1200×630) é gerado por app/opengraph-image.tsx.
  },
  twitter: {
    card: "summary_large_image",
    title: "Recanto do Açaí · Estações",
    description: "Açaí & sorvete gourmet para eventos no Rio de Janeiro.",
    // twitter:image é gerado por app/twitter-image.tsx.
  },
  alternates: { canonical: site.url },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#7c1fd6",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${outfit.variable} antialiased`}>
      <body className="min-h-screen bg-bg text-ink overflow-x-hidden">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K5DK33L3"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
        <JsonLd />
        <Analytics />
        <TrackingListener />
        <ScrollReveal />
      </body>
    </html>
  );
}
