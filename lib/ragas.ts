export interface RagaStructure {
  aroha?: string[];
  avaroha?: string[];
  vadi?: string;
  samvadi?: string;
  pakad?: string[][];
}

export interface RagaPerformance {
  time_of_day?: string[];
  season?: string;
  rasa?: string[];
}

export interface Raga {
  name: string;
  name_devanagari?: string;
  aliases?: string[];
  system: string;
  thaat?: string;
  classification?: string[];
  description?: string;
  similar_ragas?: string[];
  structure?: RagaStructure;
  performance?: RagaPerformance;
}

export interface RagaEntry {
  slug: string;
  raga: Raga;
}

// The dataset is fetched as a single tarball snapshot of the main branch.
// This avoids api.github.com entirely: codeload has no rate limits, needs no
// auth, and one request fetches every raga — build-friendly on shared CI IPs.
const DATA_TARBALL =
  "https://codeload.github.com/OpenRaga/ragamala-data/tar.gz/refs/heads/main";

export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  attempts = 3
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.ok) return res;
      lastError = new Error(`${url}: HTTP ${res.status}`);
      // Do not retry client errors — only transient server-side failures.
      if (res.status < 500) break;
    } catch (error) {
      lastError = error;
    }
    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
  throw lastError;
}

// Minimal ustar reader: tar is a sequence of 512-byte header blocks, each
// followed by ceil(size / 512) content blocks. We only need names and bytes.
function* tarEntries(tar: Buffer): Generator<{ name: string; body: Buffer }> {
  let offset = 0;
  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break; // end-of-archive marker
    const name = header.subarray(0, 100).toString("utf8").replace(/\0.*$/, "");
    const size = parseInt(
      header.subarray(124, 136).toString("utf8").replace(/\0.*$/, "").trim(),
      8
    );
    const body = tar.subarray(offset + 512, offset + 512 + size);
    yield { name, body };
    offset += 512 + Math.ceil(size / 512) * 512;
  }
}

async function loadRagas(): Promise<RagaEntry[]> {
  const res = await fetchWithRetry(DATA_TARBALL, { cache: "force-cache" });
  const { gunzipSync } = await import("node:zlib");
  const tar = gunzipSync(Buffer.from(await res.arrayBuffer()));
  const entries: RagaEntry[] = [];
  for (const { name, body } of tarEntries(tar)) {
    const match = name.match(/\/data\/([^/]+)\.json$/);
    if (!match) continue;
    entries.push({
      slug: match[1],
      raga: JSON.parse(body.toString("utf8")) as Raga
    });
  }
  if (entries.length === 0) {
    throw new Error("No raga documents found in the ragamala-data tarball");
  }
  return entries.sort((a, b) => a.raga.name.localeCompare(b.raga.name));
}

// One tarball download per build: memoized so that every statically
// generated page reuses the same snapshot.
let ragasPromise: Promise<RagaEntry[]> | undefined;

export function getRagas(): Promise<RagaEntry[]> {
  ragasPromise ??= loadRagas();
  return ragasPromise;
}

export async function getRaga(slug: string): Promise<RagaEntry | undefined> {
  const ragas = await getRagas();
  return ragas.find((entry) => entry.slug === slug);
}
