import { levenshteinDistance } from "@std/text";
import DATA from "../data/species.json" with { type: "json" };

export interface Species {
  id: number;
  name: string;
  type: string[];
  evos?: SpeciesEvos;
}

export interface SpeciesEvos {
  from?: string;
  to?: string[];
}

export const ALL_SPECIES_NAMES = Object.values(DATA).map((s) => s.name);

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

export interface SpeciesSearchResult extends Species {
  key: string;
  index: number;
}

const SPECIES_SEARCH_SPACE: SpeciesSearchResult[] = Object.entries(DATA).map(
  ([key, species], index) => ({ ...species, key, index }),
);

export function searchSpecies(query: string): SpeciesSearchResult[] {
  query = query.toLowerCase();
  return SPECIES_SEARCH_SPACE.toSorted(
    (a, b) =>
      levenshteinDistance(query, a.name.toLowerCase()) -
      levenshteinDistance(query, b.name.toLowerCase()),
  );
}
