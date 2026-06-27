import crypto from "crypto";

/**
 * Verifica a assinatura do webhook do Stripe (HMAC-SHA256, esquema `t=...,v1=...`).
 * Comparação em tempo constante. Pura/determinística.
 */
export function verifyStripeSignature(payload: string, sigHeader: string, secret: string): boolean {
  if (!secret || !sigHeader) return false;
  const parts: Record<string, string> = {};
  for (const kv of sigHeader.split(",")) {
    const i = kv.indexOf("=");
    if (i === -1) continue;
    const k = kv.slice(0, i).trim();
    const v = kv.slice(i + 1).trim();
    if (k && v) parts[k] = v;
  }
  if (!parts.t || !parts.v1) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${parts.t}.${payload}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(parts.v1);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export type CheckoutCompleted = {
  sessionId: string;
  name: string;
  whatsapp: string;
  package: "unico" | "combo";
  amount: number; // em reais (inteiro)
  source: string;
  modo: string;
};

/** Extrai os dados de um evento `checkout.session.completed` do Stripe. Pura. */
export function parseCheckoutCompleted(event: unknown): CheckoutCompleted | null {
  const e = event as { type?: string; data?: { object?: Record<string, unknown> } } | null;
  if (!e || e.type !== "checkout.session.completed") return null;
  const s = (e.data?.object || {}) as Record<string, unknown>;
  const md = (s.metadata || {}) as Record<string, string>;
  const cd = (s.customer_details || {}) as Record<string, string>;
  return {
    sessionId: typeof s.id === "string" ? s.id : "",
    name: cd.name || "",
    whatsapp: cd.phone || "",
    package: md.pacote === "unico" ? "unico" : "combo",
    amount: Math.round((Number(s.amount_total) || 0) / 100),
    source: md.origem === "whatsapp" ? "whatsapp" : "site-checkout",
    modo: md.modo || "",
  };
}
