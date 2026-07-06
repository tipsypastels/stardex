import * as DATA from "../data/species.json" with { type: "json" };
import { BuiltinType } from "./type";

interface SpeciesData {
  id: number;
  name: string;
  type: string[];
  evos?: { from?: string; to?: string[] };
  alts?: SpeciesAltData[];
}

interface SpeciesAltData {
  whence: string;
  type: string[];
}

DATA satisfies Record<string, SpeciesData>;

export type SpeciesKey = keyof typeof DATA;

export class Species {
  static ALL = Object.keys(DATA).map((k, i) => new this(k as SpeciesKey, i));
  static MAP = new Map(this.ALL.map((s) => [s.key as string, s]));

  static isKey(key: string): key is SpeciesKey {
    return key in DATA;
  }

  static get(key: SpeciesKey) {
    return this.MAP.get(key)!;
  }

  readonly key: SpeciesKey;
  readonly index: number;

  #nameLower?: string;
  #types?: BuiltinType[];
  #alts?: SpeciesAlt[];

  private constructor(key: SpeciesKey, index: number) {
    this.key = key;
    this.index = index;
  }

  get id() {
    return this.#data.id;
  }

  get name() {
    return this.#data.name;
  }

  get nameLower() {
    this.#nameLower ??= this.name.toLowerCase();
    return this.#nameLower;
  }

  get types() {
    this.#types ??= this.typeKeys.map((k) => BuiltinType.get(k));
    return this.#types;
  }

  get typeKeys() {
    return this.#data.type;
  }

  get alts() {
    this.#alts ??= this.#data.alts?.map((d) => new SpeciesAlt(d)) ?? [];
    return this.#alts;
  }

  get #data() {
    return DATA[this.key] as SpeciesData;
  }

  toJSON() {
    return this.key;
  }
}

export class SpeciesAlt {
  #data: SpeciesAltData;
  #types?: BuiltinType[];

  constructor(data: SpeciesAltData) {
    this.#data = data;
  }

  get whence() {
    return this.#data.whence;
  }

  get types() {
    this.#types ??= this.typeKeys.map((k) => BuiltinType.get(k));
    return this.#types;
  }

  get typeKeys() {
    return this.#data.type;
  }
}
