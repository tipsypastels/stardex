import DATA from "../data/regions.json" with { type: "json" };
import { Species, type SpeciesKey } from "./species";
import type { Type } from "./type";
import { Set as ISet } from "immutable";

let makeMember: (speciesKey: string, altKey?: string) => RegionMember;

interface RegionData {
  name: string;
  icon: string;
  pokemon: (string | { key: string; alt: string })[];
}

DATA satisfies Record<string, RegionData>;

export type RegionKey = keyof typeof DATA;

export class Region {
  static of(key: RegionKey) {
    return new this(key);
  }

  readonly key: RegionKey;
  #members?: RegionMember[];

  private constructor(key: RegionKey) {
    this.key = key;
  }

  get name() {
    return this.#data.name;
  }

  get icon() {
    return this.#data.icon;
  }

  get members() {
    this.#members ??= this.#resolveMembers();
    return this.#members;
  }

  #resolveMembers() {
    return this.#data.pokemon.map((p) =>
      typeof p === "string" ? makeMember(p) : makeMember(p.key, p.alt),
    );
  }

  get #data(): RegionData {
    return DATA[this.key];
  }
}

export class RegionMember {
  static {
    makeMember = (s, a) => new this(s, a);
  }

  #speciesKey: SpeciesKey;
  #altKey?: string;

  #types?: Type[];

  private constructor(speciesKey: string, altKey?: string) {
    if (!Species.isKey(speciesKey)) {
      throw new Error(`Unknown species ${speciesKey} in region.`);
    }
    this.#speciesKey = speciesKey;
    this.#altKey = altKey;
  }

  get types() {
    this.#types ??= this.#resolveTypes();
    return this.#types;
  }

  #resolveTypes() {
    const species = Species.of(this.#speciesKey);
    const form = this.#altKey ? species.alt(this.#altKey) : species;
    return form.types;
  }
}

export class Regions {
  static #KEYS = Object.keys(DATA) as RegionKey[];

  static ALL = new this(ISet(this.#KEYS));
  static DEFAULT = new this(ISet(this.#KEYS.filter((k) => k !== "kanto")));

  static from(keys: RegionKey[]) {
    return new this(ISet(keys));
  }

  #set: ISet<RegionKey>;
  #regions?: Region[];

  private constructor(set: ISet<RegionKey>) {
    this.#set = set;
  }

  has(key: RegionKey) {
    return this.#set.has(key);
  }

  add(key: RegionKey) {
    return new Regions(this.#set.add(key));
  }

  delete(key: RegionKey) {
    return new Regions(this.#set.delete(key));
  }

  keys() {
    return [...this.#set];
  }

  toArray() {
    this.#regions ??= this.keys().map((key) => Region.of(key));
    return this.#regions;
  }

  toJson() {
    return this.keys();
  }
}
