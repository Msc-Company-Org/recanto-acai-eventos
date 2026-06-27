import { describe, it, expect } from "vitest";
import { safeJson } from "./http";

const req = (body: string) =>
  new Request("http://localhost/api", {
    method: "POST",
    body,
    headers: { "content-type": "application/json" },
  });

describe("safeJson", () => {
  it("parseia JSON válido", async () => {
    expect(await safeJson(req('{"a":1}'))).toEqual({ a: 1 });
  });
  it("retorna null em JSON malformado", async () => {
    expect(await safeJson(req("{quebrado"))).toBeNull();
  });
  it("retorna null em corpo vazio", async () => {
    expect(await safeJson(req(""))).toBeNull();
  });
});
