import { describe, it, expect } from "vitest";
import { computeStats, type StatLead } from "./stats";

const L = (o: Partial<StatLead>): StatLead => ({
  stage: "novo",
  temperature: "frio",
  score: 0,
  source: "site",
  estimatedValue: 0,
  createdAt: new Date("2026-06-01"),
  ...o,
});

describe("computeStats", () => {
  it("lista vazia não gera NaN (divisão por zero protegida)", () => {
    const s = computeStats([]);
    expect(s.total).toBe(0);
    expect(s.conversion).toBe(0);
    expect(s.avgScore).toBe(0);
    expect(Number.isNaN(s.conversion)).toBe(false);
  });

  it("agrega ganho/perdido/pipeline + conversão", () => {
    const s = computeStats([
      L({ stage: "ganho", estimatedValue: 1690, score: 100, temperature: "quente", source: "site-checkout" }),
      L({ stage: "perdido", score: 30 }),
      L({ stage: "novo", estimatedValue: 1490, score: 50, temperature: "morno" }),
      L({ stage: "orcamento", estimatedValue: 1490, score: 60, temperature: null }),
      L({ stage: "ganho", estimatedValue: 845, score: null }),
    ]);
    expect(s.total).toBe(5);
    expect(s.won).toBe(2);
    expect(s.lost).toBe(1);
    expect(s.revenue).toBe(2535);
    expect(s.pipelineValue).toBe(2980);
    expect(s.conversion).toBe(67); // round(2/3*100)
    expect(s.avgScore).toBe(48); // round((100+30+50+60+0)/5)
    expect(s.byStage.ganho).toBe(2);
    expect(s.byTemp.frio).toBe(2);
  });

  it("tolera score e temperature null sem quebrar", () => {
    const s = computeStats([L({ score: null, temperature: null })]);
    expect(s.avgScore).toBe(0);
    expect(Number.isFinite(s.avgScore)).toBe(true);
  });
});
