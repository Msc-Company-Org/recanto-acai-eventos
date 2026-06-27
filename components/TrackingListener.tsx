"use client";

import { useEffect } from "react";
import { track, EVENTS } from "@/lib/tracking";

/**
 * Captura cliques em qualquer link de WhatsApp (wa.me) via listener delegado —
 * cobre todos os CTAs (hero, header, pacotes, final, botão flutuante) sem
 * precisar instrumentar cada botão. A origem do clique vem do `data-cta`
 * (quando presente) ou da seção/header mais próximo.
 *
 * O envio do formulário usa window.open (não é clique em <a>), então dispara o
 * evento de conversão por conta própria no QuoteForm — sem dupla contagem aqui.
 */
export function TrackingListener() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const anchor = target?.closest?.('a[href*="wa.me/"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const location =
        anchor.dataset.cta ||
        anchor.closest("section")?.id ||
        (anchor.closest("header") ? "header" : "desconhecido");
      track(EVENTS.CLIQUE_WHATSAPP, { location });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
