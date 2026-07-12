// Renders RagaJSON note tokens in the displayName convention documented in
// the schema: prime sign U+2032 (prefix = mandra, suffix = tar), lowercase
// syllable = komal, Má = tivra Ma.

const SWARA: Record<string, string> = {
  SA: "Sa",
  RE: "Re",
  GA: "Ga",
  MA: "Ma",
  PA: "Pa",
  DHA: "Dha",
  NI: "Ni"
};

export interface NoteDisplay {
  text: string;
  altered: boolean; // komal or tivra — rendered with an accent color
}

export function displayNote(token: string): NoteDisplay {
  let rest = token;
  let prefix = "";
  let suffix = "";

  if (rest.endsWith("_MANDRA")) {
    prefix = "′";
    rest = rest.slice(0, -"_MANDRA".length);
  } else if (rest.endsWith("_TAR")) {
    suffix = "′";
    rest = rest.slice(0, -"_TAR".length);
  }

  let altered = false;
  let syllable: string;

  if (rest.endsWith("_KOMAL")) {
    syllable = (SWARA[rest.slice(0, -"_KOMAL".length)] ?? rest).toLowerCase();
    altered = true;
  } else if (rest === "MA_TIVRA") {
    syllable = "Má";
    altered = true;
  } else {
    syllable = SWARA[rest] ?? rest;
  }

  return { text: prefix + syllable + suffix, altered };
}

export function displayPhrase(tokens: string[]): NoteDisplay[] {
  return tokens.map(displayNote);
}
