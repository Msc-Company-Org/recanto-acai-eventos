import { describe, it, expect } from "vitest";
import { escapeHtml } from "./html";

describe("escapeHtml", () => {
  it("neutraliza tags e aspas (anti-XSS)", () => {
    expect(escapeHtml("<script>alert('x')</script>")).toBe(
      "&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;"
    );
  });
  it("escapa & e aspas duplas", () => {
    const out = escapeHtml('a & b "c"');
    expect(out).toContain("&amp;");
    expect(out).toContain("&quot;");
  });
  it("null/undefined viram string vazia", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });
});
