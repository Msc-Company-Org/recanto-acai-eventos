import { describe, it, expect } from "vitest";
import { valorReserva, PRECOS } from "./pricing";

describe("valorReserva", () => {
  it("sinal = 50% do total do pacote", () => {
    expect(valorReserva("unico", "sinal")).toBe(745); // 1490 / 2
    expect(valorReserva("combo", "sinal")).toBe(845); // 1690 / 2
  });

  it("total = preço cheio do pacote", () => {
    expect(valorReserva("unico", "total")).toBe(PRECOS.unico);
    expect(valorReserva("combo", "total")).toBe(PRECOS.combo);
  });

  it("pacote desconhecido cai no combo", () => {
    expect(valorReserva("inexistente", "total")).toBe(PRECOS.combo);
    expect(valorReserva("", "sinal")).toBe(Math.round(PRECOS.combo / 2));
  });

  it("arredonda valores ímpares do sinal", () => {
    // se algum preço for ímpar, o sinal é arredondado (sem centavos quebrados)
    expect(Number.isInteger(valorReserva("unico", "sinal"))).toBe(true);
    expect(Number.isInteger(valorReserva("combo", "sinal"))).toBe(true);
  });
});
