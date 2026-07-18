import { createMemo, createRoot, createSignal } from "solid-js";
import { pokemons } from "../pokemon/list";

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

export const pokemonsFiltered = createRoot(() => {
  const all = createMemo(() => {
    if (!pokedexFilter.state) return pokemons.all;
    return pokemons.all.filter((pokemon) =>
      pokemon.typeKeys.includes(pokedexFilter.state!.typeKey),
    );
  });
  return {
    get all() {
      return all();
    },
  };
});
