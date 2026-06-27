// Fonte única dos valores (R$) por pacote — usada no checkout (server) e no tracking (client).
// Mantém o valor da conversão de compra consistente entre Stripe, GA4, Google Ads e Meta.
export const PRECOS: Record<string, number> = { unico: 1490, combo: 1690 };

/** Valor cobrado AGORA: sinal = 50% (data reservada) ou o total. */
export function valorReserva(pacote: string, modo: "sinal" | "total"): number {
  const total = PRECOS[pacote] ?? PRECOS.combo;
  return modo === "sinal" ? Math.round(total / 2) : total;
}
