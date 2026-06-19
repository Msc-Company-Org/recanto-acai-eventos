import Image from "next/image";
import { differentials } from "@/lib/content";
import { SectionTitle } from "./primitives";

export function Differentials() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Diferenciais" title={differentials.title} subtitle={differentials.subtitle} />
        <div className="grid sm:grid-cols-3 gap-6 mt-12">
          {differentials.items.map((item) => (
            <div key={item.title} className="glass rounded-2xl overflow-hidden">
              <div className="relative h-52 w-full">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
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
