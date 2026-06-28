// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { track, EVENTS, resetConversionFlags } from "./tracking";

const gtagMock = vi.fn();
const fbqMock = vi.fn();
const dl = () => (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer;

beforeEach(() => {
  (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer = [];
  window.gtag = gtagMock as unknown as typeof window.gtag;
  window.fbq = fbqMock as unknown as typeof window.fbq;
  gtagMock.mockClear();
  fbqMock.mockClear();
  resetConversionFlags();
});

describe("track — funil Site + Stripe", () => {
  it("selecao_pacote envia GA4 com valor R$ 5", () => {
    track(EVENTS.SELECAO_PACOTE, { pacote: "combo" });
    expect(dl()).toContainEqual({ event: "selecao_pacote", pacote: "combo" });
    expect(gtagMock).toHaveBeenCalledWith("event", "selecao_pacote", expect.objectContaining({ value: 5, currency: "BRL" }));
  });

  it("envio_formulario envia GA4 'generate_lead' com valor R$ 10", () => {
    track(EVENTS.ENVIO_FORMULARIO, { tipo: "casamento" });
    expect(gtagMock).toHaveBeenCalledWith("event", "generate_lead", expect.objectContaining({ value: 10, currency: "BRL" }));
    expect(fbqMock).toHaveBeenCalledWith("track", "Lead", expect.anything());
    expect(dl()).toContainEqual(expect.objectContaining({ event: "generate_lead", value: 10 }));
  });

  it("qualify_lead envia GA4 com valor R$ 20", () => {
    track(EVENTS.QUALIFY_LEAD, { tipo: "casamento" });
    expect(gtagMock).toHaveBeenCalledWith("event", "qualify_lead", expect.objectContaining({ value: 20, currency: "BRL" }));
    expect(fbqMock).toHaveBeenCalledWith("track", "Lead", expect.anything());
  });

  it("close_convert_lead envia GA4 com valor R$ 25", () => {
    track(EVENTS.CLOSE_CONVERT_LEAD, { pacote: "combo" });
    expect(gtagMock).toHaveBeenCalledWith("event", "close_convert_lead", expect.objectContaining({ value: 25, currency: "BRL" }));
    expect(fbqMock).toHaveBeenCalledWith("track", "Lead", expect.anything());
  });

  it("inicio_checkout envia GA4 'begin_checkout' com valor R$ 35", () => {
    track(EVENTS.INICIO_CHECKOUT, { pacote: "combo" });
    expect(gtagMock).toHaveBeenCalledWith("event", "begin_checkout", expect.objectContaining({ value: 35, currency: "BRL" }));
    expect(fbqMock).toHaveBeenCalledWith("track", "InitiateCheckout", expect.anything());
    expect(dl()).toContainEqual(expect.objectContaining({ event: "inicio_checkout" }));
    expect(dl()).toContainEqual(expect.objectContaining({ event: "begin_checkout" }));
  });

  it("reserva_paga envia GA4 'purchase' R$ 50 + conversão direta Ads com send_to", () => {
    track(EVENTS.RESERVA_PAGA, { value: 845, currency: "BRL", transaction_id: "cs_1" });
    // GA4
    expect(gtagMock).toHaveBeenCalledWith("event", "purchase", expect.objectContaining({ value: 50, currency: "BRL" }));
    // Conversão direta Google Ads (rótulo real)
    expect(gtagMock).toHaveBeenCalledWith(
      "event", "conversion",
      expect.objectContaining({ send_to: "AW-17856564369/_zDKCO7SmsIcEJGZ1sJC", value: 50, transaction_id: "cs_1" })
    );
    // Meta Pixel
    expect(fbqMock).toHaveBeenCalledWith("track", "Purchase", expect.objectContaining({ value: 50 }));
    // dataLayer
    expect(dl()).toContainEqual(expect.objectContaining({ event: "purchase" }));
  });

  it("conversão Ads send_to só dispara para purchase (não para outros eventos)", () => {
    track(EVENTS.ENVIO_FORMULARIO, { tipo: "casamento" });
    track(EVENTS.QUALIFY_LEAD, {});
    track(EVENTS.INICIO_CHECKOUT, {});
    // Nenhum send_to — esses eventos são importados pelo GA4
    expect(gtagMock).not.toHaveBeenCalledWith("event", "conversion", expect.anything());
  });

  it("não quebra quando gtag/fbq não existem", () => {
    window.gtag = undefined;
    window.fbq = undefined;
    expect(() => track(EVENTS.SELECAO_PACOTE, { pacote: "combo" })).not.toThrow();
    expect(dl()).toContainEqual({ event: "selecao_pacote", pacote: "combo" });
  });
});

describe("deduplicação", () => {
  it("purchase: mesma transação NÃO dispara send_to 2x", () => {
    track(EVENTS.RESERVA_PAGA, { transaction_id: "cs_1" });
    gtagMock.mockClear();
    track(EVENTS.RESERVA_PAGA, { transaction_id: "cs_1" });
    // GA4 sempre dispara
    expect(gtagMock).toHaveBeenCalledWith("event", "purchase", expect.anything());
    // Conversão Ads NÃO repete
    expect(gtagMock).not.toHaveBeenCalledWith("event", "conversion", expect.anything());
  });

  it("purchase: transação diferente DISPARA send_to", () => {
    track(EVENTS.RESERVA_PAGA, { transaction_id: "cs_1" });
    gtagMock.mockClear();
    track(EVENTS.RESERVA_PAGA, { transaction_id: "cs_2" });
    expect(gtagMock).toHaveBeenCalledWith("event", "conversion", expect.objectContaining({ value: 50 }));
  });

  it("dataLayer SEMPRE dispara mesmo em eventos repetidos", () => {
    track(EVENTS.QUALIFY_LEAD, { tipo: "a" });
    track(EVENTS.QUALIFY_LEAD, { tipo: "b" });
    const entries = dl().filter((e) => e.event === "qualify_lead");
    expect(entries).toHaveLength(2);
  });
});
