// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { track, EVENTS } from "./tracking";

const gtagMock = vi.fn();
const fbqMock = vi.fn();
const dl = () => (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer;

beforeEach(() => {
  (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer = [];
  window.gtag = gtagMock as unknown as typeof window.gtag;
  window.fbq = fbqMock as unknown as typeof window.fbq;
  gtagMock.mockClear();
  fbqMock.mockClear();
});

describe("track", () => {
  it("empurra o evento para o dataLayer", () => {
    track(EVENTS.SELECAO_PACOTE, { pacote: "combo" });
    expect(dl()).toContainEqual({ event: "selecao_pacote", pacote: "combo" });
  });

  it("reserva_paga dispara GA4, conversão do Google Ads (send_to) e Purchase no Meta", () => {
    track(EVENTS.RESERVA_PAGA, { value: 845, currency: "BRL", transaction_id: "cs_1" });
    expect(gtagMock).toHaveBeenCalledWith("event", "reserva_paga", expect.objectContaining({ value: 845 }));
    expect(gtagMock).toHaveBeenCalledWith(
      "event",
      "conversion",
      expect.objectContaining({ send_to: "AW-17856564369/_zDKCO7SmsIcEJGZ1sJC", value: 845, transaction_id: "cs_1" })
    );
    expect(fbqMock).toHaveBeenCalledWith("track", "Purchase", expect.objectContaining({ value: 845 }));
  });

  it("envio_formulario dispara o evento nomeado do Google Ads e Lead no Meta", () => {
    track(EVENTS.ENVIO_FORMULARIO, { value: 1690, currency: "BRL" });
    expect(gtagMock).toHaveBeenCalledWith("event", "manual_event_SUBMIT_LEAD_FORM", expect.objectContaining({ value: 1690 }));
    expect(fbqMock).toHaveBeenCalledWith("track", "Lead", expect.anything());
  });

  it("não quebra quando gtag/fbq não existem (só dataLayer)", () => {
    window.gtag = undefined;
    window.fbq = undefined;
    expect(() => track(EVENTS.CLIQUE_WHATSAPP, { location: "hero" })).not.toThrow();
    expect(dl()).toContainEqual({ event: "clique_whatsapp", location: "hero" });
  });
});
