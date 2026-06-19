export const STAGES = [
  { id: "novo", label: "Novo", color: "#8327ec" },
  { id: "contatado", label: "Contatado", color: "#3b82f6" },
  { id: "orcamento", label: "Orçamento", color: "#e6b800" },
  { id: "negociacao", label: "Negociação", color: "#f97316" },
  { id: "ganho", label: "Ganho", color: "#25d366" },
  { id: "perdido", label: "Perdido", color: "#ef4444" },
] as const;

export const STAGE_IDS = STAGES.map((s) => s.id) as string[];

export function stageLabel(id: string): string {
  return STAGES.find((s) => s.id === id)?.label ?? id;
}

export function stageColor(id: string): string {
  return STAGES.find((s) => s.id === id)?.color ?? "#8327ec";
}

export const TEMPERATURES: Record<string, { label: string; color: string; emoji: string }> = {
  quente: { label: "Quente", color: "#ef4444", emoji: "🔥" },
  morno: { label: "Morno", color: "#e6b800", emoji: "🌤️" },
  frio: { label: "Frio", color: "#3b82f6", emoji: "❄️" },
};
