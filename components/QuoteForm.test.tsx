// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuoteForm } from "./QuoteForm";

const win = window as unknown as { dataLayer: Record<string, unknown>[]; open: ReturnType<typeof vi.fn> };
const fetchMock = vi.fn(() => Promise.resolve());

beforeEach(() => {
  win.dataLayer = [];
  win.open = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockClear();
});

afterEach(() => vi.unstubAllGlobals());

describe("QuoteForm", () => {
  it("renderiza o formulário de orçamento", () => {
    render(<QuoteForm />);
    expect(screen.getByText("Monte seu orçamento")).toBeTruthy();
  });

  it("ao enviar: dispara o lead (track + /api/lead) e abre o WhatsApp", async () => {
    render(<QuoteForm />);
    await userEvent.click(screen.getByRole("button", { name: /Reservar data no WhatsApp/i }));

    expect(win.dataLayer.some((e) => e.event === "envio_formulario")).toBe(true);
    expect(win.open).toHaveBeenCalled();
    expect(String(win.open.mock.calls[0][0])).toContain("wa.me");
    expect(fetchMock).toHaveBeenCalledWith("/api/lead", expect.anything());
  });
});
