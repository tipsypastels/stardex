import { Species, type SpeciesAlt, type SpeciesKey } from "./species";
import { Type } from "./type";

let makeBuiltin: (data: BuiltinPokemonData) => BuiltinPokemon;
let makeCustom: (data: CustomPokemonData) => CustomPokemon;

interface SharedPokemonData {
  exclude?: boolean;
  comment?: string;
  newlinesBefore?: number;
  newlinesAfterIfLast?: number;
}

interface BuiltinPokemonData extends SharedPokemonData {
  species: SpeciesKey;
  type?: string[];
}

interface CustomPokemonData extends SharedPokemonData {
  key: string;
  name: string;
  type: string[];
}

export type PokemonDataJson =
  | (BuiltinPokemonData & { species: SpeciesKey | { key: string } })
  | CustomPokemonData;

export abstract class Pokemon {
  static fromJson(data: PokemonDataJson) {
    if ("species" in data) {
      const species: { key: SpeciesKey } | SpeciesKey = data.species;
      return makeBuiltin({ ...data, species: typeof species === "string" ? species : species.key });
    }
    return makeCustom(data);
  }

  abstract key: string;
  abstract name: string;
  abstract types: Type[];
  abstract typeKeys: string[];
  abstract species: Species | undefined;
  abstract alt: SpeciesAlt | undefined;

  abstract setType(typeKeys: string[]): void;

  protected abstract shared: SharedPokemonData;
  protected abstract clone(): Pokemon;

  abstract toJSON(): unknown;

  get exclude() {
    return this.shared.exclude;
  }

  get comment() {
    return this.shared.comment;
  }

  get newlinesBefore() {
    return this.shared.newlinesBefore;
  }

  get newlinesAfterIfLast() {
    return this.shared.newlinesAfterIfLast;
  }

  setTypeAt(index: number, typeKey: string) {
    const clone = [...this.typeKeys];
    clone[index] = typeKey;
    this.setType(clone);
  }

  setExclude(exclude: boolean) {
    this.shared.exclude = exclude;
  }

  setComment(comment: string) {
    this.shared.comment = comment;
  }

  setNewlinesBefore(newlinesBefore: number) {
    this.shared.newlinesBefore = newlinesBefore;
  }

  setNewlinesAfterIfLast(newlinesAfterIfLast: number) {
    this.shared.newlinesAfterIfLast = newlinesAfterIfLast;
  }

  with(f: (pokemon: this) => void): this {
    const clone = this.clone() as this;
    f(clone);
    return clone;
  }

  isBuiltin(): this is BuiltinPokemon {
    return false;
  }

  isCustom(): this is CustomPokemon {
    return false;
  }
}

export class BuiltinPokemon extends Pokemon {
  static of(key: SpeciesKey) {
    return new this({ species: key });
  }

  static {
    makeBuiltin = (data) => new this(data);
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
    return Species.of(this.#data.species);
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

  protected get shared() {
    return this.#data;
  }

  protected clone() {
    return new BuiltinPokemon({ ...this.#data });
  }

  setType(typeKeys: string[]) {
    this.#data.type = typeKeys;
    this.#types = undefined;
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

  static {
    makeCustom = (data) => new this(data);
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

  protected get shared() {
    return this.#data;
  }

  protected clone() {
    return new CustomPokemon({ ...this.#data });
  }

  setType(typeKeys: string[]) {
    this.#data.type = typeKeys;
    this.#types = undefined;
  }

  setName(name: string) {
    this.#data.name = name;
  }

  isCustom(): this is CustomPokemon {
    return true;
  }

  toJSON() {
    return this.#data;
  }
}
