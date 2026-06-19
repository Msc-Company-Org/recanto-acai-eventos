import Image from "next/image";
import { included } from "@/lib/content";
import { SectionTitle } from "./primitives";

export function Included() {
  return (
    <section id="inclui" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="No pacote" title={included.title} subtitle={included.subtitle} />
        <div className="grid sm:grid-cols-2 gap-6 mt-12">
          {included.items.map((item) => (
            <div key={item.title} className="glass rounded-2xl overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
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
