import { included } from "@/lib/content";
import { SectionTitle } from "./primitives";
import { iconMap } from "./icons";

export function Included() {
  return (
    <section id="inclui" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle title={included.title} subtitle={included.subtitle} />
        <div className="grid sm:grid-cols-2 gap-6 mt-12">
          {included.items.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div key={item.title} className="glass rounded-2xl p-7 flex gap-5">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                  {Icon && <Icon className="w-6 h-6 text-gold" />}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-muted mt-1 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-sm text-muted mt-8 max-w-2xl mx-auto glass rounded-xl px-5 py-3">
          {included.note}
        </p>
      </div>
    </section>
  );
}
