"use client";

import Link from "next/link";
import { CalendarClock, ShieldCheck, AlertTriangle, ArrowRight } from "lucide-react";

export function UrgencySection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-bg to-[#7c1fd6]/5 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="mx-auto max-w-4xl px-6 relative z-10">
        <div className="glass-strong border border-[#7c1fd6]/20 rounded-3xl p-8 sm:p-12 shadow-glow card-3d">
          
          <div className="grid md:grid-cols-[1.1fr_auto_0.9fr] gap-8 items-center">
            
            {/* Esquerda: Ganhos & Alertas */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#7c1fd6]/10 border border-[#7c1fd6]/20 rounded-full px-3.5 py-1 text-xs font-bold text-[#7c1fd6]">
                <AlertTriangle className="w-3.5 h-3.5 text-gold shrink-0 animate-bounce" /> Exclusividade Máxima
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight text-pretty">
                Datas de fim de semana somem rápido
              </h2>
              <p className="text-sm text-muted leading-relaxed text-pretty">
                Para manter nosso padrão de qualidade gourmet impecável e garantir que nossa equipe principal esteja presente servindo e coordenando tudo, <strong>atendemos apenas 1 único evento por dia</strong>.
              </p>
              <div className="flex items-center gap-2.5 text-xs text-[#70548b] font-semibold">
                <ShieldCheck className="w-4.5 h-4.5 text-whats shrink-0" />
                <span>Exclusividade garantida no seu contrato</span>
              </div>
            </div>

            {/* Divisor vertical */}
            <div className="hidden md:block w-px h-32 bg-line"></div>

            {/* Direita: Call to Action de Reserva */}
            <div className="space-y-6">
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#7c1fd6]/10 rounded-2xl text-[#7c1fd6]">
                    <CalendarClock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Garanta sua Data Já</h3>
                    <p className="text-xs text-muted mt-0.5">As datas de fins de semana estão sendo reservadas.</p>
                  </div>
                </div>
                <p className="text-xs text-muted leading-normal">
                  Uma vez bloqueado o dia na agenda por um cliente, a data é removida do site na hora e fica exclusiva para você. Garanta a segurança do seu planejamento.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Link
                  href="/#orcamento"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold text-bg font-bold text-sm px-6 py-3.5 hover:bg-gold-soft shadow-gold transition-colors w-full cta-attention focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  Garantir sua Data <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/#pacotes"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 text-ink font-semibold text-xs px-6 py-3 transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Ver Pacotes Disponíveis
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
