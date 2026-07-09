import RAW_DATA from "../../data/species.json" with { type: "json" };
import { unwrap } from "../../utils/assert";
import { BUILTIN_TYPES, type BuiltinType } from "../type";

export interface RawSpecies {
  id: number;
  name: string;
  types: string[];
  evos?: { from?: string; to?: string[] };
  alts?: RawSpeciesAlt[];
}

export interface RawSpeciesAlt {
  kind: string;
  name: string;
  types: string[];
}

RAW_DATA satisfies Record<string, RawSpecies>;

let make: (key: string) => Species;
let makeAlt: (raw: RawSpeciesAlt) => SpeciesAlt;

export class Species {
  static {
    make = (key) => new this(key);
  }

  readonly key: string;

  #nameLower?: string;
  #types?: BuiltinType[];
  #alts?: SpeciesAlt[];

  private constructor(key: string) {
    this.key = key;
  }

  get id() {
    return this.#raw.id;
  }

  get name() {
    return this.#raw.name;
  }

  get nameLower() {
    this.#nameLower ??= this.name.toLowerCase();
    return this.#nameLower;
  }

  get types() {
    this.#types ??= this.typeKeys.map(BUILTIN_TYPES.of);
    return this.#types;
  }

  get typeKeys() {
    return this.#raw.types;
  }

  get alts() {
    this.#alts ??= this.#raw.alts?.map(makeAlt) ?? [];
    return this.#alts;
  }

  getAlt(kind: string) {
    return unwrap(
      this.alts.find((a) => a.kind === kind),
      `Unknown alt ${kind} for species ${this.key}`,
    );
  }

  get #raw() {
    return RAW_DATA[this.key as keyof typeof RAW_DATA] as RawSpecies;
  }

  toRaw(): Readonly<RawSpecies> {
    return this.#raw;
  }
}

export class SpeciesAlt {
  static {
    makeAlt = (raw) => new this(raw);
  }

  #raw: RawSpeciesAlt;
  #nameLower?: string;
  #types?: BuiltinType[];

  private constructor(raw: RawSpeciesAlt) {
    this.#raw = raw;
  }

  get kind() {
    return this.#raw.kind;
  }

  get name() {
    return this.#raw.name;
  }

  get nameLower() {
    this.#nameLower ??= this.name.toLowerCase();
    return this.#nameLower;
  }

  get types() {
    this.#types ??= this.typeKeys.map(BUILTIN_TYPES.of);
    return this.#types;
  }

  get typeKeys() {
    return this.#raw.types;
  }
}

export const SPECIES = (() => {
  const all = Object.keys(RAW_DATA).map(make);
  const map = new Map(all.map((s) => [s.key, s]));

  function has(key: string) {
    return key in RAW_DATA;
  }

  function tryOf(key: string) {
    return key in RAW_DATA ? make(key) : undefined;
  }

  function of(key: string) {
    return unwrap(tryOf(key), `Unknown species ${key}`);
  }

  return { all, map, has, tryOf, of };
})();
