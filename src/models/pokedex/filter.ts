import { computed, createModel, signal } from "@preact/signals";
import type { Pokemon } from "../pokemon";

export type PokedexFilterState = { kind: "type"; typeKey: string };
export type PokedexFilter = InstanceType<typeof PokedexFilter>;

export const PokedexFilter = createModel(() => {
  const state = signal<PokedexFilterState>();
  const typeKey = computed(() => state.value?.typeKey);

  return {
    state,
    typeKey,
  };
});

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
    if (pokemon.typeKeys.value.includes(typeKey)) {
      yield { pokemon, unfilteredIndex: i };
    }
    i++;
  }
}
