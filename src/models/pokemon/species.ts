import RAW_DATA from "../../data/species.json" with { type: "json" };
import { must } from "../../utils/assert";
import { BUILTIN_TYPES, type Type } from "../type";

export interface RawSpecies {
  id: number;
  name: string;
  hiddenName?: string;
  noAltName?: string;
  types: string[];
  evos?: { from?: string; to?: string[] };
  alts?: RawSpeciesAlt[];
}

export interface RawSpeciesAlt {
  kind: string;
  name: string;
  types: string[];
  iconIndex: number;
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
  #noAltNameLower?: string | false;
  #types?: Type[];
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

  get hiddenName() {
    return this.#raw.hiddenName;
  }

  get noAltName() {
    return this.#raw.noAltName;
  }

  get noAltNameLower() {
    if (this.#noAltNameLower === false) return;
    this.#noAltNameLower ??= this.noAltName?.toLowerCase() || false;
    return this.#noAltNameLower || undefined;
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
    return must(
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
  #types?: Type[];

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

  get iconIndex() {
    return this.#raw.iconIndex;
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
    return must(tryOf(key), `Unknown species ${key}`);
  }

  function search(pattern: string) {
    pattern = pattern.toLowerCase();
    return (
      tryOf(pattern) ||
      tryOf(pattern.replace(" ", "-")) ||
      all.find((s) => s.nameLower === pattern || s.hiddenName?.toLowerCase() === pattern) ||
      all.find(
        (s) =>
          s.nameLower.replace(" ", "") === pattern ||
          s.hiddenName?.toLowerCase().replace(" ", "") === pattern,
      )
    );
  }

  return { all, map, has, tryOf, of, search };
})();
