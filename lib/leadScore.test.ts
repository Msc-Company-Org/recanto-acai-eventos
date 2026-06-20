import { describe, it, expect } from "vitest";
import { computeScore } from "./leadScore";

describe("computeScore", () => {
  it("lead completo de alto valor satura em 100 e fica quente", () => {
    const r = computeScore({
      eventType: "Casamentos",
      package: "combo",
      guests: 150,
      eventDate: "2026-12-01",
      whatsapp: "21999990000",
      name: "Ana",
      extraPremium: 1,
      source: "whatsapp",
    });
    expect(r.score).toBe(100);
    expect(r.temperature).toBe("quente");
  });

  it("input vazio = score baixo (só o pacote) e frio", () => {
    const r = computeScore({});
    expect(r.score).toBe(10); // package !== combo → +10
    expect(r.temperature).toBe("frio");
  });

  it("classifica morno na faixa intermediária", () => {
    const r = computeScore({ eventType: "Formaturas", package: "combo", name: "X" }); // 22+20+5 = 47
    expect(r.score).toBe(47);
    expect(r.temperature).toBe("morno");
  });

  it("guests inválido (NaN) não quebra o score", () => {
    const r = computeScore({ eventType: "Casamentos", package: "combo", guests: NaN as unknown as number });
    expect(Number.isFinite(r.score)).toBe(true);
  });

  it("nunca passa de 100", () => {
    const r = computeScore({
      eventType: "Casamentos",
      package: "combo",
      guests: 500,
      eventDate: "2026-12-01",
      whatsapp: "x",
      name: "y",
      extraPremium: 2,
      extraNormal: 2,
      source: "whatsapp",
    });
    expect(r.score).toBeLessThanOrEqual(100);
  });
});
