import { levenshteinDistance } from "@std/text";
import { ALL_SPECIES, type Species } from "./models/species";

export interface SearchResult extends Species {
  distance: number;
}

export function search(query: string) {
  query = query.toLowerCase();

  const results: SearchResult[] = ALL_SPECIES.map((result) => ({
    ...result,
    distance: levenshteinDistance(query, result.nameLower),
  }));

  results.sort((a, b) => a.distance - b.distance);
  return results;
}
