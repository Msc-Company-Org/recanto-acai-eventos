"use client";

import Link from "next/link";

export function ReservarOnline({ pacote }: { pacote: string }) {
  return (
    <div className="mt-6">
      <Link
        href={`/reserva?pacote=${pacote}`}
        className="w-full flex rounded-full bg-gold text-bg font-bold py-4 text-base hover:bg-gold-soft shadow-gold transition-colors items-center justify-center cta-attention"
      >
        Reservar este Pacote
      </Link>
      <p className="text-center text-xs text-muted mt-2.5">
        🔒 Pagamento seguro · só 1 evento por data — a sua fica reservada na hora
      </p>
    </div>
  );
}
