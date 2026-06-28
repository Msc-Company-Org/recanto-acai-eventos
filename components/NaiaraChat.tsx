"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageSquare, X, Send } from "lucide-react";

/**
 * Widget da Naiara — agente comercial de eventos (MiniMax M3).
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

  // Rolar automaticamente para o fim da conversa a cada nova mensagem ou token
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, busy, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  }

  // Enviar quebra-gelo de forma imediata
  function handleIcebreaker(text: string) {
    if (busy) return;
    sendMessage({ text });
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 font-sans">
      
      {/* Caixa do Chatbox com transições suaves de escala e opacidade */}
      <section
        aria-label="Chat com a Naiara"
        className={`flex h-[28rem] sm:h-[32rem] w-[calc(100vw-2rem)] sm:w-[24rem] flex-col overflow-hidden rounded-3xl border border-[#e9ddf6] bg-[#fdfaff] shadow-2xl transition-all duration-300 origin-bottom-right ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header do Chat */}
        <header className="flex h-16 shrink-0 items-center justify-between bg-[#7c1fd6] px-5 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/20 text-lg select-none">
              🍨
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-none">Naiara · Recanto do Açaí</p>
              <p className="mt-1 text-[11px] font-medium text-white/80">
                Orçamento e reserva online na hora 💜
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar chat"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Corpo de Mensagens */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-purple-100"
        >
          {messages.length === 0 && (
            <>
              <Bubble from="assistant">
                Oi! ☀️ Sou a Naiara, do Recanto do Açaí. Me conta a ocasião e a data
                que você está pensando, ou selecione uma das opções abaixo para eu calcular seu orçamento: 🍨💜
              </Bubble>

              {/* Quebra-gelos (Icebreakers) com visual premium */}
              <div className="space-y-2 pt-2 max-w-[85%]">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#a690c2] mb-1">Perguntas Frequentes:</p>
                <button
                  type="button"
                  onClick={() => handleIcebreaker("Quanto custa o Combo Duplo?")}
                  className="w-full text-left text-xs text-[#7c1fd6] bg-white hover:bg-[#7c1fd6]/5 border border-[#e9ddf6] rounded-2xl px-4 py-2.5 transition-all shadow-sm hover:scale-[1.02] active:scale-95 font-medium"
                >
                  🍦 Quanto custa o Combo Duplo?
                </button>
                <button
                  type="button"
                  onClick={() => handleIcebreaker("Quero ver se minha data está livre")}
                  className="w-full text-left text-xs text-[#7c1fd6] bg-white hover:bg-[#7c1fd6]/5 border border-[#e9ddf6] rounded-2xl px-4 py-2.5 transition-all shadow-sm hover:scale-[1.02] active:scale-95 font-medium"
                >
                  📅 Quero ver se minha data está livre
                </button>
                <button
                  type="button"
                  onClick={() => handleIcebreaker("Como funciona a reserva online?")}
                  className="w-full text-left text-xs text-[#7c1fd6] bg-white hover:bg-[#7c1fd6]/5 border border-[#e9ddf6] rounded-2xl px-4 py-2.5 transition-all shadow-sm hover:scale-[1.02] active:scale-95 font-medium"
                >
                  ⚡ Como funciona a reserva online?
                </button>
              </div>
            </>
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

          {/* Indicador de "Naiara está digitando..." */}
          {busy && (
            <Bubble from="assistant">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#a690c2] font-semibold animate-pulse">Naiara está escrevendo...</span>
                <span className="inline-flex gap-1.5 py-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#7c1fd6] [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#7c1fd6] [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#7c1fd6]" />
                </span>
              </div>
            </Bubble>
          )}

          {error && (
            <Bubble from="assistant">
              Ops, tive um probleminha para responder agora. Tenta mandar novamente em instantes? 🙏
            </Bubble>
          )}
        </div>

        {/* Input Form do Chat */}
        <form onSubmit={handleSubmit} className="border-t border-[#e9ddf6] bg-white/70 p-3 shrink-0">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre preços ou datas..."
              className="min-w-0 flex-1 rounded-2xl border border-[#e9ddf6] bg-white px-4 py-3 text-sm text-[#2a1140] outline-none placeholder:text-[#a690c2] focus:border-[#7c1fd6] transition-colors"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#7c1fd6] text-white transition-all hover:bg-[#6a17ba] active:scale-95 disabled:opacity-40"
              aria-label="Enviar"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </section>

      {/* Botão Flutuante Principal do Chat (Canto Direito) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-[#7c1fd6] px-5 py-4 font-bold text-white shadow-xl shadow-[#7c1fd6]/30 transition hover:-translate-y-0.5 hover:bg-[#6a17ba] active:scale-95"
      >
        {open ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
        <span>{open ? "Fechar" : "Falar com a Naiara"}</span>
      </button>
    </div>
  );
}

function Bubble({ from, children }: { from: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = from === "user";
  return (
    <div className={isUser ? "flex justify-end animate-fade-in" : "flex justify-start animate-fade-in"}>
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl rounded-br-md bg-[#7c1fd6] px-4 py-2.5 text-xs sm:text-sm leading-relaxed text-white shadow-sm whitespace-pre-line"
            : "max-w-[85%] rounded-2xl rounded-bl-md border border-[#e9ddf6] bg-white px-4 py-2.5 text-xs sm:text-sm leading-relaxed text-[#2a1140] shadow-sm whitespace-pre-line"
        }
      >
        {children}
      </div>
    </div>
  );
}
