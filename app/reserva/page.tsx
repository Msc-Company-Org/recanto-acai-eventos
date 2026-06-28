"use client";

import { useEffect, useState, Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { brl } from "@/lib/utils";
import { track, EVENTS } from "@/lib/tracking";

function ReservaContent() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [tipoFesta, setTipoFesta] = useState("aniversario");
  const [regiao, setRegiao] = useState("capital"); // capital, baixada, niteroi
  const [convidados, setConvidados] = useState(120);

  const [pacoteId, setPacoteId] = useState("combo");
  const [extraPremium, setExtraPremium] = useState(0);
  const [extraNormal, setExtraNormal] = useState(0);

  const [selectedPayType, setSelectedPayType] = useState<"sinal" | "total">("sinal");
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState("");

  // Parse inicial dos query params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      if (search.get("nome")) setNome(search.get("nome") || "");
      if (search.get("whatsapp")) setWhatsapp(search.get("whatsapp") || "");
      if (search.get("data")) setDataEvento(search.get("data") || "");
      if (search.get("tipo")) setTipoFesta(search.get("tipo") || "aniversario");
      if (search.get("pacote")) setPacoteId(search.get("pacote") || "combo");
      if (search.get("extraPremium")) setExtraPremium(Number(search.get("extraPremium") || 0));
      if (search.get("extraNormal")) setExtraNormal(Number(search.get("extraNormal") || 0));
      if (search.get("convidados")) setConvidados(Number(search.get("convidados") || 120));
      if (search.get("leadId")) setLeadId(search.get("leadId") || "");
    }
  }, []);

  // Cálculo de Preço Dinâmico
  const precoBase = pacoteId === "combo" ? 1690 : 1490;
  const adicionais = (extraPremium * 350) + (extraNormal * 250);
  
  // Frete baseado na região
  let frete = 0;
  if (regiao === "baixada") frete = 150;
  else if (regiao === "niteroi") frete = 250;

  const total = precoBase + adicionais + frete;
  const sinal = total / 2;
  const pName = pacoteId === "combo" ? "Açaí + Sorvete (Combo Duplo)" : "Açaí ou Sorvete (Pacote Único)";

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !whatsapp.trim() || !dataEvento) {
      alert("Por favor, preencha seu Nome, WhatsApp e escolha a Data do Evento.");
      return;
    }

    setLoading(true);

    // 1. Nutrição do Lead (Salva/Atualiza o lead silenciosamente no Supabase)
    let finalLeadId = leadId;
    try {
      const leadRes = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          whatsapp,
          tipo: tipoFesta,
          data: dataEvento,
          convidados,
          pacote: pacoteId,
          extraPremium,
          extraNormal,
          total,
          source: "reserva-checkout",
        }),
      });
      const leadData = await leadRes.json();
      if (leadData?.id) {
        finalLeadId = leadData.id;
        setLeadId(leadData.id);
      }
    } catch (err) {
      console.error("[reserva] Falha ao nutrir lead:", err);
    }

    // 2. Disparar Analytics
    track(EVENTS.INICIO_CHECKOUT, {
      value: selectedPayType === "sinal" ? sinal : total,
      currency: "BRL",
      pacote: pName,
      tipo_pagamento: selectedPayType,
    });

    // 3. Redirecionar para a Stripe com o valor final
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacote: pacoteId,
          modo: selectedPayType,
          extraPremium,
          extraNormal,
          frete,
          leadId: finalLeadId,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redireciona para o checkout amigável
      } else {
        alert(data.error || "Não conseguimos iniciar o checkout. Fale conosco pelo WhatsApp.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o gateway de pagamento.");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-28">
      <form onSubmit={handleCheckout} className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-12">
        
        {/* Esquerda: Formulário de Confirmação & Nutrição */}
        <div className="space-y-6">
          <div className="glass-strong rounded-3xl p-6 sm:p-8 space-y-5">
            <div>
              <h1 className="font-display text-2xl font-bold text-[#2a1140]">
                Dados do seu Evento
              </h1>
              <p className="text-xs text-muted mt-1">
                Preencha os campos abaixo para reservar sua data com equipe própria exclusiva.
              </p>
            </div>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">Seu Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Maria Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white/50 px-4 py-3 text-sm text-ink focus:border-[#7c1fd6] focus:outline-none"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">WhatsApp para Contato</label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: (21) 99999-9999"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white/50 px-4 py-3 text-sm text-ink focus:border-[#7c1fd6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Data */}
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">Data da Festa</label>
                  <input
                    type="date"
                    required
                    value={dataEvento}
                    onChange={(e) => setDataEvento(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white/50 px-4 py-3 text-sm text-ink focus:border-[#7c1fd6] focus:outline-none"
                  />
                </div>

                {/* Tipo de Festa */}
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">Ocasião</label>
                  <select
                    value={tipoFesta}
                    onChange={(e) => setTipoFesta(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white/50 px-3 py-3 text-sm text-ink focus:border-[#7c1fd6] focus:outline-none"
                  >
                    <option value="casamento">Casamento</option>
                    <option value="15anos">15 Anos</option>
                    <option value="infantil">Festa Infantil</option>
                    <option value="aniversario">Aniversário</option>
                    <option value="corporativo">Corporativo</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              {/* Região do Evento (Cálculo de Frete) */}
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">Local do Evento (Região)</label>
                <select
                  value={regiao}
                  onChange={(e) => setRegiao(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white/50 px-3 py-3 text-sm text-ink focus:border-[#7c1fd6] focus:outline-none"
                >
                  <option value="capital">Rio de Janeiro - Capital (Frete Grátis)</option>
                  <option value="baixada">Baixada Fluminense (+ R$ 150,00 de Frete)</option>
                  <option value="niteroi">Niterói / São Gonçalo (+ R$ 250,00 de Frete)</option>
                </select>
              </div>
            </div>

            {/* Resumo da Estação & Adicionais */}
            <div className="border-t border-line pt-4 space-y-3">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Menu Selecionado</h3>
              
              <div className="flex justify-between text-sm text-muted">
                <span>{pName} (Base 120 pessoas)</span>
                <span>{brl(precoBase)}</span>
              </div>

              {extraPremium > 0 && (
                <div className="flex justify-between text-sm text-muted">
                  <span>+ {extraPremium} Sabor Extra Premium</span>
                  <span>{brl(extraPremium * 350)}</span>
                </div>
              )}

              {extraNormal > 0 && (
                <div className="flex justify-between text-sm text-muted">
                  <span>+ {extraNormal} Sabor Extra Normal</span>
                  <span>{brl(extraNormal * 250)}</span>
                </div>
              )}

              {frete > 0 && (
                <div className="flex justify-between text-sm text-muted">
                  <span>Taxa de Frete/Logística</span>
                  <span>{brl(frete)}</span>
                </div>
              )}

              <div className="border-t border-line pt-3 flex justify-between items-baseline">
                <span className="font-display text-base font-bold text-ink">Investimento Total:</span>
                <span className="font-display text-xl font-bold text-gold">{brl(total)}</span>
              </div>
            </div>
          </div>

          {/* Selo de Garantia */}
          <div className="flex items-center gap-3 p-4 bg-[#7c1fd6]/5 rounded-2xl border border-[#7c1fd6]/15">
            <span className="text-2xl">🔒</span>
            <p className="text-[11px] text-[#70548b] leading-relaxed">
              Utilizamos segurança criptografada de nível bancário para o processamento das transações. Seus dados estão 100% protegidos e sua data garantida de forma imediata na agenda.
            </p>
          </div>
        </div>

        {/* Direita: Opções de Pagamento e Botão de Ação */}
        <div className="glass-strong rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">
              Garantia da Data
            </h2>
            <p className="text-xs text-muted mt-1.5">
              Escolha o formato de pagamento do sinal para travar a data:
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
                <p className="text-[10px] text-[#7c1fd6] font-bold mt-0.5">
                  ou 3x de {brl(sinal / 3)} sem juros no cartão
                </p>
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
                <p className="text-[10px] text-gold font-bold mt-0.5">
                  ou 3x de {brl(total / 3)} sem juros no cartão
                </p>
                <p className="text-[11px] text-muted mt-1 leading-normal">
                  Deixe tudo quitado. Ideal para casamentos e corporativos, sem nenhuma pendência no dia da festa.
                </p>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gold text-bg font-bold py-4 text-base hover:bg-gold-soft shadow-gold transition-colors disabled:opacity-50 cta-attention"
            >
              {loading ? "Processando..." : `Confirmar Reserva (Pix / Cartão 3x) 💳`}
            </button>
            <p className="text-center text-[10px] text-muted">
              Cancelamento grátis até 14 dias antes do evento.
            </p>
          </div>

        </div>

      </form>
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
