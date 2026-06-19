import { finalCta, waDefaultMessage } from "@/lib/content";
import { WhatsAppCTA, WhatsappIcon } from "./primitives";

export function FinalCta() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="glass-strong rounded-3xl p-10 md:p-14 text-center bg-radial-glow">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            {finalCta.title}
          </h2>
          <p className="text-muted text-lg mt-4 max-w-xl mx-auto">{finalCta.subtitle}</p>
          <div className="mt-8 flex justify-center">
            <WhatsAppCTA message={waDefaultMessage} variant="gold" cta="final">
              <WhatsappIcon /> {finalCta.cta}
            </WhatsAppCTA>
          </div>
        </div>
      </div>
    </section>
  );
}
