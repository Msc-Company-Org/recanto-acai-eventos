"use client";

import { useMemo, useState } from "react";
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

const inputCls =
  "w-full rounded-xl bg-bg/60 border border-line px-4 py-3 text-ink outline-none focus:border-primary transition-colors";

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

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Conversão principal (Lead) — value/currency p/ otimização de campanha.
    track(EVENTS.ENVIO_FORMULARIO, {
      value: total,
      currency: "BRL",
      tipo: form.tipo,
      pacote: pkg.name,
    });
    // Registro best-effort — não bloqueia o WhatsApp (lead principal vai pelo wa.me).
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, pacoteNome: pkg.name, total }),
    }).catch(() => {});
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  }

  return (
    <section id="orcamento" className="py-20 md:py-28 bg-bg-soft">
      <div className="mx-auto max-w-2xl px-6">
        <div className="glass-strong rounded-3xl p-8 sm:p-10">
          <h2 className="font-display text-3xl font-bold text-ink text-center">
            Monte seu orçamento
          </h2>
          <p className="text-muted text-center mt-2">
            Preencha em 30 segundos e mande direto pro nosso WhatsApp.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Seu nome">
                <input
                  className={inputCls}
                  value={form.nome}
                  onChange={(e) => set("nome", e.target.value)}
                  placeholder="Como te chamamos?"
                />
              </Field>
              <Field label="Seu WhatsApp">
                <input
                  className={inputCls}
                  value={form.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder="(21) 9...."
                  inputMode="tel"
                />
              </Field>
              <Field label="Data do evento">
                <input
                  type="date"
                  className={inputCls}
                  value={form.data}
                  onChange={(e) => set("data", e.target.value)}
                />
              </Field>
              <Field label="Convidados (aprox.)">
                <input
                  type="number"
                  min={1}
                  className={inputCls}
                  value={form.convidados}
                  onChange={(e) => set("convidados", e.target.value)}
                  placeholder="50"
                />
              </Field>
            </div>

            <Field label="Tipo de evento">
              <select
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

            <div>
              <span className="block text-sm font-semibold text-ink mb-2">Pacote</span>
              <div className="grid sm:grid-cols-2 gap-3">
                {packages.options.map((o) => (
                  <button
                    type="button"
                    key={o.id}
                    onClick={() => {
                      set("pacote", o.id);
                      track(EVENTS.SELECAO_PACOTE, { pacote: o.name });
                    }}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      form.pacote === o.id
                        ? "border-gold bg-gold/10"
                        : "border-line bg-bg/40 hover:border-primary"
                    }`}
                  >
                    <div className="font-semibold text-ink">{o.name}</div>
                    <div className="text-gold font-display font-bold">{brl(o.price)}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Counter
                label={`Sabor extra premium (+${brl(premiumPrice)})`}
                value={form.extraPremium}
                onChange={(v) => set("extraPremium", v)}
              />
              <Counter
                label={`Sabor extra normal (+${brl(normalPrice)})`}
                value={form.extraNormal}
                onChange={(v) => set("extraNormal", v)}
              />
            </div>

            <div className="rounded-2xl bg-primary/15 border border-primary p-5 text-center">
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-whats text-white font-semibold px-7 py-4 hover:bg-whats-dark transition-all shadow-glow"
            >
              <WhatsappIcon /> Reservar data no WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-ink mb-2">{label}</span>
      {children}
    </label>
  );
}

function Counter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <span className="block text-sm font-semibold text-ink mb-2">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-10 h-10 rounded-lg bg-bg/60 border border-line text-ink hover:border-primary transition-colors"
          aria-label="Diminuir"
        >
          –
        </button>
        <span className="w-8 text-center font-semibold text-ink">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-10 h-10 rounded-lg bg-bg/60 border border-line text-ink hover:border-primary transition-colors"
          aria-label="Aumentar"
        >
          +
        </button>
      </div>
    </div>
  );
}
