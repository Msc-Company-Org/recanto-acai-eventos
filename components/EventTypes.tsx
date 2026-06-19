import { eventTypes } from "@/lib/content";
import { SectionTitle } from "./primitives";

export function EventTypes() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Ocasiões" title={eventTypes.title} subtitle={eventTypes.subtitle} />
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {eventTypes.items.map((item) => (
            <span
              key={item.label}
              className="glass rounded-full px-5 py-2.5 text-sm font-semibold text-ink hover:border-primary/40 hover:-translate-y-0.5 transition-all"
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
