import { finalCta, waDefaultMessage } from "@/lib/content";
import { WhatsAppCTA, WhatsappIcon } from "./primitives";

export function FinalCta() {
  return (
    <section className="py-14 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="glass-strong rounded-3xl p-10 md:p-14 text-center bg-radial-glow">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            {finalCta.title}
          </h2>
          <p className="text-muted text-lg mt-4 max-w-xl mx-auto">{finalCta.subtitle}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/reserva"
              className="inline-flex items-center justify-center gap-2 rounded-full font-bold text-lg px-8 py-4 bg-gold text-bg hover:bg-gold-soft shadow-gold transition-colors w-full sm:w-auto cta-attention"
            >
              {finalCta.cta}
            </a>
            <a
              href="#orcamento"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 text-ink text-base font-semibold px-8 py-4 hover:bg-primary/10 hover:border-primary transition-colors w-full sm:w-auto"
            >
              Verificar Disponibilidade
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
