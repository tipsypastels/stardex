import { Species, type SpeciesAlt, type SpeciesKey } from "./species";
import { Type } from "./type";

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

export abstract class Pokemon {
  abstract key: string;
  abstract name: string;
  abstract types: Type[];
  abstract typeKeys: string[];
  abstract species: Species | undefined;
  abstract alt: SpeciesAlt | undefined;

  abstract withType(typeKeys: string[]): Pokemon;
  abstract setTypeInPlace(typeKeys: string[]): void;
  abstract withExclude(exclude: boolean): Pokemon;

  abstract toJSON(): unknown;

  protected abstract shared: SharedPokemonData;
  protected abstract clone(): Pokemon;

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

  setExcludeInPlace(exclude: boolean) {
    this.shared.exclude = exclude;
  }

  setCommentInPlace(comment: string) {
    this.shared.comment = comment;
  }

  setNewlinesBeforeInPlace(newlinesBefore: number) {
    this.shared.newlinesBefore = newlinesBefore;
  }

  setNewlinesAfterIfLastInPlace(newlinesAfterIfLast: number) {
    this.shared.newlinesAfterIfLast = newlinesAfterIfLast;
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

  withType(typeKeys: string[]) {
    const dup = new BuiltinPokemon({ ...this.#data });
    dup.setTypeInPlace(typeKeys);
    return dup;
  }

  setTypeInPlace(typeKeys: string[]) {
    this.#data.type = typeKeys;
    this.#types = undefined;
  }

  withExclude(exclude: boolean) {
    const dup = new BuiltinPokemon({ ...this.#data });
    dup.setExcludeInPlace(exclude);
    return dup;
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

  protected get shared() {
    return this.#data;
  }

  withType(typeKeys: string[]) {
    const dup = new CustomPokemon({ ...this.#data });
    dup.setTypeInPlace(typeKeys);
    return dup;
  }

  setTypeInPlace(typeKeys: string[]) {
    this.#data.type = typeKeys;
    this.#types = undefined;
  }

  withExclude(exclude: boolean) {
    const dup = new CustomPokemon({ ...this.#data });
    dup.setExcludeInPlace(exclude);
    return dup;
  }

  isCustom(): this is CustomPokemon {
    return true;
  }

  toJSON() {
    return this.#data;
  }
}
