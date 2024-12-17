import { Set as ISet } from "immutable";
import { writable, derived, type Readable } from "svelte/store";
import type { Pokemon } from "./models/pokemon";
import { INITIAL_REGION_KEYS, type RegionKey } from "./models/region";
import { resolveSpecies } from "./models/species";
import { Strictness } from "./models/strictness";

const stored = JSON.parse(localStorage.getItem("stardex_state") ?? "{}");

const pokemon = writable<Pokemon[]>(stored.pokemon ?? [{ species: resolveSpecies("bulbasaur") }]);
const regions = writable<ISet<RegionKey>>(ISet(stored.regions ?? INITIAL_REGION_KEYS));
const strictness = writable<Strictness>(stored.strictness ?? Strictness.Normal);

export const fullState = derived(
  [pokemon, regions, strictness],
  ([pokemon, regions, strictness]) => ({ pokemon, regions, strictness }),
);

const pokemon_ = pokemon as Readable<Pokemon[]>;
const regions_ = regions as Readable<ISet<RegionKey>>;
const strictness_ = strictness as Readable<Strictness>;

export { pokemon_ as pokemon, regions_ as regions, strictness_ as strictness };

export function setRegions(keys: RegionKey[]) {
  regions.update(() => ISet(keys));
}

export function enableRegion(key: RegionKey) {
  regions.update(($regions) => $regions.add(key));
}

export function disableRegion(key: RegionKey) {
  regions.update(($region) => $region.remove(key));
}
