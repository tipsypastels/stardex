import { resolvePokemonTypeKeys, type Pokemon } from "$lib/models/pokemon";
import type { Region } from "$lib/models/region";
import { resolveSpecies } from "$lib/models/species";
import { resolveType, type Type } from "$lib/models/type";
import { sortStrings } from "$lib/utils/strings";

export interface Allotment {
  total: number;
  types: Map<string, AllotedType>;
}

export interface AllotedType {
  typeKey: string;
  type: Type;
  count: number;
  ratio: number;
}

export function createAllotment(pokemon: Pokemon[]): Allotment {
  const counts = new Map<string, number>();
  let total = 0;

  for (const mon of pokemon) {
    if (mon.exclude) {
      continue;
    }

    for (const typeKey of resolvePokemonTypeKeys(mon)) {
      const currCount = counts.get(typeKey) ?? 0;
      counts.set(typeKey, currCount + 1);
      total += 1;
    }
  }

  const countEntries = Array.from(counts.entries());
  countEntries.sort(sortCountEntries);

  const types = new Map(
    countEntries.map(([typeKey, count]) => {
      const type = resolveType(typeKey);
      const ratio = count / total;
      return [typeKey, { typeKey, type, count, ratio } satisfies AllotedType];
    }),
  );

  return { total, types };
}

export function createRegionAllotment(regions: Region[]): Allotment {
  return createAllotment(
    regions.flatMap((region) =>
      region.pokemon.map((speciesKey) => {
        const species = resolveSpecies(speciesKey);
        if (!species) throw new Error(`Region ${region.name} has unknown species ${speciesKey}`);
        return { species };
      }),
    ),
  );
}

function sortCountEntries([aName, aCnt]: [string, number], [bName, bCnt]: [string, number]) {
  return aCnt === bCnt ? sortStrings(aName, bName) : aCnt - bCnt;
}
