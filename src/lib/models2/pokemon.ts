import { Species, type SpeciesAlt, type SpeciesKey } from "./species";
import { Type } from "./type";
import { Map as IMap, List as IList } from "immutable";

let makeBuiltin: (data: BuiltinPokemonData | V0_BuiltinPokemonData) => BuiltinPokemon;
let makeCustom: (data: CustomPokemonData | V0_CustomPokemonData) => CustomPokemon;

const V = 1;

interface SharedPokemonData {
  v: typeof V;
  exclude?: boolean;
  comment?: string;
  newlinesBefore?: number;
  newlinesAfterIfLast?: number;
}

export interface BuiltinPokemonData extends SharedPokemonData {
  species: SpeciesKey;
  // TODO: Rename these too.
  type?: string[];
}

export interface CustomPokemonData extends SharedPokemonData {
  key: string;
  name: string;
  type: string[];
}

export type PokemonData = BuiltinPokemonData | CustomPokemonData;

export type V0_BuiltinPokemonData = Omit<BuiltinPokemonData, "v" | "species"> & {
  species: { key: SpeciesKey };
};
export type V0_CustomPokemonData = Omit<CustomPokemonData, "v">;
export type V0_PokemonData = V0_BuiltinPokemonData | V0_CustomPokemonData;

export abstract class Pokemon {
  static from(data: PokemonData | V0_PokemonData) {
    return "species" in data ? makeBuiltin(data) : makeCustom(data);
  }

  abstract key: string;
  abstract name: string;
  abstract types: Type[];
  abstract typeKeys: string[];
  abstract species: Species | undefined;
  abstract alt: SpeciesAlt | undefined;

  abstract setTypes(typeKeys: string[]): void;

  protected abstract shared: SharedPokemonData;
  protected abstract clone(): Pokemon;

  abstract toJson(): unknown;

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

  setTypeAt(index: number, typeKey: string | undefined) {
    const clone = [...this.typeKeys];
    if (typeKey) {
      clone[index] = typeKey;
    } else {
      clone.splice(index, 1);
    }
    this.setTypes(clone);
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

  withTypes(typeKeys: string[]) {
    return this.with((pokemon) => pokemon.setTypes(typeKeys));
  }

  withTypeAt(index: number, typeKey: string | undefined) {
    return this.with((pokemon) => pokemon.setTypeAt(index, typeKey));
  }

  withExclude(exclude: boolean) {
    return this.with((pokemon) => pokemon.setExclude(exclude));
  }

  withComment(comment: string) {
    return this.with((pokemon) => pokemon.setComment(comment));
  }

  withNewlinesBefore(newlinesBefore: number) {
    return this.with((pokemon) => pokemon.setNewlinesBefore(newlinesBefore));
  }

  withNewlinesAfterIfLast(newlinesAfterIfLast: number) {
    return this.with((pokemon) => pokemon.setNewlinesAfterIfLast(newlinesAfterIfLast));
  }

  protected with(f: (pokemon: this) => void): this {
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
    return new this({ v: V, species: key });
  }

  static {
    makeBuiltin = (data) => {
      if ("v" in data) return new this(data);
      return new this({ v: V, ...data, species: data.species.key });
    };
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

  setTypes(typeKeys: string[]) {
    this.#data.type = typeKeys;
    this.#types = undefined;
  }

  unsetTypes() {
    delete this.#data.type;
    this.#types = undefined;
  }

  withoutTypes() {
    return this.with((pokemon) => pokemon.unsetTypes());
  }

  isBuiltin(): this is BuiltinPokemon {
    return true;
  }

  toJson() {
    return this.#data;
  }
}

export class CustomPokemon extends Pokemon {
  static of(key: string, name: string, type: string[]) {
    return new this({ v: V, key, name, type });
  }

  static {
    makeCustom = (data) => {
      if ("v" in data) return new this(data);
      return new this({ v: V, ...data });
    };
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

  setTypes(typeKeys: string[]) {
    this.#data.type = typeKeys;
    this.#types = undefined;
  }

  setName(name: string) {
    this.#data.name = name;
  }

  withName(name: string) {
    return this.with((pokemon) => pokemon.setName(name));
  }

  isCustom(): this is CustomPokemon {
    return true;
  }

  toJson() {
    return this.#data;
  }
}

export class Pokemons {
  static from(datas: (PokemonData | V0_PokemonData)[]) {
    return new this(IList(datas.map((d) => Pokemon.from(d))));
  }

  static default() {
    return new this(IList());
  }

  #list: IList<Pokemon>;
  #indices: IMap<string, number>;

  private constructor(pokemons: IList<Pokemon>) {
    this.#list = pokemons;
    this.#indices = IMap(this.#list.map((p, i) => [p.key, i]));
  }

  has(pokemon: Pokemon) {
    return this.hasKey(pokemon.key);
  }

  hasKey(key: string) {
    return this.#indices.has(key);
  }

  get(index: number) {
    const pokemon = this.#list.get(index);
    if (!pokemon) {
      throw new Error(`Can't get pokemon at overflow index ${index}.`);
    }
    return pokemon;
  }

  withPushed(...pokemons: Pokemon[]) {
    return new Pokemons(this.#list.push(...pokemons.filter((p) => !this.has(p))));
  }

  withName(index: number, name: string) {
    return this.#withAt(index, (pokemon) => {
      if (!pokemon.isCustom()) {
        throw new Error(`Can't change the name of a builtin pokemon.`);
      }
      return pokemon.withName(name);
    });
  }

  withTypes(index: number, typeKeys: string[]) {
    return this.#withAt(index, (pokemon) => pokemon.withTypes(typeKeys));
  }

  withTypeAt(index: number, typeIndex: number, typeKey: string | undefined) {
    return this.#withAt(index, (pokemon) => pokemon.withTypeAt(typeIndex, typeKey));
  }

  withoutTypes(index: number) {
    return this.#withAt(index, (pokemon) => {
      if (!pokemon.isBuiltin()) {
        throw new Error("Can't unset the type of a custom pokemon.");
      }
      return pokemon.withoutTypes();
    });
  }

  withExclude(index: number, exclude: boolean) {
    return this.#withAt(index, (pokemon) => pokemon.withExclude(exclude));
  }

  withSwapped(index: number, jndex: number) {
    return this.#dup(
      this.#list.withMutations((list) => {
        const a = list.get(index);
        const b = list.get(jndex);
        if (!a || !b) {
          throw new Error("Can't swap past pokemons list bounds.");
        }
        return list.set(index, b).set(jndex, a);
      }),
    );
  }

  without(index: number) {
    return this.#dup(this.#list.remove(index));
  }

  #withAt(index: number, f: (pokemon: Pokemon) => Pokemon) {
    const list = this.#list.update(index, (p) => (p ? f(p) : undefined));
    return this.#dup(list);
  }

  #dup(list: IList<Pokemon>) {
    return new Pokemons(list);
  }

  toJson() {
    return this.#list.map((p) => p.toJson()).toArray();
  }
}
