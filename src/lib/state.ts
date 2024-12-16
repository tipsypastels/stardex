import { Set as ISet } from "immutable";
import { writable, type Readable } from "svelte/store";
import type { Pokemon } from "./models/pokemon";
import { INITIAL_REGION_KEYS, type RegionKey } from "./models/region";
import { resolveSpecies } from "./models/species";
import { Strictness } from "./models/strictness";

const pokemon = writable([{ species: resolveSpecies("bulbasaur") }]);
const regions = writable(ISet(INITIAL_REGION_KEYS));
const strictness = writable(Strictness.Normal);

const pokemon_ = pokemon as Readable<Pokemon[]>;
const regions_ = regions as Readable<ISet<RegionKey>>;
const strictness_ = strictness as Readable<Strictness>;

export { pokemon_ as pokemon, regions_ as regions, strictness_ as strictness };
