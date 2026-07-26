import { describe, expect, it } from "vitest";
import { getChampionsSprite } from "../../lib/champions/sprites";

describe("Champions sprites", () => {
  it("uses the valid Rotom Fan asset for ranked fan-rotom", () => {
    expect(getChampionsSprite("fan-rotom", "pokemon_champions_assets/pokemon/Fan Rotom.png"))
      .toBe("https://championsbattledata.com/pokemon_champions_assets/pokemon/Rotom%20Fan.png");
  });

  it("keeps the source image path for other Rotom forms", () => {
    expect(getChampionsSprite("rotom-wash", "pokemon_champions_assets/pokemon/Rotom Wash.png"))
      .toBe("https://championsbattledata.com/pokemon_champions_assets/pokemon/Rotom%20Wash.png");
  });
});
