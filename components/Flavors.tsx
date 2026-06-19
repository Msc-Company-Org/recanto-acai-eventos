import { flavors } from "@/lib/content";
import { SectionTitle } from "./primitives";
import { iconMap } from "./icons";

export function Flavors() {
  return (
    <section className="py-20 md:py-28 bg-bg-soft">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle title={flavors.title} subtitle={flavors.subtitle} />
        <div className="grid sm:grid-cols-3 gap-6 mt-12">
          {flavors.groups.map((group) => {
            const Icon = iconMap[group.icon];
            return (
              <div key={group.title} className="glass rounded-2xl p-7">
                <div className="flex items-center gap-3 border-b border-line pb-3 mb-4">
                  {Icon && <Icon className="w-5 h-5 text-gold" />}
                  <h3 className="font-display text-lg font-bold text-white">{group.title}</h3>
                </div>
                <ul className="space-y-2">
                  {group.items.map((it) => (
                    <li key={it} className="text-muted text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
