import DATA_UNPROCESSED from "../data/species.json" with { type: "json" };

interface SpeciesUnprocessed {
  id: number;
  name: string;
  type: string[];
  evos?: SpeciesEvos;
}

export interface Species extends SpeciesUnprocessed {
  key: string;
  index: number;
  nameLower: string;
}

export interface SpeciesEvos {
  from?: string;
  to?: string[];
}

DATA_UNPROCESSED satisfies Record<string, SpeciesUnprocessed>;

function processEntry([k, v]: [string, SpeciesUnprocessed], i: number): [string, Species] {
  return [
    k,
    {
      ...v,
      key: k,
      index: i,
      nameLower: v.name.toLowerCase(),
    } satisfies Species,
  ];
}

const DATA_ENTRIES = Object.entries(DATA_UNPROCESSED).map(processEntry);
const DATA = Object.fromEntries(DATA_ENTRIES) as Record<keyof typeof DATA_UNPROCESSED, Species>;

export const ALL_SPECIES = DATA_ENTRIES.map(([, v]) => v);

export function resolveSpecies(key: keyof typeof DATA): Species;
export function resolveSpecies(key: string): Species | undefined;
export function resolveSpecies(key: string): Species | undefined {
  return (DATA as Record<string, Species>)[key];
}

export function resolveEvolutionLine(species: Species) {
  if (!species.evos || (!species.evos.from && !species.evos.to)) {
    return [species];
  }

  const origin = findEvolutionOrigin(species);
  const out = new Set<Species>([origin]);

  followEvolutionLine(origin, out);

  const outArray = [...out];
  outArray.sort((a, b) => a.id - b.id);
  return outArray;
}

function findEvolutionOrigin(species: Species) {
  let origin = species;
  while (origin.evos?.from) {
    origin = resolveSpecies(origin.evos.from)!;
  }
  return origin;
}

function followEvolutionLine(species: Species, out: Set<Species>) {
  if (species.evos?.to) {
    for (const to of species.evos.to.map((to) => resolveSpecies(to)!)) {
      out.add(to);
      followEvolutionLine(to, out);
    }
  }
}
