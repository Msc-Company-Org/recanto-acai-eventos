import { CheckoutSchema, type CheckoutInput } from "./validation";

export const PACKAGE_IDS = ["unico", "combo"] as const;
export const MODES = ["sinal", "total"] as const;
export type PackageId = (typeof PACKAGE_IDS)[number];
export type Mode = (typeof MODES)[number];

/** Valida/normaliza a entrada do checkout via zod (fallback: combo/total). Pura. */
export function parseCheckoutInput(body: unknown): CheckoutInput {
  return CheckoutSchema.parse(body ?? {});
}

// Origins confiáveis para o success_url (evita open-redirect via header forjado).
const ALLOWED_ORIGINS = [
  "https://recanto-eventos.vercel.app",
  "https://eventos.recantodoaçaiestações.com.br",
  "https://eventos.xn--recantodoaaiestaes-hvbg80a.com.br",
];
const DEFAULT_ORIGIN = "https://recanto-eventos.vercel.app";

/** Devolve um origin confiável; cai no padrão se o header não estiver na allowlist. Pura. */
export function safeOrigin(origin: string | null | undefined): string {
  return origin && ALLOWED_ORIGINS.includes(origin) ? origin : DEFAULT_ORIGIN;
}

/** Monta a success_url do checkout (com os parâmetros de conversão + placeholder do Stripe). Pura. */
export function buildSuccessUrl(
  origin: string | null | undefined,
  p: { valor: number; pacote: string; modo: string }
): string {
  const o = safeOrigin(origin);
  return `${o}/obrigado?pago=1&valor=${p.valor}&pacote=${p.pacote}&modo=${p.modo}&session_id={CHECKOUT_SESSION_ID}`;
}
