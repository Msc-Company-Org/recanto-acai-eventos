import { STAGE_IDS } from "./crm-constants";

/** Campos mínimos de um lead usados nas estatísticas (desacoplado do schema/DB). */
export type StatLead = {
  stage: string;
  temperature: string | null;
  score: number | null;
  source: string | null;
  estimatedValue: number | null;
  createdAt: Date | string;
};

/**
 * Agrega estatísticas do dashboard a partir de uma lista de leads. PURA e robusta:
 * tolera lista vazia, campos null e divisão por zero (conversão = 0 quando nada fechado).
 */
export function computeStats<T extends StatLead>(all: T[]) {
  const total = all.length;
  const byStage: Record<string, number> = {};
  STAGE_IDS.forEach((s) => (byStage[s] = 0));
  const byTemp: Record<string, number> = { quente: 0, morno: 0, frio: 0 };
  const bySource: Record<string, { count: number; value: number }> = {};
  let pipelineValue = 0;
  let scoreSum = 0;
  let won = 0;
  let lost = 0;
  let revenue = 0;

  for (const l of all) {
    if (l.stage) byStage[l.stage] = (byStage[l.stage] || 0) + 1;
    if (l.temperature) byTemp[l.temperature] = (byTemp[l.temperature] || 0) + 1;
    scoreSum += Number(l.score) || 0;
    const src = l.source || "site";
    if (!bySource[src]) bySource[src] = { count: 0, value: 0 };
    bySource[src].count += 1;
    const val = Number(l.estimatedValue) || 0;
    if (l.stage === "ganho") {
      won += 1;
      revenue += val;
      bySource[src].value += val;
    } else if (l.stage === "perdido") {
      lost += 1;
    } else {
      pipelineValue += val;
    }
  }

  const avgScore = total > 0 ? Math.round(scoreSum / total) : 0;
  const closed = won + lost;
  const conversion = closed > 0 ? Math.round((won / closed) * 100) : 0;
  const recent = all
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 8);

  return { total, byStage, byTemp, bySource, pipelineValue, revenue, avgScore, conversion, won, lost, recent };
}
