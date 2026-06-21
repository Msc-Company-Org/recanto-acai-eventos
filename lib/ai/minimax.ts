import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Provider MiniMax (endpoint OpenAI-compatible) — server-only.
 * `MINIMAX_API_KEY` é env var do projeto na Vercel; nunca vai ao browser.
 * Módulo de fundação reutilizável (mesmo padrão do piloto agenda-barber).
 */
const MINIMAX_BASE_URL = process.env.MINIMAX_BASE_URL ?? "https://api.minimax.io/v1";

export const minimax = createOpenAICompatible({
  name: "minimax",
  apiKey: process.env.MINIMAX_API_KEY ?? "",
  baseURL: MINIMAX_BASE_URL,
  includeUsage: true,
});

/** Modelo de chat/agente (1M de contexto, tool calling, PT nativo). */
export const MINIMAX_CHAT_MODEL = "MiniMax-M3";

export function chatModel(id: string = MINIMAX_CHAT_MODEL) {
  return minimax(id);
}

export function hasMinimaxKey(): boolean {
  return Boolean(process.env.MINIMAX_API_KEY);
}
