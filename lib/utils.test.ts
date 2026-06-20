import { describe, it, expect } from "vitest";
import { brl, cn, waLink } from "./utils";

describe("brl", () => {
  it("formata como real sem centavos", () => {
    expect(brl(1490)).toContain("1.490");
    expect(brl(1490).startsWith("R$")).toBe(true);
  });
  it("não quebra com 0, NaN ou Infinity", () => {
    expect(brl(0)).toContain("0");
    expect(brl(NaN)).toContain("0");
    expect(brl(Infinity)).not.toContain("∞");
  });
});

describe("cn", () => {
  it("junta apenas classes verdadeiras", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
    expect(cn()).toBe("");
  });
});

describe("waLink", () => {
  it("monta wa.me com mensagem codificada", () => {
    const link = waLink("oi mundo");
    expect(link).toContain("https://wa.me/5521981749450?text=");
    expect(link).toContain(encodeURIComponent("oi mundo"));
  });
});
