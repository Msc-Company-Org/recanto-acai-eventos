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
  INICIO_CHECKOUT: "inicio_checkout",
  RESERVA_PAGA: "reserva_paga",
} as const;

// Mapeia o evento interno para o evento padrão do Meta Pixel (otimização de campanha).
const META_EVENT: Record<string, string> = {
  [EVENTS.CLIQUE_WHATSAPP]: "Contact",
  [EVENTS.ENVIO_FORMULARIO]: "Lead",
  [EVENTS.INICIO_CHECKOUT]: "InitiateCheckout",
  [EVENTS.RESERVA_PAGA]: "Purchase",
};

// Conversões do Google Ads — método A: send_to ("AW-<id>/<rótulo>"). Conta 819-457-5845.
const ADS_CONVERSION: Record<string, string> = {
  [EVENTS.RESERVA_PAGA]: "AW-17856564369/_zDKCO7SmsIcEJGZ1sJC", // Compra / Reserva paga
};

// Conversões do Google Ads — método B: EVENTO NOMEADO ("evento da tag do Google").
const ADS_EVENT: Record<string, string> = {
  [EVENTS.ENVIO_FORMULARIO]: "manual_event_SUBMIT_LEAD_FORM", // Lead (envio do formulário)
};

export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  // 1) GTM dataLayer — o trigger das tags GA4/Pixel configuradas no GTM.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  // 2) GA4 direto (só dispara se o gtag estiver carregado via NEXT_PUBLIC_GA_ID).
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);

    // 2b) Conversão do Google Ads (send_to) — quando o evento tem ação mapeada.
    const adsSendTo = ADS_CONVERSION[event];
    if (adsSendTo) {
      window.gtag("event", "conversion", {
        send_to: adsSendTo,
        value: params.value,
        currency: params.currency ?? "BRL",
        transaction_id: params.transaction_id ?? "",
      });
    }

    // 2c) Conversão do Google Ads (evento nomeado) — ex.: Lead via SUBMIT_LEAD_FORM.
    const adsEvent = ADS_EVENT[event];
    if (adsEvent) {
      window.gtag("event", adsEvent, {
        value: params.value,
        currency: params.currency ?? "BRL",
      });
    }
  }

  // 3) Meta Pixel direto (só dispara se o fbq estiver carregado via NEXT_PUBLIC_META_PIXEL_ID).
  const metaEvent = META_EVENT[event];
  if (typeof window.fbq === "function" && metaEvent) {
    window.fbq("track", metaEvent, params);
  }
}
