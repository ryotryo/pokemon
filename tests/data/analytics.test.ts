import { afterEach, describe, expect, it } from "vitest";
import { pushDataLayer } from "../../lib/analytics";

describe("GTM dataLayer events", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
  });

  it("does nothing when window is unavailable", () => {
    expect(() => pushDataLayer({ event: "tool_view", tool_name: "party-check" })).not.toThrow();
  });

  it("initializes dataLayer and pushes the exact event", () => {
    const browserWindow: { dataLayer?: unknown[] } = {};
    Object.defineProperty(globalThis, "window", { configurable: true, value: browserWindow });
    const event = { event: "pokemon_detail_open", pokemon_name: "ガブリアス", tool_name: "usage-ranking", battle_format: "Singles" } as const;

    pushDataLayer(event);

    expect(browserWindow.dataLayer).toEqual([event]);
  });
});
