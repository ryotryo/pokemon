import { describe, expect, it } from "vitest";
import { classifyForm, getAttachedForms, getRanking, normalizePokemon, slugifyMove } from "../../lib/champions/normalize";
import type { MoveMasterEntry } from "../../lib/champions/types";

describe("Champions normalization", () => {
  it("normalizes PokéAPI move identifiers", () => expect(slugifyMove("King's Shield")).toBe("kings-shield"));
  it("orders ranking by API column_position", () => {
    const pokemon = [2, 1].map((rank) => ({ summary: { battleSummary: { Current: { Singles: { rows: [{ column_position: rank }] } } } } }));
    expect(getRanking(pokemon, "Current", "Singles").map((item) => item.rank)).toEqual([1, 2]);
  });
  it("classifies mega separately from independent forms", () => {
    expect(classifyForm("Base")).toBe("base");
    expect(classifyForm("Mega X")).toBe("mega");
    expect(classifyForm("Alolan")).toBe("independent");
    expect(classifyForm("Wash")).toBe("independent");
  });
  it("attaches only the primary record and megas to a base ranking", () => {
    const entry = { slug: "raichu", summary: { primary: { form_kind: "Base" }, forms: [
      { slug: "raichu", form_kind: "Base" }, { slug: "alolan-raichu", form_kind: "Alolan" }, { slug: "mega-raichu-x", form_kind: "Mega X" },
    ] } };
    expect(getAttachedForms(entry).map((form: { slug: string }) => form.slug)).toEqual(["raichu", "mega-raichu-x"]);
  });
  it("does not attach base or mega forms to an independent ranking", () => {
    const entry = { slug: "alolan-raichu", summary: { primary: { form_kind: "Alolan" }, forms: [
      { slug: "raichu", form_kind: "Base" }, { slug: "alolan-raichu", form_kind: "Alolan" }, { slug: "mega-raichu-x", form_kind: "Mega X" },
    ] } };
    expect(getAttachedForms(entry).map((form: { slug: string }) => form.slug)).toEqual(["alolan-raichu"]);
  });
  it("retains status moves for TOP10 viewing while marking them outside coverage", () => {
    const entry = { slug: "testmon", name: "Testmon", battleName: "Testmon", summary: { primary: { form_kind: "Base", types: ["Normal"], image_path: "test.png" }, forms: [{ slug: "testmon", saved_name: "Testmon", form_kind: "Base", types: ["Normal"], image_path: "test.png" }] } };
    const master = { protect: { id: "protect", name: "Protect", displayNameJa: "まもる", type: "normal", damageClass: "status", metaCategory: "damage+raise", isCoverageMove: false, source: "pokeapi" } } satisfies Record<string, MoveMasterEntry>;
    const pokemon = normalizePokemon(entry, 1, { rows: [{ category: "move", rank: 1, name: "Protect", percentage_value: 32.8 }] }, master, { testmon: "テストモン" });
    expect(pokemon.moves).toEqual([{ id: "protect", rank: 1, name: "Protect", displayNameJa: "まもる", usage: 32.8, type: "normal", damageClass: "status", isCoverageMove: false }]);
    expect(pokemon.attackTypes).toEqual([]);
  });
});
