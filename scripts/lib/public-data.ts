import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const refs = new Map<string, Promise<string>>();
export function getPublicRepositoryCommit(repository: string): Promise<string> {
  if (!/^[\w-]+\/[\w-]+$/.test(repository)) throw new Error("Invalid public repository");
  let pending = refs.get(repository);
  if (!pending) {
    pending = execFileAsync("git", ["ls-remote", `https://github.com/${repository}.git`, "HEAD"], { timeout: 30000 }).then(({ stdout }) => {
      const sha = stdout.split(/\s/)[0];
      if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error(`Invalid commit: ${repository}`);
      return sha;
    });
    refs.set(repository, pending);
  }
  return pending;
}

const indexes = new Map<string, Promise<{ results: { name: string; url: string }[] }>>();
// PokeAPI maintains this JSON mirror itself. Only localization/auxiliary metadata use it.
async function getPokeApiMirror<T>(url: string): Promise<T> {
  const match = /^https:\/\/pokeapi\.co\/api\/v2\/(move|pokemon-species)\/([^/]+)\/?$/.exec(url);
  if (!match) throw new Error(`Unsupported PokeAPI resource: ${url}`);
  const [, resource, name] = match;
  const sha = await getPublicRepositoryCommit("PokeAPI/api-data");
  const root = `https://raw.githubusercontent.com/PokeAPI/api-data/${sha}/data/api/v2/${resource}`;
  let id = decodeURIComponent(name);
  if (!/^\d+$/.test(id)) {
    let pending = indexes.get(resource);
    if (!pending) {
      pending = fetchJson<{ results: { name: string; url: string }[] }>(`${root}/index.json`);
      indexes.set(resource, pending);
    }
    const entry = (await pending).results.find((entry) => entry.name === id);
    const resolved = entry?.url.match(/\/(\d+)\/$/)?.[1];
    if (!resolved) throw new Error(`PokeAPI mirror resource missing: ${resource}/${id}`);
    id = resolved;
  }
  return fetchJson<T>(`${root}/${id}/index.json`);
}

export async function fetchJson<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { accept: "application/json", "user-agent": "poke-analytics-data-builder/1.0" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json() as T;
  } catch (error) {
    if (url.startsWith("https://pokeapi.co/api/v2/")) {
      console.warn(`[data] PokeAPI unavailable; using its official JSON mirror: ${url}`);
      return getPokeApiMirror<T>(url);
    }
    throw new Error(`Failed to fetch ${url}`, { cause: error });
  }
}
