import Image from "next/image";
import { gallery } from "@/lib/content";
import { SectionTitle } from "./primitives";

export function Gallery() {
  return (
    <section id="galeria" className="py-14 md:py-28 bg-bg-soft">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Galeria" title={gallery.title} subtitle={gallery.subtitle} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 md:mt-12">
          {gallery.items.map((item) => (
            <figure
              key={item.src}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl glass shadow-glow"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 pt-12 text-sm font-semibold text-white">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
