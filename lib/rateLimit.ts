// Rate limiter simples em memória (janela fixa). Best-effort: protege por instância.
// Para produção serverless multi-instância, migrar para um store compartilhado (ex.: Upstash Redis).

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

/** Conta uma requisição para `key`. Retorna ok=false quando excede `limit` na janela `windowMs`. */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): { ok: boolean; remaining: number } {
  const b = store.get(key);
  if (!b || now >= b.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (b.count >= limit) return { ok: false, remaining: 0 };
  b.count += 1;
  return { ok: true, remaining: limit - b.count };
}

/** Extrai um identificador de cliente do request (IP via proxy headers). */
export function clientKey(req: Request, scope: string): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";
  return `${scope}:${ip}`;
}

/** Limpa o store (uso em testes). */
export function _resetRateLimit(): void {
  store.clear();
}
