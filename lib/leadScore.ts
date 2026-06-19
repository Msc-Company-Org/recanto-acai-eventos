export type ScoreInput = {
  eventType?: string;
  package?: string;
  guests?: number | null;
  eventDate?: string | null;
  whatsapp?: string;
  name?: string;
  extraPremium?: number;
  extraNormal?: number;
};

// Eventos de maior ticket/intenção pontuam mais.
const HIGH = ["Casamentos", "15 anos", "Corporativo"];
const MED = ["Aniversário de 1 ano", "Formaturas", "Chá revelação"];

/**
 * Pontua o lead de 0 a 100 e classifica em quente/morno/frio.
 * Critérios: tipo de evento, pacote (combo), nº de convidados, data definida,
 * completude dos dados e interesse em sabores extras.
 */
export function computeScore(i: ScoreInput): { score: number; temperature: string } {
  let s = 0;

  if (i.eventType && HIGH.includes(i.eventType)) s += 30;
  else if (i.eventType && MED.includes(i.eventType)) s += 22;
  else if (i.eventType) s += 14;

  s += i.package === "combo" ? 20 : 10;

  const g = Number(i.guests) || 0;
  if (g >= 150) s += 25;
  else if (g >= 80) s += 18;
  else if (g >= 40) s += 12;
  else if (g > 0) s += 6;

  if (i.eventDate) s += 10;
  if (i.whatsapp) s += 8;
  if (i.name) s += 5;
  if ((i.extraPremium || 0) + (i.extraNormal || 0) > 0) s += 8;

  const score = Math.min(100, s);
  const temperature = score >= 70 ? "quente" : score >= 45 ? "morno" : "frio";
  return { score, temperature };
}
