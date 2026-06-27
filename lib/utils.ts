import { site } from "./content";

/** Monta um link wa.me com a mensagem pré-preenchida. */
export function waLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Formata um número como Real brasileiro, sem centavos. Valores não-finitos viram 0. */
export function brl(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });
}

/** Junta classes condicionalmente. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
