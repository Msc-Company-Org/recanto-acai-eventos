import type { Metadata } from "next";
import { Lora, Outfit } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title:
    "Recanto do Açaí · Estações — Açaí & Sorvete Gourmet para Eventos | Zona Norte RJ",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Recanto do Açaí · Estações",
    description: "Açaí & sorvete gourmet para eventos no Rio de Janeiro.",
  },
  alternates: { canonical: site.url },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${lora.variable} ${outfit.variable} antialiased`}>
      <body className="min-h-screen bg-bg text-ink overflow-x-hidden">{children}</body>
    </html>
  );
}
