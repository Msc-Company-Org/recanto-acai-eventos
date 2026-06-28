import Image from "next/image";
import { hero, waDefaultMessage } from "@/lib/content";
import { WhatsAppCTA, WhatsappIcon } from "./primitives";
import { Star } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative bg-radial-glow pt-28 pb-14 md:pt-40 md:pb-28">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-12 items-center">
        <div className="text-center md:text-left order-1">
          <span className="inline-block glass rounded-full px-4 py-1.5 text-xs font-semibold text-primary mb-5">
            {hero.badge}
          </span>
          <h1 className="font-display text-[2.45rem] sm:text-5xl md:text-[3.25rem] font-semibold leading-[1.08] tracking-tight text-ink text-balance">
            {hero.titleLead}{" "}
            <span className="text-gold-gradient">{hero.titleHighlight}</span>.
          </h1>
          <p className="text-muted text-lg mt-6 max-w-md mx-auto md:mx-0 leading-relaxed text-pretty whitespace-pre-line">{hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mt-9">
            <a
              href="/reserva"
              className="inline-flex items-center justify-center gap-2 rounded-full font-bold text-lg px-8 py-[1.15rem] bg-gold text-bg hover:bg-gold-soft shadow-gold transition-colors w-full sm:w-auto cta-attention"
            >
              {hero.ctaPrimary}
            </a>
            <a
              href="#orcamento"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 text-ink text-base font-semibold px-8 py-[1.05rem] hover:bg-primary/10 hover:border-primary transition-colors w-full sm:w-auto"
            >
              {hero.ctaSecondary}
            </a>
          </div>
          <p className="text-sm text-muted mt-4">{hero.ctaNote}</p>
          <div className="flex gap-7 sm:gap-8 justify-center md:justify-start mt-10">
            {hero.stats.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <div className="font-display text-lg sm:text-xl font-bold text-gold">{s.value}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:flex justify-center order-2">
          <div className="relative w-[300px] h-[400px] animate-float">
            <div className="relative w-full h-full overflow-hidden rounded-3xl glass-strong shadow-glow">
              <Image
                src="/images/produtos/acai-cremoso-colher.jpg"
                alt="Açaí cremoso premium servido na hora pelo Recanto do Açaí"
                fill
                priority
                sizes="(max-width: 640px) 320px, 320px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-4 left-2 md:-left-4 glass-strong rounded-2xl px-3.5 py-2.5 shadow-glow flex items-center gap-2.5">
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
