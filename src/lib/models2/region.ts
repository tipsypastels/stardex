import DATA from "../data/regions.json" with { type: "json" };
import { Species, type SpeciesKey } from "./species";
import type { Type } from "./type";

let makeMember: (speciesKey: string, altKey?: string) => RegionMember;

interface RegionData {
  name: string;
  icon: string;
  pokemon: (string | { key: string; alt: string })[];
}

DATA satisfies Record<string, RegionData>;

export type RegionKey = keyof typeof DATA;

export class Region {
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
