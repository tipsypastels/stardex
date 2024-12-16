import { derived, writable } from "svelte/store";
import { resolvePokemon, type Pokemon } from "./models/pokemon";

export interface State {
  pokemon: Pokemon[];
}

const state = writable<State>({ pokemon: [resolvePokemon("bulbasaur")] });

export const pokemon = derived(state, (s) => s.pokemon);
