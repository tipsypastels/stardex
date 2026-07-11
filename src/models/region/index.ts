import RAW_DATA from "../../data/regions.json";
import { SPECIES } from "../pokemon/species";
import type { BuiltinType } from "../type";

export interface RawRegion {
  name: string;
  icon: string;
  members: RawRegionMember[];
}

export interface RawRegionMember {
  species: string;
  alt?: string;
}

RAW_DATA satisfies Record<string, RawRegion>;

let make: (key: RegionKey) => Region;
let makeMember: (raw: RawRegionMember) => RegionMember;

export type RegionKey = keyof typeof RAW_DATA;

export class Region {
  static {
    make = (key) => new this(key);
  }

  readonly key: RegionKey;
  #members?: RegionMember[];

  private constructor(key: RegionKey) {
    this.key = key;
  }

  get name() {
    return this.#raw.name;
  }

  get icon() {
    return this.#raw.icon;
  }

  get members() {
    this.#members ??= this.#raw.members.map(makeMember);
    return this.#members;
  }

  get #raw() {
    return RAW_DATA[this.key];
  }
}

export class RegionMember {
  static {
    makeMember = (raw) => new this(raw);
  }

  #raw: RawRegionMember;
  #types?: BuiltinType[];

  constructor(raw: RawRegionMember) {
    this.#raw = raw;
  }

  get speciesKey() {
    return this.#raw.species;
  }

  get types() {
    this.#types ??= this.#resolveTypes();
    return this.#types;
  }

  #resolveTypes() {
    const species = SPECIES.of(this.#raw.species);
    const form = this.#raw.alt ? species.getAlt(this.#raw.alt) : species;
    return form.types;
  }

  // No memoization because it's only called in PokemonList#setFromRegion, not on render.
  getAltTypeKeys() {
    if (!this.#raw.alt) return;
    return SPECIES.of(this.#raw.species).getAlt(this.#raw.alt).typeKeys;
  }
}

export const REGIONS = (() => {
  const allKeys = Object.keys(RAW_DATA) as RegionKey[];
  const recommendedKeys = allKeys.filter((k) => k !== "kanto");

  const all = allKeys.map(make);
  const map = new Map(all.map((r) => [r.key, r]));

  function of(key: RegionKey) {
    return map.get(key)!;
  }

  return { allKeys, recommendedKeys, all, map, of };
})();
