import { List as IList, PairSorting } from "immutable";
import type { Pokemon } from ".";
import { Region, REGIONS, type RegionKey } from "../region";
import { TYPE_KEY_PAIRS } from "../type/key_pair";

export type AutosortFailureMode = "end" | "start" | "remove";
export type AutosortRequest =
  | { kind: "id"; failure: AutosortFailureMode }
  | { kind: "region"; region: RegionKey; failure: AutosortFailureMode }
  | { kind: "types" };

export function runAutosort(all: IList<Pokemon>, request: AutosortRequest) {
  switch (request.kind) {
    case "id": {
      return sortFallible(all, nationalDexPosition, request.failure);
    }
    case "region": {
      const region = REGIONS.of(request.region);
      return sortFallible(all, (pokemon) => regionalDexPosition(region, pokemon), request.failure);
    }
    case "types": {
      return all.sort(
        (left, right) =>
          TYPE_KEY_PAIRS.compare(left.typeKeys.value, right.typeKeys.value) ||
          PairSorting.LeftThenRight,
      );
    }
  }
}

function sortFallible(
  all: IList<Pokemon>,
  getPosition: (pokemon: Pokemon) => number | undefined,
  failure: AutosortFailureMode,
) {
  const toRemove = new Set<Pokemon>();
  const newAll = all.sortBy((pokemon, index) => {
    const position = getPosition(pokemon);
    if (position == null) {
      switch (failure) {
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
    return newAll.filter((p) => !toRemove.has(p));
  }
  return newAll;
}

function nationalDexPosition(pokemon: Pokemon) {
  return pokemon.species.value?.id;
}

function regionalDexPosition(region: Region, pokemon: Pokemon) {
  const species = pokemon.species.value;
  if (!species) return;

  const index = region.members.findIndex((r) => r.speciesKey === species.key);
  return index > -1 ? index : undefined;
}
