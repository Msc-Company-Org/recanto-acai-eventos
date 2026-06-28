"use client";

import { useState } from "react";

interface Props {
  videoId: string;
  title: string;
}

export function YoutubeEmbed({ videoId, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-2xl glass shadow-glow">
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 w-full h-full group"
          aria-label={`Assistir vídeo: ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-bg ml-1" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <p className="absolute bottom-4 left-4 right-4 text-white font-semibold text-sm drop-shadow line-clamp-2 text-left">
            {title}
          </p>
        </button>
      )}
    </div>
  );
}
