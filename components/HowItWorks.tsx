import { howItWorks } from "@/lib/content";
import { SectionTitle } from "./primitives";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-bg-soft">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle title={howItWorks.title} subtitle={howItWorks.subtitle} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {howItWorks.steps.map((step) => (
            <div key={step.n} className="glass rounded-2xl p-7">
              <span className="font-display text-5xl font-bold text-primary/40">{step.n}</span>
              <h3 className="font-display text-xl font-bold text-white mt-2">{step.title}</h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
