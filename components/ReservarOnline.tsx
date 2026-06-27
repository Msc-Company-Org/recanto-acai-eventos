"use client";

import { useState } from "react";
import { track, EVENTS } from "@/lib/tracking";
import { valorReserva } from "@/lib/pricing";

/** CTA principal: reserva/pagamento direto no site (Stripe). Sinal de 50% = data reservada. */
export function ReservarOnline({ pacote }: { pacote: string }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function go(modo: "sinal" | "total") {
    setLoading(modo);
    try {
      track(EVENTS.INICIO_CHECKOUT, {
        pacote,
        modo,
        value: valorReserva(pacote, modo),
        currency: "BRL",
      });
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pacote, modo }),
      });
      const d = await r.json();
      if (d?.url) {
        window.location.href = d.url;
        return;
      }
      alert("Não consegui iniciar o pagamento agora. Fala com a gente no WhatsApp 💜");
    } catch {
      alert("Erro ao iniciar o pagamento. Fala com a gente no WhatsApp 💜");
    }
    setLoading(null);
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        disabled={!!loading}
        onClick={() => go("sinal")}
        className="w-full rounded-full bg-gold text-bg font-bold py-4 text-base hover:bg-gold-soft shadow-gold transition-colors disabled:opacity-60 cta-attention"
      >
        {loading === "sinal" ? "Abrindo pagamento..." : "Reservar com 50% de entrada"}
      </button>
      <button
        type="button"
        disabled={!!loading}
        onClick={() => go("total")}
        className="w-full mt-2 rounded-full border border-primary/40 text-ink text-sm font-semibold py-3 hover:bg-primary/10 hover:border-primary transition-colors disabled:opacity-60"
      >
        {loading === "total" ? "Abrindo..." : "ou pagar o valor total"}
      </button>
      <p className="text-center text-xs text-muted mt-2.5">
        🔒 Pagamento seguro · só 1 evento por data — a sua fica reservada na hora
      </p>
    </div>
  );
}
