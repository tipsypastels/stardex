import type { Species, SpeciesAlt } from "./species";
import { Type } from "./type";

interface SharedPokemonData {
  exclude?: boolean;
  comment?: string;
  newlinesBefore?: number;
  newlinesAfterIfLast?: number;
}

interface BuiltinPokemonData extends SharedPokemonData {
  species: Species;
  type?: string[];
}

interface CustomPokemonData extends SharedPokemonData {
  key: string;
  name: string;
  type: string[];
}

export abstract class Pokemon {
  abstract key: string;
  abstract name: string;
  abstract types: Type[];
  abstract typeKeys: string[];
  abstract species: Species | undefined;
  abstract alt: SpeciesAlt | undefined;
  abstract toJSON(): unknown;

  isBuiltin(): this is BuiltinPokemon {
    return false;
  }

  isCustom(): this is CustomPokemon {
    return false;
  }
}

export class BuiltinPokemon extends Pokemon {
  static of(species: Species) {
    return new this({ species });
  }

  #data: BuiltinPokemonData;
  #types?: Type[] | false;
  #alt?: SpeciesAlt | false;

  private constructor(data: BuiltinPokemonData) {
    super();
    this.#data = data;
  }

  get key() {
    return this.species.key;
  }

  get name() {
    return this.species.name;
  }

  get types() {
    this.#types ??= this.#resolveTypes();
    return this.#types || this.species.types;
  }

  get typeKeys() {
    return this.#data.type ?? this.species.typeKeys;
  }

  #resolveTypes() {
    return this.#data.type?.map((t) => Type.of(t)) ?? false;
  }

  get species(): Species {
    return this.#data.species;
  }

  get alt() {
    this.#alt ??= this.#resolveAlt();
    return this.#alt || undefined;
  }

  #resolveAlt() {
    if (!this.#data.type || this.species.alts.length === 0) {
      return false;
    }

    const s = (types: string[]) => types.sort().join();
    const own = s(this.#data.type);
    return this.species.alts.find((a) => s(a.typeKeys) === own);
  }

  isBuiltin(): this is BuiltinPokemon {
    return true;
  }

  toJSON() {
    return this.#data;
  }
}

export class CustomPokemon extends Pokemon {
  static of(key: string, name: string, type: string[]) {
    return new this({ key, name, type });
  }

  #data: CustomPokemonData;
  #types?: Type[];

  private constructor(data: CustomPokemonData) {
    super();
    this.#data = data;
  }

  get key() {
    return this.#data.key;
  }

  get name() {
    return this.#data.name;
  }

  withName(name: string) {
    return new CustomPokemon({ ...this.#data, name });
  }

  get types() {
    this.#types ??= this.#data.type.map((t) => Type.of(t));
    return this.#types;
  }

  get typeKeys() {
    return this.#data.type;
  }

  get species(): undefined {
    return;
  }

  get alt(): undefined {
    return;
  }

  isCustom(): this is CustomPokemon {
    return true;
  }

  toJSON() {
    return this.#data;
  }
}
