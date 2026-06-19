import { eventTypes } from "@/lib/content";
import { SectionTitle } from "./primitives";
import { iconMap } from "./icons";

export function EventTypes() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle title={eventTypes.title} subtitle={eventTypes.subtitle} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
          {eventTypes.items.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={item.label}
                className="glass rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:border-gold/40 hover:-translate-y-1 transition-all"
              >
                {Icon && <Icon className="w-8 h-8 text-gold" />}
                <span className="font-semibold text-ink">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
