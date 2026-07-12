// Human-facing rendering of RagaJSON dictionary tokens.

// KHYAL -> "Khyal", SLIDE_GUITAR -> "Slide guitar"
export function displayToken(token: string): string {
  const words = token.toLowerCase().split("_");
  return words[0].charAt(0).toUpperCase() + words[0].slice(1) + (words.length > 1 ? " " + words.slice(1).join(" ") : "");
}

// Bols of a theka; REST is notated as an em dash.
export function displayBol(bol: string): string {
  return bol === "REST" ? "—" : displayToken(bol);
}

// Traditional vibhag markers derived from the clap pattern: sam is ×,
// khali vibhags are 0, subsequent talis are numbered 2, 3, …
// A khali on sam (Rupak) is marked 0.
export function vibhagMarkers(clapPattern: string[]): string[] {
  let tali = 1;
  return clapPattern.map((clap, index) => {
    if (clap === "KHALI") return "0";
    if (index === 0) return "×";
    tali += 1;
    return String(tali);
  });
}

// Splits a theka into per-vibhag groups of bols.
export function groupTheka(theka: string[], vibhags: number[]): string[][] {
  const groups: string[][] = [];
  let offset = 0;
  for (const count of vibhags) {
    groups.push(theka.slice(offset, offset + count));
    offset += count;
  }
  return groups;
}
