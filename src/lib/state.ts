import { Set as ISet } from "immutable";
import { derived, writable } from "svelte/store";
import { resolveSpecies } from "./models/species";
import { type Pokemon } from "./models/pokemon";
import { INITIAL_REGION_KEYS, type RegionKey } from "./models/region";

export interface State {
  regions: ISet<RegionKey>;
  pokemon: Pokemon[];
}

export const state = writable<State>({
  regions: ISet(INITIAL_REGION_KEYS),
  pokemon: [{ species: resolveSpecies("bulbasaur") }],
});

export const pokemon = derived(state, (s) => s.pokemon);
