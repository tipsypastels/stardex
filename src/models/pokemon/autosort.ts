import type { BuiltinPokemon, Pokemon } from ".";
import { Region } from "../region";
import { TYPE_KEY_PAIRS } from "../type/key_pair";

export type AutosortFailureMode = "end" | "start" | "remove";
export type AutosortRequest =
  | { kind: "id"; failure: AutosortFailureMode }
  | { kind: "region"; region: Region; failure: AutosortFailureMode }
  | { kind: "types" };

export function runAutosort(all: Pokemon[], request: AutosortRequest) {
  switch (request.kind) {
    case "id": {
      if (request.failure === "remove") {
        return all
          .filter((pokemon): pokemon is BuiltinPokemon => !!pokemon.species)
          .sort((left, right) => left.species.id - right.species.id);
      }
      return unwrapStable(
        wrapStable(all).sort(stableBy(({ pokemon }) => pokemon.species?.id, request.failure)),
      );
    }
    case "region": {
      if (request.failure === "remove") {
        return all
          .map((pokemon) => ({ pokemon, position: regionalDexPosition(request.region, pokemon) }))
          .filter((item) => item.position != null)
          .sort((left, right) => left.position! - right.position!)
          .map(({ pokemon }) => pokemon);
      }

      return unwrapStable(
        wrapStable(all).sort(
          stableBy(({ pokemon }) => regionalDexPosition(request.region, pokemon), request.failure),
        ),
      );
    }
    case "types": {
      return unwrapStable(
        wrapStable(all).sort(
          (left, right) =>
            TYPE_KEY_PAIRS.ordering(left.pokemon.typeKeys, right.pokemon.typeKeys) ||
            left.index - right.index,
        ),
      );
    }
  }
}

interface StableItem {
  pokemon: Pokemon;
  index: number;
}

function stableBy(
  f: (item: StableItem) => number | undefined,
  failure: Exclude<AutosortFailureMode, "remove">,
) {
  return (left: StableItem, right: StableItem) => {
    const leftId = f(left);
    const rightId = f(right);

    if (leftId == null && rightId == null) return left.index - right.index;
    if (leftId == null) return failure === "start" ? -1 : 1;
    if (rightId == null) return failure === "start" ? 1 : -1;

    const diff = leftId - rightId;
    return diff || left.index - right.index;
  };
}

function wrapStable(pokemons: Pokemon[]): StableItem[] {
  return pokemons.map((pokemon, index) => ({ pokemon, index }));
}

function unwrapStable(items: StableItem[]) {
  return items.map((item) => item.pokemon);
}

function regionalDexPosition(region: Region, pokemon: Pokemon) {
  const species = pokemon.species;
  if (!species) return;

  const index = region.members.findIndex((r) => r.speciesKey === species.key);
  return index > -1 ? index : undefined;
}
