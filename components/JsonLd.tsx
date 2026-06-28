import { site, packages, faq, testimonials } from "@/lib/content";

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
    areaServed: [
      { "@type": "City", name: "Rio de Janeiro" },
      { "@type": "AdministrativeArea", name: "Zona Norte RJ" },
      { "@type": "AdministrativeArea", name: "Guadalupe" },
      { "@type": "AdministrativeArea", name: "Marechal Hermes" },
      { "@type": "AdministrativeArea", name: "Barra da Tijuca" },
      { "@type": "AdministrativeArea", name: "Recreio dos Bandeirantes" },
      { "@type": "AdministrativeArea", name: "Zona Sul RJ" },
      { "@type": "AdministrativeArea", name: "Niterói" },
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: -22.8364,
      longitude: -43.3664,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Estação Móvel — atendimento a domicílio",
      addressNeighborhood: "Guadalupe",
      addressLocality: "Rio de Janeiro",
      addressRegion: "RJ",
      postalCode: "21660-000",
      addressCountry: "BR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "10:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday"],
        opens: "10:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "08:00",
        closes: "23:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
      ratingCount: String(testimonials.items.length),
      reviewCount: String(testimonials.items.length),
    },
    review: testimonials.items.map((t) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      author: { "@type": "Person", name: t.name },
      reviewBody: t.text,
      name: t.event,
    })),
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
