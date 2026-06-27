import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import crypto from "crypto";
import { POST as checkoutPOST } from "@/app/api/checkout/route";
import { POST as leadPOST } from "@/app/api/lead/route";
import { POST as webhookPOST } from "@/app/api/stripe-webhook/route";
import { _resetRateLimit } from "@/lib/rateLimit";

function jsonReq(url: string, body: unknown, headers: Record<string, string> = {}) {
  return new Request(url, {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { "content-type": "application/json", "x-forwarded-for": "1.1.1.1", ...headers },
  });
}

beforeEach(() => {
  _resetRateLimit();
  delete process.env.DATABASE_URL; // força o caminho "sem DB"
});

describe("POST /api/checkout", () => {
  const stripeFetch = vi.fn(async () => ({ ok: true, json: async () => ({ url: "https://checkout.stripe.com/c/sess_1" }) }));
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_123";
    stripeFetch.mockClear();
    vi.stubGlobal("fetch", stripeFetch);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("cria a sessão e devolve a URL", async () => {
    const res = await checkoutPOST(jsonReq("http://x/api/checkout", { pacote: "combo", modo: "sinal" }));
    expect(res.status).toBe(200);
    expect((await res.json()).url).toContain("checkout.stripe.com");
    expect(stripeFetch).toHaveBeenCalledOnce();
  });

  it("400 em JSON inválido", async () => {
    const res = await checkoutPOST(jsonReq("http://x/api/checkout", "{quebrado"));
    expect(res.status).toBe(400);
  });

  it("500 sem STRIPE_SECRET_KEY", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const res = await checkoutPOST(jsonReq("http://x/api/checkout", { pacote: "combo" }));
    expect(res.status).toBe(500);
  });

  it("429 ao exceder o rate limit", async () => {
    for (let i = 0; i < 20; i++) await checkoutPOST(jsonReq("http://x/api/checkout", { pacote: "combo" }));
    const res = await checkoutPOST(jsonReq("http://x/api/checkout", { pacote: "combo" }));
    expect(res.status).toBe(429);
  });
});

describe("POST /api/lead", () => {
  it("aceita lead sem DB (persisted:false)", async () => {
    const res = await leadPOST(jsonReq("http://x/api/lead", { nome: "Ana", tipo: "Casamentos", pacote: "combo", total: 1690 }));
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.ok).toBe(true);
    expect(j.persisted).toBe(false);
    expect(typeof j.score).toBe("number");
  });

  it("400 em JSON inválido", async () => {
    const res = await leadPOST(jsonReq("http://x/api/lead", "{quebrado"));
    expect(res.status).toBe(400);
  });
});

describe("POST /api/stripe-webhook", () => {
  const secret = "whsec_test";
  beforeEach(() => (process.env.STRIPE_WEBHOOK_SECRET = secret));

  function signed(payload: string) {
    const t = "1700000000";
    const v1 = crypto.createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
    return jsonReq("http://x/api/stripe-webhook", payload, { "stripe-signature": `t=${t},v1=${v1}` });
  }

  it("400 com assinatura inválida", async () => {
    const res = await webhookPOST(jsonReq("http://x/api/stripe-webhook", "{}", { "stripe-signature": "t=1,v1=bad" }));
    expect(res.status).toBe(400);
  });

  it("200 com assinatura válida (sem DB)", async () => {
    const payload = JSON.stringify({
      type: "checkout.session.completed",
      data: { object: { id: "cs_test", amount_total: 84500, metadata: { pacote: "combo", modo: "sinal" } } },
    });
    const res = await webhookPOST(signed(payload));
    expect(res.status).toBe(200);
    expect((await res.json()).received).toBe(true);
  });
});
