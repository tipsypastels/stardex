import { Set as ISet } from "immutable";
import { derived, writable } from "svelte/store";
import type { Pokemon } from "./models/pokemon";
import { INITIAL_REGION_KEYS, type RegionKey } from "./models/region";
import { resolveSpecies } from "./models/species";
import { Strictness } from "./models/strictness";

export interface State {
  strictness: Strictness;
  regions: ISet<RegionKey>;
  pokemon: Pokemon[];
}

export const state = writable<State>({
  strictness: Strictness.Normal,
  regions: ISet(INITIAL_REGION_KEYS),
  pokemon: [{ species: resolveSpecies("bulbasaur") }],
});

export const pokemon = derived(state, (s) => s.pokemon);
