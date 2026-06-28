import Link from "next/link";
import { Calendar } from "lucide-react";

interface Props {
  variant?: "inline" | "end";
}

export function BlogCta({ variant = "end" }: Props) {
  if (variant === "inline") {
    return (
      <div className="my-10 glass rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 border border-gold/20">
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <p className="font-display text-xl font-bold text-ink">Sua data ainda está disponível?</p>
          <p className="text-muted text-sm mt-1">Verifique agora e garanta a exclusividade do seu evento.</p>
        </div>
        <Link
          href="/reserva"
          className="shrink-0 inline-flex items-center gap-2 rounded-full bg-gold text-bg font-bold px-6 py-3 hover:bg-gold-soft shadow-gold transition-colors text-sm whitespace-nowrap"
        >
          <Calendar className="w-4 h-4" />
          Reserve Seu Evento
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-12 glass-strong rounded-2xl p-8 text-center border border-gold/20">
      <p className="font-display text-2xl font-bold text-ink mb-2">
        Pronto para garantir sua data?
      </p>
      <p className="text-muted mb-6 max-w-md mx-auto">
        Pagamento 100% online — 6x sem juros no cartão ou Pix. Data bloqueada na hora, sem burocracia.
      </p>
      <Link
        href="/reserva"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-gold text-bg font-bold px-8 py-4 hover:bg-gold-soft shadow-gold transition-colors text-base"
      >
        🍇 Reserve Seu Evento Agora
      </Link>
      <p className="text-xs text-muted mt-4">Pagamento totalmente seguro · Apenas 1 evento por data</p>
    </div>
  );
}
