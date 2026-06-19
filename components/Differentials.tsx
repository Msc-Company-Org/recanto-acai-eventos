import { differentials } from "@/lib/content";
import { SectionTitle } from "./primitives";
import { iconMap } from "./icons";

export function Differentials() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle title={differentials.title} subtitle={differentials.subtitle} />
        <div className="grid sm:grid-cols-3 gap-6 mt-12">
          {differentials.items.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div key={item.title} className="glass rounded-2xl p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5">
                  {Icon && <Icon className="w-7 h-7 text-gold" />}
                </div>
                <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
