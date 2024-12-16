import { derived, writable } from "svelte/store";
import { resolvePokemon, type Pokemon } from "./models/pokemon";
import { Set as ISet } from "immutable";
import { INITIAL_REGION_KEYS } from "./models/region";

export interface State {
  regions: ISet<string>;
  pokemon: Pokemon[];
}

export const state = writable<State>({
  regions: ISet(INITIAL_REGION_KEYS),
  pokemon: [resolvePokemon("bulbasaur")],
});

export const pokemon = derived(state, (s) => s.pokemon);
