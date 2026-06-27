import Image from "next/image";
import { differentials } from "@/lib/content";
import { SectionTitle } from "./primitives";

export function Differentials() {
  return (
    <section className="py-14 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Diferenciais" title={differentials.title} subtitle={differentials.subtitle} />
        <div className="grid sm:grid-cols-3 gap-6 mt-8 md:mt-12">
          {differentials.items.map((item) => (
            <div
              key={item.title}
              className="group glass rounded-2xl overflow-hidden card-3d"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={item.img}
                  alt={`${item.title} — diferencial do Recanto do Açaí em eventos no RJ`}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-7 text-center">
                <h3 className="font-display text-lg font-bold text-ink">{item.title}</h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
