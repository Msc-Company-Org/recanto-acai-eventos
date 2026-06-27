"use client";

import { useEffect } from "react";
import { track, EVENTS } from "@/lib/tracking";

/**
 * Dispara a conversão de reserva paga na página de obrigado (uma vez), com valor e id de dedup.
 * Na /obrigado o efeito roda ANTES do script do gtag carregar, então esperamos o gtag ficar
 * pronto antes de disparar — senão a conversão do Google Ads seria pulada.
 */
export function TrackReserva({
  value,
  transactionId,
}: {
  value?: number;
  transactionId?: string;
}) {
  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const fire = () => {
      if (cancelled) return;
      if (typeof window.gtag === "function" || tries++ >= 40) {
        track(EVENTS.RESERVA_PAGA, {
          value,
          currency: "BRL",
          transaction_id: transactionId,
        });
      } else {
        setTimeout(fire, 150); // aguarda o gtag (até ~6s) antes de desistir
      }
    };
    fire();
    return () => {
      cancelled = true;
    };
  }, [value, transactionId]);
  return null;
}
