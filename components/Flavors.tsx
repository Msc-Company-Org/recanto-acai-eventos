import { flavors } from "@/lib/content";
import { SectionTitle } from "./primitives";

export function Flavors() {
  return (
    <section className="py-20 md:py-28 bg-bg-soft">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Acompanhamentos" title={flavors.title} subtitle={flavors.subtitle} />
        <div className="grid sm:grid-cols-3 gap-6 mt-12">
          {flavors.groups.map((group) => (
            <div key={group.title} className="glass rounded-2xl p-7">
              <div className="border-b border-line pb-3 mb-4">
                <h3 className="font-display text-lg font-bold text-ink">{group.title}</h3>
              </div>
              <ul className="space-y-2">
                {group.items.map((it) => (
                  <li key={it} className="text-muted text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
