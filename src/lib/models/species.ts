import DATA from "../data/species.json" with { type: "json" };
import { BuiltinType } from "./type";

interface SpeciesData {
  id: number;
  name: string;
  types: string[];
  evos?: { from?: string; to?: string[] };
  alts?: SpeciesAltData[];
}

interface SpeciesAltData {
  kind: string;
  name: string;
  types: string[];
}

DATA satisfies Record<string, SpeciesData>;

export type SpeciesKey = keyof typeof DATA;

export class Species {
  static ALL = Object.keys(DATA).map((k, i) => new this(k as SpeciesKey, i));
  static MAP = new Map(this.ALL.map((s) => [s.key as string, s]));

  static isKey(key: string): key is SpeciesKey {
    return key in DATA;
  }

  static of(key: SpeciesKey) {
    return this.MAP.get(key)!;
  }

  static tryOf(key: string) {
    return this.MAP.get(key);
  }

  readonly key: SpeciesKey;
  readonly index: number;

  #nameLower?: string;
  #types?: BuiltinType[];
  #alts?: SpeciesAlt[];

  protected constructor(key: SpeciesKey, index: number) {
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
    this.#types ??= this.typeKeys.map((k) => BuiltinType.of(k));
    return this.#types;
  }

  get typeKeys() {
    return this.#data.types;
  }

  get alts() {
    this.#alts ??= this.#data.alts?.map((d) => new SpeciesAlt(d)) ?? [];
    return this.#alts;
  }

  alt(kind: string) {
    const alt = this.alts.find((a) => a.kind === kind);
    if (!alt) throw new Error(`Unknown alt ${kind} for species ${this.key}.`);
    return alt;
  }

  getEvolutionLine() {
    if (!this.#data.evos || (!this.#data.evos.from && !this.#data.evos.to)) {
      return [this];
    }

    const finder = new EvolutionFinder((s) => s.#data);
    const origin = finder.findOrigin(this);
    return finder.followLine(origin);
  }

  get #data() {
    return DATA[this.key] as SpeciesData;
  }

  toJSON() {
    return this.#data;
  }
}

export class SpeciesAlt {
  #data: SpeciesAltData;
  #types?: BuiltinType[];

  constructor(data: SpeciesAltData) {
    this.#data = data;
  }

  get kind() {
    return this.#data.kind;
  }

  get name() {
    return this.#data.name;
  }

  get types() {
    this.#types ??= this.typeKeys.map((k) => BuiltinType.of(k));
    return this.#types;
  }

  get typeKeys() {
    return this.#data.types;
  }
}

class EvolutionFinder {
  #friend: (species: Species) => SpeciesData;

  constructor(friend: (species: Species) => SpeciesData) {
    this.#friend = friend;
  }

  findOrigin(initial: Species) {
    let origin = initial;
    while (this.#friend(origin).evos?.from) {
      origin = Species.tryOf(this.#friend(origin).evos!.from!)!;
    }
    return origin;
  }

  followLine(origin: Species) {
    const set = new Set([origin]);
    this.#followLine(origin, set);

    const out = [...set];
    out.sort((a, b) => a.id - b.id);
    return out;
  }

  #followLine(species: Species, out: Set<Species>) {
    const evosTo = this.#friend(species).evos?.to;
    if (evosTo) {
      for (const evoToKey of evosTo) {
        const evoTo = Species.tryOf(evoToKey)!;
        out.add(evoTo);
        this.#followLine(evoTo, out);
      }
    }
  }
}
