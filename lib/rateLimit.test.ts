import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, clientKey, _resetRateLimit } from "./rateLimit";

beforeEach(() => _resetRateLimit());

describe("rateLimit", () => {
  it("permite até o limite e bloqueia o excedente", () => {
    const k = "checkout:1.2.3.4";
    expect(rateLimit(k, 3, 60_000, 1000).ok).toBe(true);
    expect(rateLimit(k, 3, 60_000, 1000).ok).toBe(true);
    expect(rateLimit(k, 3, 60_000, 1000).ok).toBe(true);
    expect(rateLimit(k, 3, 60_000, 1000).ok).toBe(false); // 4ª excede
  });

  it("reseta após a janela", () => {
    const k = "lead:9.9.9.9";
    rateLimit(k, 1, 1000, 0);
    expect(rateLimit(k, 1, 1000, 500).ok).toBe(false); // ainda na janela
    expect(rateLimit(k, 1, 1000, 1500).ok).toBe(true); // janela nova
  });
});

describe("clientKey", () => {
  it("usa o primeiro IP do x-forwarded-for", () => {
    const req = new Request("http://x", { headers: { "x-forwarded-for": "1.1.1.1, 2.2.2.2" } });
    expect(clientKey(req, "checkout")).toBe("checkout:1.1.1.1");
  });
  it("cai em anon sem header", () => {
    expect(clientKey(new Request("http://x"), "lead")).toBe("lead:anon");
  });
});
