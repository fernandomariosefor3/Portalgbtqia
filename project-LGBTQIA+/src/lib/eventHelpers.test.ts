import { describe, it, expect } from "vitest";
import {
  generateSlug,
  generateShortDescription,
  autoCategorize,
  autoTags,
} from "./eventHelpers";

describe("generateSlug", () => {
  it("converte para minúsculas e kebab-case", () => {
    expect(generateSlug("Parada do Orgulho LGBT")).toBe("parada-do-orgulho-lgbt");
  });

  it("remove acentos", () => {
    expect(generateSlug("Educação Sexual e Saúde")).toBe("educacao-sexual-e-saude");
  });

  it("remove caracteres especiais e hífens nas pontas", () => {
    expect(generateSlug("  Festa @ 2026!!  ")).toBe("festa-2026");
  });

  it("colapsa múltiplos separadores em um único hífen", () => {
    expect(generateSlug("Drag   ---   Show")).toBe("drag-show");
  });
});

describe("generateShortDescription", () => {
  it("retorna string vazia para entrada vazia/undefined", () => {
    expect(generateShortDescription()).toBe("");
    expect(generateShortDescription("")).toBe("");
  });

  it("mantém descrições com até 160 caracteres", () => {
    const short = "a".repeat(160);
    expect(generateShortDescription(short)).toBe(short);
  });

  it("trunca descrições longas para 157 chars + reticências", () => {
    const long = "a".repeat(200);
    const result = generateShortDescription(long);
    expect(result.length).toBe(160);
    expect(result.endsWith("...")).toBe(true);
  });
});

describe("autoCategorize", () => {
  it("detecta parada", () => {
    expect(autoCategorize("Parada do Orgulho")).toBe("parada");
    expect(autoCategorize("Marcha das Vadias")).toBe("parada");
  });

  it("detecta festa", () => {
    expect(autoCategorize("Festa Junina LGBT")).toBe("festa");
    expect(autoCategorize("Ballroom Party")).toBe("festa");
  });

  it("detecta cultura", () => {
    expect(autoCategorize("Drag Show no teatro")).toBe("cultura");
  });

  it("detecta saude", () => {
    expect(autoCategorize("Mutirão de teste de HIV e PrEP")).toBe("saude");
  });

  it("detecta educacao", () => {
    expect(autoCategorize("Workshop de capacitação")).toBe("educacao");
  });

  it("usa 'encontro' como categoria padrão", () => {
    expect(autoCategorize("Roda de conversa")).toBe("encontro");
  });

  it("respeita a precedência: parada antes de festa", () => {
    expect(autoCategorize("Festa após a Parada")).toBe("parada");
  });
});

describe("autoTags", () => {
  it("extrai múltiplas tags de título e descrição", () => {
    const tags = autoTags("Parada Trans em Fortaleza", "Evento LGBTQIA+ no Ceará");
    expect(tags).toEqual(
      expect.arrayContaining(["lgbtq", "trans", "parada", "fortaleza", "ceara"])
    );
  });

  it("retorna array vazio quando nenhuma keyword bate", () => {
    expect(autoTags("Reunião administrativa")).toEqual([]);
  });

  it("não duplica tags", () => {
    const tags = autoTags("LGBT lgbtq lgbtqia+", "");
    expect(tags.filter((t) => t === "lgbtq").length).toBe(1);
  });

  it("é case-insensitive", () => {
    expect(autoTags("DRAG QUEEN", "")).toContain("drag");
  });
});
