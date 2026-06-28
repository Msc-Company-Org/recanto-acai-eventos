"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { packages, eventTypes } from "@/lib/content";
import { brl, waLink } from "@/lib/utils";
import { track, EVENTS } from "@/lib/tracking";
import { WhatsappIcon } from "./primitives";

type FormState = {
  nome: string;
  whatsapp: string;
  data: string;
  tipo: string;
  convidados: string;
  pacote: string;
  extraPremium: number;
  extraNormal: number;
};

type UtmData = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  gclid: string;
};

function readUtms(): UtmData {
  if (typeof window === "undefined") return { utmSource: "", utmMedium: "", utmCampaign: "", utmContent: "", gclid: "" };
  const stored = sessionStorage.getItem("recanto_utms");
  if (stored) {
    try { return JSON.parse(stored) as UtmData; } catch { /* ignore */ }
  }
  const p = new URLSearchParams(window.location.search);
  const data: UtmData = {
    utmSource: p.get("utm_source") ?? "",
    utmMedium: p.get("utm_medium") ?? "",
    utmCampaign: p.get("utm_campaign") ?? "",
    utmContent: p.get("utm_content") ?? "",
    gclid: p.get("gclid") ?? "",
  };
  if (data.utmSource || data.gclid) {
    sessionStorage.setItem("recanto_utms", JSON.stringify(data));
  }
  return data;
}

const inputCls =
  "w-full rounded-xl bg-bg/60 border border-line px-4 py-3 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

export function QuoteForm() {
  const [form, setForm] = useState<FormState>({
    nome: "",
    whatsapp: "",
    data: "",
    tipo: eventTypes.items[0].label,
    convidados: "",
    pacote: "combo",
    extraPremium: 0,
    extraNormal: 0,
  });
  const utms = useRef<UtmData>({ utmSource: "", utmMedium: "", utmCampaign: "", utmContent: "", gclid: "" });
  const formStarted = useRef(false);

  useEffect(() => {
    utms.current = readUtms();
  }, []);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleFormStart() {
    if (formStarted.current) return;
    formStarted.current = true;
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "form_start", form_name: "orcamento" });
      if (typeof window.gtag === "function") {
        window.gtag("event", "form_start", { form_name: "orcamento" });
      }
      if (typeof window.fbq === "function") {
        window.fbq("trackCustom", "FormStart", { form_name: "orcamento" });
      }
    }
  }

  const pkg = packages.options.find((p) => p.id === form.pacote) ?? packages.options[1];
  const premiumPrice = packages.addons.items[0].price;
  const normalPrice = packages.addons.items[1].price;

  const total = useMemo(
    () => pkg.price + form.extraPremium * premiumPrice + form.extraNormal * normalPrice,
    [pkg, form.extraPremium, form.extraNormal, premiumPrice, normalPrice]
  );

  const message = useMemo(() => {
    const linhas = [
      "Olá, Recanto! 🍇 Quero um orçamento para o meu evento:",
      form.nome && `• Nome: ${form.nome}`,
      `• Tipo: ${form.tipo}`,
      form.data && `• Data: ${form.data}`,
      form.convidados && `• Convidados: ${form.convidados}`,
      `• Pacote: ${pkg.name} (${brl(pkg.price)})`,
      form.extraPremium > 0 && `• Sabores extra premium: ${form.extraPremium}`,
      form.extraNormal > 0 && `• Sabores extra normais: ${form.extraNormal}`,
      `• Estimativa: ${brl(total)}`,
    ].filter(Boolean);
    return linhas.join("\n");
  }, [form, pkg, total]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim() || !form.whatsapp.trim()) {
      const region = document.getElementById("quote-nome");
      region?.focus();
      // Em vez de alert, foco + announce via elemento com role=alert (criado on-demand).
      const alertEl = document.getElementById("quote-form-error");
      if (alertEl) {
        alertEl.textContent = "Por favor, preencha seu nome e WhatsApp.";
      } else {
        const div = document.createElement("div");
        div.id = "quote-form-error";
        div.setAttribute("role", "alert");
        div.setAttribute("aria-live", "assertive");
        div.className = "sr-only";
        div.textContent = "Por favor, preencha seu nome e WhatsApp.";
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 5000);
      }
      return;
    }

    // Conversão principal (Lead)
    track(EVENTS.ENVIO_FORMULARIO, {
      value: total,
      currency: "BRL",
      tipo: form.tipo,
      pacote: pkg.name,
    });

    // Lead qualificado (tem nome, whatsapp, data e pacote = qualificação completa)
    track(EVENTS.QUALIFY_LEAD, {
      value: total,
      currency: "BRL",
      tipo: form.tipo,
      pacote: pkg.name,
    });

    try {
      // Salvar lead localmente antes de avançar
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pacoteNome: pkg.name, total, ...utms.current }),
      });
      const dataRes = await res.json();
      
      const queryParams = new URLSearchParams({
        nome: form.nome,
        whatsapp: form.whatsapp,
        data: form.data,
        tipo: form.tipo,
        convidados: form.convidados,
        pacote: form.pacote,
        extraPremium: String(form.extraPremium),
        extraNormal: String(form.extraNormal),
        total: String(total),
        leadId: dataRes.id || "",
      });

      // Lead convertido: avança para a etapa de pagamento (close_convert_lead)
      track(EVENTS.CLOSE_CONVERT_LEAD, {
        value: total,
        currency: "BRL",
        tipo: form.tipo,
        pacote: pkg.name,
        leadId: dataRes.id || "",
      });

      // Redireciona para a página de Agendamento e Pagamento
      window.location.href = `/reserva?${queryParams.toString()}`;
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro ao processar. Vamos redirecionar para a página de reserva.");
      window.location.href = `/reserva`;
    }
  }

  return (
    <section id="orcamento" className="py-14 md:py-28">
      <div className="mx-auto max-w-2xl px-6">
        <div className="glass-strong rounded-3xl p-8 sm:p-10">
          <h2 className="font-display text-3xl font-bold text-ink text-center">
            Monte seu orçamento
          </h2>
          <p className="text-muted text-center mt-2">
            Simule em tempo real e avance para garantir seu dia na agenda.
          </p>

          <form onSubmit={handleSubmit} onFocus={handleFormStart} className="mt-8 space-y-5" noValidate>
            {/* Seletor de Data Estilizado como Calendário Gourmet */}
            <div className="bg-[#7c1fd6]/5 rounded-2xl p-5 border border-[#7c1fd6]/15 mb-4">
              <div className="flex justify-between items-center mb-3">
                <label htmlFor="quote-data" className="text-xs font-bold text-[#7c1fd6] uppercase tracking-wider block">
                  1. Selecione a Data no Calendário 📅
                </label>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-whats bg-whats/10 px-2 py-0.5 rounded-full animate-pulse" aria-hidden="true">
                  <span className="w-1.5 h-1.5 rounded-full bg-whats"></span> Agenda Online Disponível
                </span>
              </div>
              <input
                id="quote-data"
                required
                type="date"
                aria-required="true"
                aria-label="Data do evento"
                className="w-full rounded-xl bg-white border border-[#7c1fd6]/30 px-4 py-3 text-ink outline-none focus:border-[#7c1fd6] focus:ring-2 focus:ring-[#7c1fd6]/20 font-bold text-center text-base transition-all"
                value={form.data}
                onChange={(e) => set("data", e.target.value)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field id="quote-nome" label="Seu nome" required>
                <input
                  id="quote-nome"
                  required
                  aria-required="true"
                  autoComplete="name"
                  className={inputCls}
                  value={form.nome}
                  onChange={(e) => set("nome", e.target.value)}
                  placeholder="Como te chamamos?"
                />
              </Field>
              <Field id="quote-whatsapp" label="Seu WhatsApp" required>
                <input
                  id="quote-whatsapp"
                  required
                  aria-required="true"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  className={inputCls}
                  value={form.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder="(21) 9...."
                />
              </Field>
              <Field id="quote-convidados" label="Convidados (aprox.)" required>
                <input
                  id="quote-convidados"
                  required
                  aria-required="true"
                  type="number"
                  min={1}
                  className={inputCls}
                  value={form.convidados}
                  onChange={(e) => set("convidados", e.target.value)}
                  placeholder="50"
                />
              </Field>
              <Field id="quote-tipo" label="Tipo de evento">
                <select
                  id="quote-tipo"
                  className={inputCls}
                  value={form.tipo}
                  onChange={(e) => set("tipo", e.target.value)}
                >
                  {eventTypes.items.map((o) => (
                    <option key={o.label} value={o.label}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <fieldset>
              <legend className="block text-sm font-semibold text-ink mb-2">Pacote</legend>
              <div className="grid sm:grid-cols-2 gap-3">
                {packages.options.map((o) => (
                  <button
                    type="button"
                    key={o.id}
                    aria-pressed={form.pacote === o.id}
                    onClick={() => {
                      set("pacote", o.id);
                      track(EVENTS.SELECAO_PACOTE, { pacote: o.name });
                    }}
                    className={`rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                      form.pacote === o.id
                        ? "border-gold bg-gold/10 shadow-[0_0_0_3px_rgba(212,160,23,0.18)] -translate-y-0.5"
                        : "border-line bg-bg/40 hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    <div className="font-semibold text-ink">{o.name}</div>
                    <div className="text-gold font-display font-bold">{brl(o.price)}</div>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid sm:grid-cols-2 gap-4">
              <Counter
                id="extra-premium"
                label={`Sabor extra premium (+${brl(premiumPrice)})`}
                value={form.extraPremium}
                onChange={(v) => set("extraPremium", v)}
              />
              <Counter
                id="extra-normal"
                label={`Sabor extra normal (+${brl(normalPrice)})`}
                value={form.extraNormal}
                onChange={(v) => set("extraNormal", v)}
              />
            </div>

            <div
              className="rounded-2xl bg-primary/15 border border-primary p-5 text-center"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="text-xs uppercase tracking-widest text-muted">
                Estimativa do investimento
              </div>
              <div className="font-display text-4xl font-bold text-gold mt-1">{brl(total)}</div>
              <div className="text-xs text-muted mt-1">
                Tudo incluso: açaí/sorvete, acompanhamentos e equipe servindo na hora.
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold text-bg font-bold px-7 py-4 hover:bg-gold-soft transition-all shadow-glow cta-attention focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Avançar para Agendamento e Pagamento 💳
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <label htmlFor={id} className="block text-sm font-semibold text-ink mb-2">
        {label}{required && <span aria-hidden="true" className="text-gold ml-0.5">*</span>}
        {required && <span className="sr-only"> (obrigatório)</span>}
      </label>
      {children}
    </div>
  );
}

function Counter({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-10 h-10 rounded-lg bg-bg/60 border border-line text-ink hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Diminuir ${label}`}
        >
          –
        </button>
        <span id={id} className="w-8 text-center font-semibold text-ink" aria-live="polite" aria-atomic="true">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-10 h-10 rounded-lg bg-bg/60 border border-line text-ink hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Aumentar ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
