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

export function runPokedexFilter(
  pokemons: Iterable<Pokemon>,
  state: PokedexFilterState | undefined,
) {
  if (!state) return pokemons;
  return filterByType(pokemons, state.typeKey);
}

function* filterByType(pokemons: Iterable<Pokemon>, typeKey: string) {
  for (const pokemon of pokemons) {
    if (pokemon.typeKeys.value.includes(typeKey)) {
      yield pokemon;
    }
  }
}
