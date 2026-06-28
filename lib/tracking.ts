// ============================================================
// Disparo de eventos de conversão — Funil 100% Site + Stripe.
//
// COMO FUNCIONA:
//   O código envia eventos com nomes GA4 padrão via gtag("event", ...).
//   Como o Analytics.tsx faz gtag('config', 'AW-17856564369'), TODOS
//   os eventos fluem automaticamente para o GA4 E para o Google Ads.
//
//   No Google Ads, basta importar os eventos do GA4 como conversões.
//   Não precisa de rótulos manuais (send_to) — só o purchase tem
//   um rótulo dedicado para conversão direta do Ads.
//
// DEDUPLICAÇÃO:
//   A conversão do Google Ads é disparada APENAS UMA VEZ por cliente
//   via localStorage. GA4/dataLayer/Meta Pixel continuam normalmente.
//
// FUNIL:
//   Etapa 1 → selecao_pacote       (R$  5)
//   Etapa 2 → generate_lead        (R$ 10)
//   Etapa 3 → qualify_lead         (R$ 20)
//   Etapa 4 → close_convert_lead   (R$ 25)
//   Etapa 5 → begin_checkout       (R$ 35)  ← foi pro pagamento
//   Etapa 6 → purchase             (R$ 50)  ← pagou
// ============================================================

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// ─── Eventos internos (usados no código TypeScript) ───
export const EVENTS = {
  SELECAO_PACOTE: "selecao_pacote",
  ENVIO_FORMULARIO: "envio_formulario",
  QUALIFY_LEAD: "qualify_lead",
  CLOSE_CONVERT_LEAD: "close_convert_lead",
  INICIO_CHECKOUT: "inicio_checkout",
  RESERVA_PAGA: "reserva_paga",
} as const;

// ─── Evento interno → nome GA4 padrão (o que o Google Analytics e Ads reconhecem) ───
const GA4_NAME: Record<string, string> = {
  [EVENTS.SELECAO_PACOTE]: "selecao_pacote",
  [EVENTS.ENVIO_FORMULARIO]: "generate_lead",
  [EVENTS.QUALIFY_LEAD]: "qualify_lead",
  [EVENTS.CLOSE_CONVERT_LEAD]: "close_convert_lead",
  [EVENTS.INICIO_CHECKOUT]: "begin_checkout",
  [EVENTS.RESERVA_PAGA]: "purchase",
};

// ─── Valor fixo de cada conversão (R$) — enviado junto com o evento ───
// RESERVA_PAGA não tem valor fixo: usa params.value (valor real da compra via Stripe).
const CONVERSION_VALUE: Record<string, number> = {
  [EVENTS.SELECAO_PACOTE]: 5,
  [EVENTS.ENVIO_FORMULARIO]: 10,
  [EVENTS.QUALIFY_LEAD]: 20,
  [EVENTS.CLOSE_CONVERT_LEAD]: 25,
  [EVENTS.INICIO_CHECKOUT]: 35,
};

// ─── Meta Pixel ───
const META_EVENT: Record<string, string> = {
  [EVENTS.ENVIO_FORMULARIO]: "Lead",
  [EVENTS.QUALIFY_LEAD]: "Lead",
  [EVENTS.CLOSE_CONVERT_LEAD]: "Lead",
  [EVENTS.INICIO_CHECKOUT]: "InitiateCheckout",
  [EVENTS.RESERVA_PAGA]: "Purchase",
};

// ─── Rótulo de conversão direta do Google Ads (apenas Purchase) ───
// Os demais eventos (begin_checkout, generate_lead, qualify_lead) são importados
// automaticamente via GA4 Import no Google Ads — sem send_to necessário.
const ADS_PURCHASE_LABEL  = "AW-17856564369/_zDKCO7SmsIcEJGZ1sJC";  // Compra

// ─── Deduplicação via localStorage ───
const DEDUP_PREFIX = "recanto_conv_";

function shouldFireOnce(event: string, txId?: string): boolean {
  if (typeof window === "undefined" || typeof localStorage === "undefined") return true;
  try {
    // Purchase dedup por transaction_id (cada compra é única)
    const key = event === EVENTS.RESERVA_PAGA && txId
      ? `${DEDUP_PREFIX}purchase_${txId}`
      : `${DEDUP_PREFIX}${event}`;
    if (localStorage.getItem(key)) return false;
    localStorage.setItem(key, new Date().toISOString());
    return true;
  } catch {
    return true;
  }
}

/**
 * Dispara um evento de conversão para GA4, Google Ads, GTM e Meta Pixel.
 *
 * O valor de conversão fixo (R$5 a R$50) é enviado automaticamente.
 * Se o params já tiver `value`, ele é mantido para o GA4/Meta mas
 * o valor fixo é usado para a conversão do Ads (para controle de custo).
 */
export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  const ga4Name = GA4_NAME[event] || event;
  const convValue = CONVERSION_VALUE[event];
  const txId = String(params.transaction_id || "");
  const isFirstTime = shouldFireOnce(event, txId || undefined);

  // Parâmetros enriquecidos com valor de conversão
  const enrichedParams = {
    ...params,
    value: convValue ?? params.value,
    currency: "BRL",
  };

  // ═══ 1) GTM dataLayer — SEMPRE dispara ═══
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  if (ga4Name !== event) {
    window.dataLayer.push({ event: ga4Name, ...enrichedParams });
  }

  // ═══ 2) gtag — GA4 + Google Ads ═══
  if (typeof window.gtag === "function") {
    // 2a) Evento GA4 padrão (sempre dispara — analytics grátis)
    //     Como o site faz gtag('config', 'AW-17856564369'), este evento
    //     também é enviado automaticamente para o Google Ads.
    window.gtag("event", ga4Name, enrichedParams);

    // 2b) Conversão direta do Google Ads para Purchase (rótulo real)
    //     Os demais eventos são importados via GA4 Import no Google Ads.
    if (event === EVENTS.RESERVA_PAGA && isFirstTime) {
      window.gtag("event", "conversion", {
        send_to: ADS_PURCHASE_LABEL,
        value: params.value ?? convValue,
        currency: "BRL",
        transaction_id: txId,
      });
    }
  }

  // ═══ 3) Meta Pixel ═══
  const metaEvent = META_EVENT[event];
  if (typeof window.fbq === "function" && metaEvent) {
    window.fbq("track", metaEvent, enrichedParams);
  }
}

/**
 * Reseta as flags de deduplicação (para testes).
 */
export function resetConversionFlags(): void {
  if (typeof localStorage === "undefined") return;
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(DEDUP_PREFIX)) toRemove.push(key);
  }
  toRemove.forEach((k) => localStorage.removeItem(k));
}
