import { hero, waDefaultMessage } from "@/lib/content";
import { WhatsAppCTA, WhatsappIcon } from "./primitives";
import { IceCream, Star } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative bg-radial-glow pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
        <div className="text-center md:text-left">
          <span className="inline-block glass rounded-full px-4 py-1.5 text-xs font-semibold text-gold mb-6">
            {hero.badge}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] text-white">
            {hero.titleLead}{" "}
            <span className="text-gold-gradient">{hero.titleHighlight}</span>.
          </h1>
          <p className="text-muted text-lg mt-6 max-w-xl mx-auto md:mx-0">{hero.subtitle}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-8">
            <WhatsAppCTA message={waDefaultMessage} variant="primary">
              <WhatsappIcon /> {hero.ctaPrimary}
            </WhatsAppCTA>
            <a
              href="#pacotes"
              className="inline-flex items-center justify-center gap-2 rounded-full font-semibold px-7 py-3.5 border border-primary/40 text-ink hover:bg-primary/10 hover:border-primary transition-all"
            >
              {hero.ctaSecondary}
            </a>
          </div>
          <div className="flex gap-8 justify-center md:justify-start mt-10">
            {hero.stats.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <div className="font-display text-xl font-bold text-gold">{s.value}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="glass rounded-3xl w-[280px] h-[340px] sm:w-[300px] sm:h-[360px] flex flex-col items-center justify-center relative animate-float shadow-glow">
            <Star className="w-6 h-6 text-gold absolute top-6 right-6 animate-pulse-soft" />
            <IceCream className="w-24 h-24 text-gold mb-4" />
            <span className="font-display text-lg text-white">Açaí &amp; Sorvete Gourmet</span>
            <span className="text-xs text-muted mt-1">Servido na hora</span>
          </div>
        </div>
      </div>
    </section>
  );
}
