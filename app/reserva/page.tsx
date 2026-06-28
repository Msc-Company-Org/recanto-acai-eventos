"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { brl } from "@/lib/utils";
import { packages } from "@/lib/content";
import { track, EVENTS } from "@/lib/tracking";

// Componente interno que lê os query params com useSearchParams
function ReservaContent() {
  const [params, setParams] = useState<Record<string, string>>({});
  const [selectedPayType, setSelectedPayType] = useState<"sinal" | "total">("sinal");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      const data: Record<string, string> = {};
      search.forEach((value, key) => {
        data[key] = value;
      });
      setParams(data);
    }
  }, []);

  const total = Number(params.total || 1690);
  const sinal = total / 2;
  const pacoteId = params.pacote || "combo";
  const pName = pacoteId === "combo" ? "Açaí + Sorvete (Combo Duplo)" : "Açaí ou Sorvete (Pacote Único)";

  async function handleCheckout() {
    setLoading(true);
    // Disparar tracking de início de checkout
    track(EVENTS.INICIO_CHECKOUT, {
      value: selectedPayType === "sinal" ? sinal : total,
      currency: "BRL",
      pacote: pName,
      tipo_pagamento: selectedPayType,
    });

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacote: pacoteId,
          pagarTotal: selectedPayType === "total",
          leadId: params.leadId || "",
          // Passamos informações adicionais de cálculo
          extraPremium: Number(params.extraPremium || 0),
          extraNormal: Number(params.extraNormal || 0),
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redireciona para o checkout do Stripe
      } else {
        alert("Erro ao criar a sessão de pagamento. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o meio de pagamento.");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-28">
      <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-12">
        
        {/* Esquerda: Resumo Comercial */}
        <div className="space-y-6">
          <div className="glass-strong rounded-3xl p-6 sm:p-8 space-y-4">
            <h1 className="font-display text-3xl font-bold text-[#2a1140]">
              Sua Estação Gourmet
            </h1>
            <p className="text-sm text-muted">
              Por favor, confirme os detalhes da sua reserva online antes de realizar o pagamento.
            </p>

            <div className="border-t border-line pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-ink">Responsável:</span>
                <span className="text-[#7c1fd6]">{params.nome || "Não informado"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-ink">WhatsApp:</span>
                <span className="text-muted">{params.whatsapp || "Não informado"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-ink">Data Solicitada:</span>
                <span className="text-gold font-bold">{params.data || "Não informado"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-ink">Celebração:</span>
                <span className="text-muted capitalize">{params.tipo || "Não informado"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-ink">Nº de Convidados:</span>
                <span className="text-muted">{params.convidados || "120"} pessoas</span>
              </div>
            </div>

            <div className="border-t border-line pt-4 space-y-2">
              <h3 className="text-sm font-bold text-ink">Menu & Sabores</h3>
              <div className="flex justify-between text-sm text-muted">
                <span>{pName}</span>
                <span>{brl(pacoteId === "combo" ? 1690 : 1490)}</span>
              </div>
              {Number(params.extraPremium) > 0 && (
                <div className="flex justify-between text-sm text-muted">
                  <span>+ {params.extraPremium} Sabor Extra Premium</span>
                  <span>{brl(Number(params.extraPremium) * 350)}</span>
                </div>
              )}
              {Number(params.extraNormal) > 0 && (
                <div className="flex justify-between text-sm text-muted">
                  <span>+ {params.extraNormal} Sabor Extra Normal</span>
                  <span>{brl(Number(params.extraNormal) * 250)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-line pt-4 flex justify-between items-baseline">
              <span className="font-display text-lg font-bold text-ink">Investimento Total:</span>
              <span className="font-display text-2xl font-bold text-gold">{brl(total)}</span>
            </div>
          </div>

          {/* Selo de Garantia */}
          <div className="flex items-center gap-3 p-4 bg-[#7c1fd6]/5 rounded-2xl border border-[#7c1fd6]/15">
            <span className="text-2xl">🔒</span>
            <p className="text-xs text-[#70548b] leading-relaxed">
              O Recanto do Açaí utiliza a tecnologia de criptografia do <strong>Stripe</strong> para processamento de pagamentos. Seus dados estão 100% blindados e seguros.
            </p>
          </div>
        </div>

        {/* Direita: Opções de Pagamento e Botão de Ação */}
        <div className="glass-strong rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">
              Método de Reserva
            </h2>
            <p className="text-xs text-muted mt-1.5">
              Escolha como deseja confirmar sua data na agenda oficial:
            </p>

            <div className="mt-6 space-y-3">
              {/* Opção A: Pagar Sinal */}
              <button
                type="button"
                onClick={() => setSelectedPayType("sinal")}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedPayType === "sinal"
                    ? "border-[#7c1fd6] bg-[#7c1fd6]/5 shadow-[0_0_0_2px_rgba(124,31,214,0.15)]"
                    : "border-line bg-white hover:border-[#7c1fd6]/50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-ink">Pagar 50% de Sinal</span>
                  <span className="text-xs font-semibold text-[#7c1fd6] bg-[#7c1fd6]/10 px-2 py-0.5 rounded">Mais escolhido</span>
                </div>
                <div className="font-display text-2xl font-bold text-[#7c1fd6] mt-2">
                  {brl(sinal)}
                </div>
                <p className="text-[11px] text-muted mt-1 leading-normal">
                  Pague metade agora para travar a data. O saldo restante (outros 50%) é pago no dia do evento.
                </p>
              </button>

              {/* Opção B: Pagar Total */}
              <button
                type="button"
                onClick={() => setSelectedPayType("total")}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedPayType === "total"
                    ? "border-[#7c1fd6] bg-[#7c1fd6]/5 shadow-[0_0_0_2px_rgba(124,31,214,0.15)]"
                    : "border-line bg-white hover:border-[#7c1fd6]/50"
                }`}
              >
                <span className="text-sm font-bold text-ink">Pagar Valor Total</span>
                <div className="font-display text-2xl font-bold text-gold mt-2">
                  {brl(total)}
                </div>
                <p className="text-[11px] text-muted mt-1 leading-normal">
                  Deixe tudo quitado. Ideal para eventos corporativos e casamentos sem pendências no dia da festa.
                </p>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full rounded-full bg-gold text-bg font-bold py-4 text-base hover:bg-gold-soft shadow-gold transition-colors disabled:opacity-50 cta-attention"
            >
              {loading ? "Processando..." : `Confirmar com ${selectedPayType === "sinal" ? "Sinal" : "Pagamento Total"} 💳`}
            </button>
            <p className="text-center text-[10px] text-muted">
              Cancelamento grátis até 14 dias antes do evento.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function ReservaPage() {
  return (
    <>
      <Header />
      <main className="bg-[#fdfaff] min-h-screen">
        <Suspense fallback={
          <div className="h-screen w-screen flex items-center justify-center text-primary font-bold">
            Carregando sua reserva...
          </div>
        }>
          <ReservaContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
