import { createSignal } from "solid-js";
import type { Pokemon } from "../pokemon";

export type PokedexFilterState = { kind: "type"; typeKey: string };

export const pokedexFilter = (() => {
  const [state, setState] = createSignal<PokedexFilterState>();

  return {
    get state() {
      return state();
    },
    set state(state: PokedexFilterState | undefined) {
      setState(state);
    },
    get typeKey() {
      return state()?.typeKey;
    },
  };
})();

export interface PokedexFilteredEntry {
  pokemon: Pokemon;
  unfilteredIndex: number;
}

export function runPokedexFilter(
  pokemons: Iterable<Pokemon>,
  state: PokedexFilterState | undefined,
) {
  if (!state) return filterByNothing(pokemons);
  return filterByType(pokemons, state.typeKey);
}

function* filterByNothing(pokemons: Iterable<Pokemon>): Generator<PokedexFilteredEntry> {
  let i = 0;
  for (const pokemon of pokemons) {
    yield { pokemon, unfilteredIndex: i };
    i++;
  }
}

function* filterByType(
  pokemons: Iterable<Pokemon>,
  typeKey: string,
): Generator<PokedexFilteredEntry> {
  let i = 0;
  for (const pokemon of pokemons) {
    if (pokemon.typeKeys.includes(typeKey)) {
      yield { pokemon, unfilteredIndex: i };
    }
    i++;
  }
}
