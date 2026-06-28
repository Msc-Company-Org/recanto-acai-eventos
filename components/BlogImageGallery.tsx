"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const IMAGES = [
  { src: "/images/produtos/acai-cremoso-colher.jpg", alt: "Açaí cremoso gourmet servido na hora" },
  { src: "/images/eventos/festa-tema-rei-leao.jpg", alt: "Estação de açaí em festa temática" },
  { src: "/images/estacao/estacao-atendente-salao.jpg", alt: "Atendente uniformizada na estação de açaí" },
  { src: "/images/produtos/acai-premium-taca.jpg", alt: "Açaí premium em taça gourmet" },
  { src: "/images/eventos/equipe-recanto-evento.jpg", alt: "Equipe do Recanto do Açaí em evento" },
  { src: "/images/estacao/estacao-complementos.jpg", alt: "Mesa de complementos e toppings premium" },
  { src: "/images/produtos/creme-flocos.jpg", alt: "Creme com flocos gourmet" },
  { src: "/images/produtos/sorvete-flocos-gourmet.jpg", alt: "Sorvete gourmet com flocos" },
];

export function BlogImageGallery() {
  const [idx, setIdx] = useState<number | null>(null);

  const close = useCallback(() => setIdx(null), []);
  const prev = useCallback(() => setIdx(i => i !== null ? (i - 1 + IMAGES.length) % IMAGES.length : null), []);
  const next = useCallback(() => setIdx(i => i !== null ? (i + 1) % IMAGES.length : null), []);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {IMAGES.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setIdx(i)}
            className="group relative aspect-square overflow-hidden rounded-xl glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={`Ampliar: ${img.alt}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {idx !== null && (
        <div
          role="dialog"
          aria-modal="true"
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
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="w-9 h-9" />
          </button>

          <div
            className="relative w-full max-w-2xl aspect-square"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={IMAGES[idx].src}
              alt={IMAGES[idx].alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 rounded-full transition-colors"
            onClick={e => { e.stopPropagation(); next(); }}
            aria-label="Próxima imagem"
          >
            <ChevronRight className="w-9 h-9" />
          </button>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {idx + 1} / {IMAGES.length}
          </p>
        </div>
      )}
    </>
  );
}
