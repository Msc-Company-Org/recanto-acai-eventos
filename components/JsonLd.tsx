import { site, packages, faq } from "@/lib/content";

/**
 * Dados estruturados (schema.org) para rich results locais e de FAQ no Google.
 * - LocalBusiness/FoodEstablishment: nome, contato, área de atendimento, preços, redes.
 * - FAQPage: alimentado pelas perguntas reais da landing.
 */
export function JsonLd() {
  const telephone = `+${site.whatsapp}`;

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "FoodEstablishment"],
    "@id": `${site.url}/#business`,
    name: `${site.name} · ${site.brandTag}`,
    description:
      "Estação de açaí e sorvete gourmet servida na hora para casamentos, 15 anos, festas infantis e eventos corporativos no Rio de Janeiro.",
    url: site.url,
    telephone,
    image: `${site.url}/images/estacao/estacao-atendente-salao.jpg`,
    priceRange: "R$1.490–R$1.690",
    servesCuisine: ["Açaí", "Sorvete"],
    areaServed: { "@type": "City", name: "Rio de Janeiro" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Guadalupe",
      addressRegion: "RJ",
      addressCountry: "BR",
    },
    sameAs: [site.instagram, site.tiktok, site.facebook],
    makesOffer: packages.options.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price,
      priceCurrency: "BRL",
      url: `${site.url}/#pacotes`,
    })),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
