import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { EventTypes } from "@/components/EventTypes";
import { HowItWorks } from "@/components/HowItWorks";
import { Included } from "@/components/Included";
import { Flavors } from "@/components/Flavors";
import { Packages } from "@/components/Packages";
import { Differentials } from "@/components/Differentials";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { QuoteForm } from "@/components/QuoteForm";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <EventTypes />
        <HowItWorks />
        <Included />
        <Flavors />
        <Packages />
        <Differentials />
        <Gallery />
        <Testimonials />
        <QuoteForm />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
