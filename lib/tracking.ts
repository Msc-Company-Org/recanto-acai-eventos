// ============================================================
// Disparo de eventos de conversão para todos os canais disponíveis.
// Cliente-only e seguro: não faz nada se nenhum tracker estiver carregado.
//  1) dataLayer (GTM)  — configure GA4/Pixel como TAGS dentro do GTM, OU
//  2) gtag (GA4 direto) — ativo só com NEXT_PUBLIC_GA_ID
//  3) fbq  (Meta Pixel) — ativo só com NEXT_PUBLIC_META_PIXEL_ID
// Use a abordagem 1 OU as 2/3 — evite as duas para não duplicar contagem.
// ============================================================

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export const EVENTS = {
  CLIQUE_WHATSAPP: "clique_whatsapp",
  ENVIO_FORMULARIO: "envio_formulario",
  SELECAO_PACOTE: "selecao_pacote",
} as const;

// Mapeia o evento interno para o evento padrão do Meta Pixel (otimização de campanha).
const META_EVENT: Record<string, string> = {
  [EVENTS.CLIQUE_WHATSAPP]: "Contact",
  [EVENTS.ENVIO_FORMULARIO]: "Lead",
};

export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  // 1) GTM dataLayer — o trigger das tags GA4/Pixel configuradas no GTM.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  // 2) GA4 direto (só dispara se o gtag estiver carregado via NEXT_PUBLIC_GA_ID).
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }

  // 3) Meta Pixel direto (só dispara se o fbq estiver carregado via NEXT_PUBLIC_META_PIXEL_ID).
  const metaEvent = META_EVENT[event];
  if (typeof window.fbq === "function" && metaEvent) {
    window.fbq("track", metaEvent, params);
  }
}
