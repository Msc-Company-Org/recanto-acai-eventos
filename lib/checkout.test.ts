import { describe, it, expect } from "vitest";
import { parseCheckoutInput, safeOrigin, buildSuccessUrl } from "./checkout";

describe("parseCheckoutInput", () => {
  it("aceita valores válidos", () => {
    expect(parseCheckoutInput({ pacote: "unico", modo: "sinal" })).toEqual({ pacote: "unico", modo: "sinal" });
  });
  it("faz fallback para combo/total em valores inválidos ou ausentes", () => {
    expect(parseCheckoutInput({ pacote: "x", modo: "y" })).toEqual({ pacote: "combo", modo: "total" });
    expect(parseCheckoutInput(null)).toEqual({ pacote: "combo", modo: "total" });
    expect(parseCheckoutInput({})).toEqual({ pacote: "combo", modo: "total" });
  });
});

describe("safeOrigin", () => {
  it("mantém origin da allowlist", () => {
    expect(safeOrigin("https://recanto-eventos.vercel.app")).toBe("https://recanto-eventos.vercel.app");
  });
  it("rejeita origin forjado (anti open-redirect)", () => {
    expect(safeOrigin("https://evil.com")).toBe("https://recanto-eventos.vercel.app");
    expect(safeOrigin(null)).toBe("https://recanto-eventos.vercel.app");
  });
});

describe("buildSuccessUrl", () => {
  it("usa origin confiável e inclui parâmetros + placeholder do Stripe", () => {
    const url = buildSuccessUrl("https://evil.com", { valor: 845, pacote: "combo", modo: "sinal" });
    expect(url.startsWith("https://recanto-eventos.vercel.app/obrigado")).toBe(true);
    expect(url).toContain("valor=845");
    expect(url).toContain("pacote=combo");
    expect(url).toContain("session_id={CHECKOUT_SESSION_ID}");
  });
});
