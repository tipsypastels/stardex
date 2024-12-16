import { derived, writable } from "svelte/store";
import type { Pokemon } from "./models/pokemon";

export interface State {
  pokemon: (string | Pokemon)[];
}

const state = writable<State>({ pokemon: [] });

export const rawPokemon = derived(state, (s) => s.pokemon);
