import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { verifyStripeSignature, parseCheckoutCompleted } from "./stripe";

const secret = "whsec_teste";
const payload = '{"id":"evt_1"}';
const t = "1700000000";
const v1 = crypto.createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
const validSig = `t=${t},v1=${v1}`;

describe("verifyStripeSignature", () => {
  it("aceita assinatura válida", () => {
    expect(verifyStripeSignature(payload, validSig, secret)).toBe(true);
  });
  it("rejeita assinatura adulterada", () => {
    expect(verifyStripeSignature(payload, `t=${t},v1=deadbeef`, secret)).toBe(false);
  });
  it("rejeita payload alterado", () => {
    expect(verifyStripeSignature('{"id":"hacked"}', validSig, secret)).toBe(false);
  });
  it("rejeita secret vazio ou header sem v1", () => {
    expect(verifyStripeSignature(payload, validSig, "")).toBe(false);
    expect(verifyStripeSignature(payload, `t=${t}`, secret)).toBe(false);
  });
});

describe("parseCheckoutCompleted", () => {
  const event = {
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_123",
        amount_total: 84500,
        metadata: { pacote: "combo", modo: "sinal", origem: "site-checkout" },
        customer_details: { name: "Ana", phone: "+5521999990000" },
      },
    },
  };
  it("extrai os campos do pagamento", () => {
    const p = parseCheckoutCompleted(event)!;
    expect(p.sessionId).toBe("cs_123");
    expect(p.amount).toBe(845); // 84500 / 100
    expect(p.package).toBe("combo");
    expect(p.name).toBe("Ana");
    expect(p.modo).toBe("sinal");
  });
  it("retorna null para evento de outro tipo", () => {
    expect(parseCheckoutCompleted({ type: "payment_intent.created" })).toBeNull();
    expect(parseCheckoutCompleted(null)).toBeNull();
  });
  it("amount ausente vira 0", () => {
    const p = parseCheckoutCompleted({ type: "checkout.session.completed", data: { object: { id: "cs_x" } } })!;
    expect(p.amount).toBe(0);
  });
});
