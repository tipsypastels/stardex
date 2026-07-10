import { List as IList } from "immutable";
import type { Pokemon } from ".";
import { REGIONS, type Region, type RegionKey } from "../region";

export type AutosortMode = "national" | RegionKey;
export type AutosortMismatchPlacement = "end" | "start" | "remove";

export interface AutosortOptions {
  mode: AutosortMode;
  mismatchPlacement: AutosortMismatchPlacement;
}

export function runAutosort(all: IList<Pokemon>, { mode, mismatchPlacement }: AutosortOptions) {
  const toRemove = new Set<Pokemon>();
  const newAll = all.sortBy((pokemon) => {
    const index =
      mode === "national"
        ? nationalDexPosition(pokemon)
        : regionalDexPosition(REGIONS.of(mode), pokemon);

    if (index === "mismatch") {
      switch (mismatchPlacement) {
        case "start": {
          return -Infinity;
        }
        case "end": {
          return Infinity;
        }
        case "remove": {
          toRemove.add(pokemon);
          return Infinity;
        }
      }
    }

    return index;
  });

  if (toRemove.size > 0) {
    return newAll.filter((pokemon) => !toRemove.has(pokemon));
  }
  return newAll;
}

function nationalDexPosition(pokemon: Pokemon) {
  return pokemon.species.value?.id ?? "mismatch";
}

function regionalDexPosition(region: Region, pokemon: Pokemon) {
  const species = pokemon.species.value;
  if (!species) return "mismatch";

  const index = region.members.findIndex((r) => r.speciesKey === species.key);
  return index > -1 ? index : "mismatch";
}
