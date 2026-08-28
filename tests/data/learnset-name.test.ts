import { describe, expect, it } from "vitest";
import { resolveChampoutLearnsetName } from "../../lib/champions/learnset-name";

describe("Champout learnset form names", () => {
  it("does not add Mega twice when Champions already supplies a Mega name", () => {
    expect(resolveChampoutLearnsetName("Gallade-Mega", "Mega")).toBe("Gallade-Mega");
    expect(resolveChampoutLearnsetName("Gallade-Mega", "Mega")).not.toContain("Mega-Mega");
  });

  it("adds the Mega suffix once for regular base names and X/Y forms", () => {
    expect(resolveChampoutLearnsetName("Metagross", "Mega")).toBe("Metagross-Mega");
    expect(resolveChampoutLearnsetName("Charizard", "Mega X")).toBe("Charizard-Mega X");
    expect(resolveChampoutLearnsetName("Charizard-Mega-X", "Mega X")).toBe("Charizard-Mega-X");
  });

  it("leaves regular, regional, and independent form names unchanged", () => {
    expect(resolveChampoutLearnsetName("Gallade", "Base")).toBe("Gallade");
    expect(resolveChampoutLearnsetName("Raichu-Alola", "Alolan")).toBe("Raichu-Alola");
    expect(resolveChampoutLearnsetName("Aegislash", "Shield Forme")).toBe("Aegislash");
  });
});
