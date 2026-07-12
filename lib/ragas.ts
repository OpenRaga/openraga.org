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

export interface Tala {
  name: string;
  name_devanagari?: string;
  aliases?: string[];
  system: string;
  vibhags: number[];
  clap_pattern: string[];
  theka: string[];
  description?: string;
}

export interface RecordingSegment {
  raga?: string;
  talas?: string[];
  form?: string;
  instrument?: string;
  start?: number;
  notes?: string;
}

export interface Recording {
  source: string;
  artist: string;
  year?: number;
  notes?: string;
  segments: RecordingSegment[];
}

export interface Entry<T> {
  slug: string;
  doc: T;
}

export interface Dataset {
  ragas: Entry<Raga>[];
  talas: Entry<Tala>[];
  recordings: Entry<Recording>[];
}

// The dataset is fetched as a single tarball snapshot of the main branch.
// This avoids api.github.com entirely: codeload has no rate limits, needs no
// auth, and one request fetches every collection — build-friendly on shared
// CI IPs.
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

async function loadDataset(): Promise<Dataset> {
  // Deliberately NOT cache: "force-cache" — Next persists the fetch data
  // cache across builds (locally and on Vercel), which would freeze the
  // dataset at the first build and defeat the deploy hook. Next 15 fetches
  // are uncached by default while pages remain statically generated; the
  // in-process memoization below keeps it to one download per build worker.
  const res = await fetchWithRetry(DATA_TARBALL);
  const { gunzipSync } = await import("node:zlib");
  const tar = gunzipSync(Buffer.from(await res.arrayBuffer()));
  const dataset: Dataset = { ragas: [], talas: [], recordings: [] };
  for (const { name, body } of tarEntries(tar)) {
    // Accepts both the legacy flat layout (data/<slug>.json) and the typed
    // layout (data/<collection>/<slug>.json).
    const match = name.match(
      /\/data\/(?:(ragas|talas|recordings)\/)?([^/]+)\.json$/
    );
    if (!match) continue;
    const collection = (match[1] ?? "ragas") as keyof Dataset;
    dataset[collection].push({
      slug: match[2],
      doc: JSON.parse(body.toString("utf8"))
    });
  }
  if (dataset.ragas.length === 0) {
    throw new Error("No raga documents found in the ragamala-data tarball");
  }
  dataset.ragas.sort((a, b) => a.doc.name.localeCompare(b.doc.name));
  dataset.talas.sort((a, b) => a.doc.name.localeCompare(b.doc.name));
  return dataset;
}

// One tarball download per build: memoized so that every statically
// generated page reuses the same snapshot.
let datasetPromise: Promise<Dataset> | undefined;

export function getDataset(): Promise<Dataset> {
  datasetPromise ??= loadDataset();
  return datasetPromise;
}

export async function getRagas(): Promise<Entry<Raga>[]> {
  return (await getDataset()).ragas;
}

export async function getRaga(slug: string): Promise<Entry<Raga> | undefined> {
  return (await getRagas()).find((entry) => entry.slug === slug);
}

export async function getTalas(): Promise<Entry<Tala>[]> {
  return (await getDataset()).talas;
}

export async function getTala(slug: string): Promise<Entry<Tala> | undefined> {
  return (await getTalas()).find((entry) => entry.slug === slug);
}

export async function getRecordings(): Promise<Entry<Recording>[]> {
  return (await getDataset()).recordings;
}

// All names (canonical + aliases, lowercased) by which a document is known.
export function namesOf(doc: { name: string; aliases?: string[] }): string[] {
  return [doc.name, ...(doc.aliases ?? [])].map((name) => name.toLowerCase());
}
