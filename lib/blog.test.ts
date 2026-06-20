import { describe, it, expect } from "vitest";
import { parseFrontmatter } from "./blog";

describe("parseFrontmatter", () => {
  it("separa frontmatter e corpo", () => {
    const { data, content } = parseFrontmatter("---\ntitle: Olá\ndescription: x\n---\nCorpo aqui");
    expect(data.title).toBe("Olá");
    expect(data.description).toBe("x");
    expect(content.trim()).toBe("Corpo aqui");
  });

  it("lida com dois-pontos dentro do valor (entre aspas)", () => {
    const { data } = parseFrontmatter('---\ntitle: "Foo: Bar"\n---\nc');
    expect(data.title).toBe("Foo: Bar");
  });

  it("sem frontmatter: data vazio, conteúdo intacto", () => {
    const { data, content } = parseFrontmatter("só o corpo");
    expect(data).toEqual({});
    expect(content).toBe("só o corpo");
  });

  it("ignora BOM no início", () => {
    const bom = String.fromCharCode(0xfeff);
    const { data } = parseFrontmatter(bom + "---\ntitle: X\n---\nc");
    expect(data.title).toBe("X");
  });

  it("aceita quebras CRLF", () => {
    const { data } = parseFrontmatter("---\r\ntitle: X\r\n---\r\nc");
    expect(data.title).toBe("X");
  });
});
