import { levenshteinDistance } from "@std/text";
import { ALL_SPECIES_ENTRIES, type Species } from "./models/species";

export interface SearchResult {
  speciesKey: string;
  species: Species;
  nameLower: string;
  index: number;
  distance: number;
}

const SEARCH_SPACE: Omit<SearchResult, "distance">[] = ALL_SPECIES_ENTRIES.map(
  ([speciesKey, species], index) => ({
    speciesKey,
    species,
    nameLower: species.name.toLowerCase(),
    index,
  }),
);

export function search(query: string) {
  query = query.toLowerCase();

  const results: SearchResult[] = SEARCH_SPACE.map((result) => ({
    ...result,
    distance: levenshteinDistance(query, result.nameLower),
  }));

  results.sort((a, b) => a.distance - b.distance);
  return results;
}
