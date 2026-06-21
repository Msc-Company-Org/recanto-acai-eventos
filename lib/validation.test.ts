import { describe, it, expect } from "vitest";
import { CheckoutSchema, parseLead } from "./validation";

describe("CheckoutSchema", () => {
  it("aceita válidos e cai no padrão em inválidos", () => {
    expect(CheckoutSchema.parse({ pacote: "unico", modo: "sinal" })).toEqual({ pacote: "unico", modo: "sinal" });
    expect(CheckoutSchema.parse({})).toEqual({ pacote: "combo", modo: "total" });
    expect(CheckoutSchema.parse({ pacote: "x", modo: "y" })).toEqual({ pacote: "combo", modo: "total" });
  });
});

describe("parseLead", () => {
  it("coage números e mantém strings", () => {
    const v = parseLead({ nome: "Ana", convidados: "50", total: "1690", pacote: "unico", extraPremium: "1" });
    expect(v.nome).toBe("Ana");
    expect(v.convidados).toBe(50);
    expect(v.total).toBe(1690);
    expect(v.pacote).toBe("unico");
    expect(v.extraPremium).toBe(1);
  });

  it("usa defaults seguros para campos ausentes/ruins", () => {
    const v = parseLead({ convidados: "abc", total: "xyz", pacote: "z" });
    expect(v.convidados).toBeNull();
    expect(v.total).toBe(0);
    expect(v.pacote).toBe("combo");
    expect(v.nome).toBe("");
  });

  it("não quebra com corpo não-objeto", () => {
    const v = parseLead(42);
    expect(v.pacote).toBe("combo");
    expect(v.total).toBe(0);
  });
});
