"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { gallery } from "@/lib/content";
import { SectionTitle } from "./primitives";

export function Gallery() {
  const items = gallery.items;
  const [idx, setIdx] = useState<number | null>(null);

  const close = useCallback(() => setIdx(null), []);
  const prev = useCallback(() => setIdx(i => i !== null ? (i - 1 + items.length) % items.length : null), [items.length]);
  const next = useCallback(() => setIdx(i => i !== null ? (i + 1) % items.length : null), [items.length]);

  return (
    <>
      <section id="galeria" className="py-14 md:py-28 bg-bg-soft">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle eyebrow="Galeria" title={gallery.title} subtitle={gallery.subtitle} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 md:mt-12">
            {items.map((item, i) => (
              <button
                key={item.src}
                onClick={() => setIdx(i)}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl glass shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                aria-label={`Ampliar: ${item.caption}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 pt-12 text-sm font-semibold text-white text-left">
                  {item.caption}
                </figcaption>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"
                  >
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {idx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de fotos"
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full transition-colors"
            onClick={close}
            aria-label="Fechar galeria"
          >
            <X className="w-7 h-7" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 rounded-full transition-colors"
            onClick={e => { e.stopPropagation(); prev(); }}
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-9 h-9" />
          </button>

          <div
            className="relative w-full max-w-3xl aspect-[4/3]"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={items[idx].src}
              alt={items[idx].alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/80 text-sm font-semibold drop-shadow">
              {items[idx].caption}
            </p>
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 rounded-full transition-colors"
            onClick={e => { e.stopPropagation(); next(); }}
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-9 h-9" />
          </button>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs">
            {idx + 1} / {items.length}
          </p>
        </div>
      )}
    </>
  );
}
