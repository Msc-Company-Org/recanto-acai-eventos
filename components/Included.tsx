import Image from "next/image";
import { included } from "@/lib/content";
import { SectionTitle } from "./primitives";

export function Included() {
  return (
    <section id="inclui" className="py-14 md:py-28 bg-bg-soft">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="No pacote" title={included.title} subtitle={included.subtitle} />
        <div className="grid sm:grid-cols-2 gap-6 mt-8 md:mt-12">
          {included.items.map((item) => (
            <div
              key={item.title}
              className="group glass rounded-2xl overflow-hidden card-3d"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={item.img}
                  alt={`${item.title} — estação de açaí para eventos no Rio de Janeiro`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-ink">{item.title}</h3>
                <p className="text-muted mt-1 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted mt-8 max-w-2xl mx-auto glass rounded-xl px-5 py-3">
          {included.note}
        </p>
      </div>
    </section>
  );
}
