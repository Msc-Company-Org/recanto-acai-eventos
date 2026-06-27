/** Lê o corpo JSON do request com segurança. Retorna null se ausente/malformado. */
export async function safeJson<T = unknown>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}
