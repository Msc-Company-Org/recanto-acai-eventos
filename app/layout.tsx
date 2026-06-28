import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { SpeedInsights } from "@vercel/speed-insights/next";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  // Removidos axes SOFT e WONK — reduz ~35KB no arquivo de fonte
  axes: ["opsz"],
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
    "Estação de açaí e sorvete gourmet servida na hora. Reserve e garanta sua data online — pague em até 6x sem juros no cartão ou via Pix para casamentos, 15 anos e aniversários no RJ.",
  keywords: [
    "açaí para eventos",
    "estação de açaí",
    "açaí para casamento",
    "buffet de açaí RJ",
    "açaí para festa",
    "sorvete para eventos",
    "estação gourmet",
    "equipe especializada",
    "açaí Zona Norte RJ",
    "Guadalupe",
    "Marechal Hermes",
  ],
  authors: [{ name: "Recanto do Açaí" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
  manifest: "/manifest.webmanifest",
  verification: {
    google: [
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_2,
    ].filter(Boolean) as string[],
  },
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
        {/* Skip-link para usuários de teclado/screen reader (WCAG 2.4.1) */}
        <a href="#top" className="skip-link">Pular para o conteúdo principal</a>
        {/* Preconnect para reduzir latência de scripts externos */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload da imagem LCP do Hero — acelera o LCP em ~200ms */}
        <link
          rel="preload"
          as="image"
          href="/images/produtos/acai-cremoso-colher.jpg"
          fetchPriority="high"
        />
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
        <SpeedInsights />
      </body>
    </html>
  );
}
