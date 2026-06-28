import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { QuoteForm } from "@/components/QuoteForm";
import { EventTypes } from "@/components/EventTypes";
import { HowItWorks } from "@/components/HowItWorks";
import { Included } from "@/components/Included";
import { Flavors } from "@/components/Flavors";
import { Packages } from "@/components/Packages";
import { UrgencySection } from "@/components/UrgencySection";
import { Footer } from "@/components/Footer";
import { NaiaraChat, LeadPopup, ScrollReveal } from "@/components/ClientWidgets";
import { videoGallery } from "@/lib/content";

// Seções abaixo do fold — JS carregado após o hero e formulário estarem prontos
const Gallery       = dynamic(() => import("@/components/Gallery").then(m => ({ default: m.Gallery })));
const VideoGallery  = dynamic(() => import("@/components/VideoGallery").then(m => ({ default: m.VideoGallery })));
const Differentials = dynamic(() => import("@/components/Differentials").then(m => ({ default: m.Differentials })));
const Testimonials  = dynamic(() => import("@/components/Testimonials").then(m => ({ default: m.Testimonials })));
const Faq           = dynamic(() => import("@/components/Faq").then(m => ({ default: m.Faq })));
const FinalCta      = dynamic(() => import("@/components/FinalCta").then(m => ({ default: m.FinalCta })));

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <QuoteForm />
        <Gallery />
        <VideoGallery videos={videoGallery} asSection />
        <EventTypes />
        <HowItWorks />
        <Included />
        <Flavors />
        <Packages />
        <UrgencySection />
        <Differentials />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <NaiaraChat />
      <LeadPopup />
      <ScrollReveal />
    </>
  );
}
