import { describe, it, expect } from "vitest";
import { stageLabel, stageColor } from "./crm-constants";

describe("stageLabel / stageColor", () => {
  it("retorna label e cor de estágio conhecido", () => {
    expect(stageLabel("ganho")).toBe("Ganho");
    expect(stageColor("ganho")).toBe("#25d366");
  });
  it("faz fallback para id desconhecido", () => {
    expect(stageLabel("xyz")).toBe("xyz");
    expect(stageColor("xyz")).toBe("#8327ec");
  });
});
