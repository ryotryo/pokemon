import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("node:child_process", () => ({
  execFile: vi.fn((_command, _args, _options, callback) => callback(null, { stdout: `${"a".repeat(40)}\tHEAD\n` })),
}));
afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

describe("public data retrieval", () => {
  it("keeps a successful API response without consulting a mirror", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 1 })));
    vi.stubGlobal("fetch", fetch);
    const { fetchJson } = await import("../../scripts/lib/public-data");
    expect(await fetchJson("https://pokeapi.co/api/v2/move/pound")).toEqual({ id: 1 });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it("resolves names against PokeAPI's own commit-pinned mirror after an API failure", async () => {
    const fetch = vi.fn().mockRejectedValueOnce(new Error("unavailable"))
      .mockResolvedValueOnce(new Response(JSON.stringify({ results: [{ name: "pound", url: "/api/v2/move/1/" }] })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 1, names: [] })));
    vi.stubGlobal("fetch", fetch);
    const { fetchJson } = await import("../../scripts/lib/public-data");
    expect(await fetchJson("https://pokeapi.co/api/v2/move/pound")).toEqual({ id: 1, names: [] });
    expect(fetch.mock.calls[2][0]).toBe(`https://raw.githubusercontent.com/PokeAPI/api-data/${"a".repeat(40)}/data/api/v2/move/1/index.json`);
  });
  it("fails explicitly for absent mirror entries instead of inventing data", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("", { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ results: [] }))));
    const { fetchJson } = await import("../../scripts/lib/public-data");
    await expect(fetchJson("https://pokeapi.co/api/v2/move/absent")).rejects.toThrow("resource missing");
  });
  it("does not substitute other-game data for a Champions API failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 500 })));
    const { fetchJson } = await import("../../scripts/lib/public-data");
    await expect(fetchJson("https://championsbattledata.com/api")).rejects.toThrow("Failed to fetch https://championsbattledata.com/api");
  });
});
