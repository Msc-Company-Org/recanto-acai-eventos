import Image from "next/image";
import { hero, waDefaultMessage } from "@/lib/content";
import { WhatsAppCTA, WhatsappIcon } from "./primitives";
import { Star } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative bg-radial-glow pt-28 pb-14 md:pt-40 md:pb-28">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-12 items-center">
        <div className="text-center md:text-left order-2 md:order-1">
          <span className="inline-block glass rounded-full px-4 py-1.5 text-xs font-semibold text-primary mb-6">
            {hero.badge}
          </span>
          <h1 className="font-display text-[2.6rem] sm:text-5xl md:text-[3.75rem] font-semibold leading-[1.04] tracking-tight text-ink text-balance">
            {hero.titleLead}{" "}
            <span className="text-gold-gradient">{hero.titleHighlight}</span>.
          </h1>
          <p className="text-muted text-lg mt-6 max-w-xl mx-auto md:mx-0 leading-relaxed text-pretty">{hero.subtitle}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-8">
            <WhatsAppCTA message={waDefaultMessage} variant="primary" cta="hero">
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
        <div className="flex justify-center order-1 md:order-2">
          <div className="relative w-[240px] h-[300px] sm:w-[300px] sm:h-[400px] animate-float">
            <div className="relative w-full h-full overflow-hidden rounded-3xl glass-strong shadow-glow">
              <Image
                src="/images/produtos/acai-cremoso-colher.jpg"
                alt="Açaí cremoso premium servido na hora pelo Recanto do Açaí"
                fill
                priority
                sizes="(max-width: 640px) 280px, 320px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-5 -left-4 glass-strong rounded-2xl px-4 py-3 shadow-glow flex items-center gap-2.5">
              <Star className="w-5 h-5 text-gold shrink-0" />
              <div className="leading-tight">
                <div className="font-display text-sm font-bold text-ink">Servido na hora</div>
                <div className="text-[11px] text-muted">Açaí &amp; sorvete gourmet</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
