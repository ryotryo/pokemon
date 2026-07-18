import { describe, expect, it } from "vitest";
import { isCoverageMove } from "../../lib/champions/move-coverage";

describe("coverage move classification", () => {
  it.each(["mirror-coat", "counter", "metal-burst", "seismic-toss", "night-shade", "endeavor", "super-fang", "retaliate"])("excludes %s", (id) => {
    expect(isCoverageMove(id, "physical", "damage")).toBe(false);
  });
  it("excludes status and OHKO categories", () => {
    expect(isCoverageMove("thunder-wave", "status", "ailment")).toBe(false);
    expect(isCoverageMove("fissure", "physical", "ohko")).toBe(false);
  });
  it.each([["earthquake", "physical"], ["ice-beam", "special"]])("keeps %s", (id, damageClass) => {
    expect(isCoverageMove(id, damageClass, "damage")).toBe(true);
  });
});
