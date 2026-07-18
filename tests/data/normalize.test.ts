import { describe, expect, it } from "vitest";
import { classifyForm, getAttachedForms, getRanking, slugifyMove } from "../../lib/champions/normalize";

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
});
