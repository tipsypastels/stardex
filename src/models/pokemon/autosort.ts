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
  const newAll = all.sortBy((pokemon, index) => {
    const position =
      mode === "national"
        ? nationalDexPosition(pokemon)
        : regionalDexPosition(REGIONS.of(mode), pokemon);

    if (position === "mismatch") {
      switch (mismatchPlacement) {
        case "start": {
          return -(10000 + index);
        }
        case "end": {
          return 10000 + index;
        }
        case "remove": {
          toRemove.add(pokemon);
          return Infinity;
        }
      }
    }

    return position;
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
