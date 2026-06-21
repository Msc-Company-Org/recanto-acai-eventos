"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

/**
 * Widget da Naiara — agente comercial de eventos (MiniMax M3).
 * Conversa em PT-BR, apresenta pacotes/preços reais, calcula orçamento e
 * orienta a reserva. Flutua no canto da landing.
 *
 * O MiniMax-M3 emite raciocínio inline em <think>...</think>; removemos para
 * mostrar só a resposta final (inclusive durante o streaming).
 */
function stripThinking(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    .replace(/<think>[\s\S]*$/g, "")
    .trim();
}

export function NaiaraChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/agent" }),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col items-start gap-3">
      {open && (
        <section
          aria-label="Falar com a Naiara"
          className="flex h-[32rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-[#e9ddf6] bg-[#fdfaff] shadow-2xl shadow-[#7c1fd6]/25"
        >
          <header className="flex items-center gap-3 bg-[#7c1fd6] px-5 py-4 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/20 text-lg">
              🍨
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-none">Naiara · Recanto do Açaí</p>
              <p className="mt-1 text-xs font-medium text-white/80">
                Orçamento e reserva na hora 💜
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar chat"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            >
              ✕
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <Bubble from="assistant">
                Oi! ☀️ Sou a Naiara, do Recanto do Açaí. Me conta a ocasião e a data
                que você tá pensando que eu já te passo pacote e valor. 🍨💜
              </Bubble>
            )}

            {messages.map((message) => {
              const text = stripThinking(
                message.parts
                  .filter((p) => p.type === "text")
                  .map((p) => (p as { text: string }).text)
                  .join(""),
              );
              if (!text) return null;
              return (
                <Bubble key={message.id} from={message.role === "user" ? "user" : "assistant"}>
                  {text}
                </Bubble>
              );
            })}

            {busy && (
              <Bubble from="assistant">
                <span className="inline-flex gap-1">
                  <Dot /> <Dot /> <Dot />
                </span>
              </Bubble>
            )}

            {error && (
              <Bubble from="assistant">
                Ops, tive um probleminha pra responder agora. Tenta de novo em
                instantes? 🙏
              </Bubble>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-[#e9ddf6] bg-white/70 p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreva sua mensagem..."
                className="min-w-0 flex-1 rounded-full border border-[#e9ddf6] bg-white px-4 py-3 text-sm text-[#2a1140] outline-none placeholder:text-[#a690c2] focus:border-[#7c1fd6]"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#7c1fd6] text-white transition hover:bg-[#6a17ba] disabled:opacity-40"
                aria-label="Enviar"
              >
                ↑
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-[#7c1fd6] px-5 py-4 font-bold text-white shadow-xl shadow-[#7c1fd6]/30 transition hover:-translate-y-0.5 hover:bg-[#6a17ba]"
      >
        <span>💬</span>
        {open ? "Fechar" : "Falar com a Naiara"}
      </button>
    </div>
  );
}

function Bubble({ from, children }: { from: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = from === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl rounded-br-md bg-[#7c1fd6] px-4 py-2.5 text-sm leading-6 text-white"
            : "max-w-[85%] rounded-2xl rounded-bl-md border border-[#e9ddf6] bg-white px-4 py-2.5 text-sm leading-6 text-[#2a1140]"
        }
      >
        {children}
      </div>
    </div>
  );
}

function Dot() {
  return <span className="h-2 w-2 animate-bounce rounded-full bg-[#b79ad6]" />;
}
