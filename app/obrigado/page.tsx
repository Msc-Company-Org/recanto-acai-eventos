"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { track, EVENTS } from "@/lib/tracking";
import { CheckCircle, Calendar, HeartHandshake } from "lucide-react";

export default function ObrigadoPage() {
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const sessionId = search.get("session_id") || "";
    const valor = parseFloat(search.get("valor") || "0") || undefined;

    track(EVENTS.RESERVA_PAGA, {
      transaction_id: sessionId,
      value: valor,
      currency: "BRL",
    });
  }, []);

  return (
    <>
      <Header />
      <main className="bg-[#fdfaff] min-h-screen pt-28 pb-14 flex items-center justify-center">
        <div className="mx-auto max-w-xl px-6 text-center">
          <div className="glass-strong rounded-3xl p-8 sm:p-12 space-y-6 shadow-glow">
            
            {/* Ícone de Sucesso */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-whats/10 text-whats animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#2a1140] tracking-tight leading-tight">
              Sua data está reservada! 🎉
            </h1>
            
            <p className="text-[#6c5b80] text-sm leading-relaxed">
              Obrigado por escolher o <strong>Recanto do Açaí</strong>. O pagamento foi processado com sucesso pelo Stripe e sua data já foi travada em nossa agenda oficial.
            </p>

            <div className="border-t border-b border-line py-6 space-y-4 text-left">
              <h3 className="font-bold text-[#2a1140] text-sm text-center">
                Quais são os próximos passos?
              </h3>
              
              <div className="flex gap-3.5 items-start text-xs">
                <Calendar className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-ink">1. Confirmação por e-mail</h4>
                  <p className="text-muted mt-0.5">Você receberá o comprovante de reserva e os detalhes do seu pacote por e-mail em instantes.</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start text-xs">
                <HeartHandshake className="w-5 h-5 text-[#7c1fd6] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-ink">2. Contato da Produção</h4>
                  <p className="text-muted mt-0.5">Nossa equipe entrará em contato para confirmar todos os detalhes: local exato de montagem no salão, sabores e logística do dia.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full font-bold text-sm px-8 py-3.5 bg-[#7c1fd6] text-white hover:bg-[#6a17ba] transition-colors shadow-glow w-full sm:w-auto"
              >
                Voltar para a Página Inicial
              </Link>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
