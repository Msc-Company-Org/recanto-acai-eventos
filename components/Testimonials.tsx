import { testimonials } from "@/lib/content";
import { SectionTitle } from "./primitives";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-bg-soft">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Depoimentos" title={testimonials.title} subtitle={testimonials.subtitle} />
        <div className="grid sm:grid-cols-3 gap-6 mt-12">
          {testimonials.items.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-7 flex flex-col">
              <Quote className="w-8 h-8 text-primary/50" />
              <p className="text-ink mt-3 grow leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="flex gap-1 mt-4 text-gold">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="mt-3">
                <div className="font-semibold text-ink">{t.name}</div>
                <div className="text-xs text-muted">{t.event}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted mt-6">
          * Depoimentos ilustrativos — substituir por avaliações reais de clientes.
        </p>
      </div>
    </section>
  );
}
