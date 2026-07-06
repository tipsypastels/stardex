import type { Rekey } from "$lib/utils/types";
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
  types?: string[];
}

export interface CustomPokemonData extends SharedPokemonData {
  key: string;
  name: string;
  types: string[];
}

export type PokemonData = BuiltinPokemonData | CustomPokemonData;

export type V0_BuiltinPokemonData = Omit<BuiltinPokemonData, "v" | "species" | "types"> & {
  species: { key: SpeciesKey };
  type?: string[];
};
export type V0_CustomPokemonData = Omit<Rekey<CustomPokemonData, "types", "type">, "v">;
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

  abstract setTypesMut(typeKeys: string[]): void;

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

  setTypeAtMut(index: number, typeKey: string | undefined) {
    const clone = [...this.typeKeys];
    if (typeKey) {
      clone[index] = typeKey;
    } else {
      clone.splice(index, 1);
    }
    this.setTypesMut(clone);
  }

  setExcludeMut(exclude: boolean) {
    this.shared.exclude = exclude;
  }

  setCommentMut(comment: string) {
    this.shared.comment = comment;
  }

  setNewlinesBeforeMut(newlinesBefore: number) {
    this.shared.newlinesBefore = newlinesBefore;
  }

  setNewlinesAfterIfLastMut(newlinesAfterIfLast: number) {
    this.shared.newlinesAfterIfLast = newlinesAfterIfLast;
  }

  setTypes(typeKeys: string[]) {
    return this.with((pokemon) => pokemon.setTypesMut(typeKeys));
  }

  setTypeAt(index: number, typeKey: string | undefined) {
    return this.with((pokemon) => pokemon.setTypeAtMut(index, typeKey));
  }

  setExclude(exclude: boolean) {
    return this.with((pokemon) => pokemon.setExcludeMut(exclude));
  }

  setComment(comment: string) {
    return this.with((pokemon) => pokemon.setCommentMut(comment));
  }

  setNewlinesBefore(newlinesBefore: number) {
    return this.with((pokemon) => pokemon.setNewlinesBeforeMut(newlinesBefore));
  }

  setNewlinesAfterIfLast(newlinesAfterIfLast: number) {
    return this.with((pokemon) => pokemon.setNewlinesAfterIfLastMut(newlinesAfterIfLast));
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
      const { type: types, species, ...rest } = data;
      return new this({ v: V, ...rest, species: species.key, types });
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
    return this.#data.types ?? this.species.typeKeys;
  }

  #resolveTypes() {
    return this.#data.types?.map((t) => Type.of(t)) ?? false;
  }

  get species(): Species {
    return Species.of(this.#data.species);
  }

  get alt() {
    this.#alt ??= this.#resolveAlt();
    return this.#alt || undefined;
  }

  #resolveAlt() {
    if (!this.#data.types || this.species.alts.length === 0) {
      return false;
    }

    const s = (types: string[]) => types.sort().join();
    const own = s(this.#data.types);
    return this.species.alts.find((a) => s(a.typeKeys) === own);
  }

  protected get shared() {
    return this.#data;
  }

  protected clone() {
    return new BuiltinPokemon({ ...this.#data });
  }

  setTypesMut(typeKeys: string[]) {
    this.#data.types = typeKeys;
    this.#types = undefined;
  }

  unsetTypesMut() {
    delete this.#data.types;
    this.#types = undefined;
  }

  unsetTypes() {
    return this.with((pokemon) => pokemon.unsetTypesMut());
  }

  isBuiltin(): this is BuiltinPokemon {
    return true;
  }

  toJson() {
    return this.#data;
  }
}

export class CustomPokemon extends Pokemon {
  static of(key: string, name: string, types: string[]) {
    return new this({ v: V, key, name, types });
  }

  static {
    makeCustom = (data) => {
      if ("v" in data) return new this(data);
      const { type: types, ...rest } = data;
      return new this({ v: V, ...rest, types });
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
    this.#types ??= this.#data.types.map((t) => Type.of(t));
    return this.#types;
  }

  get typeKeys() {
    return this.#data.types;
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

  setTypesMut(typeKeys: string[]) {
    this.#data.types = typeKeys;
    this.#types = undefined;
  }

  setNameMut(name: string) {
    this.#data.name = name;
  }

  setName(name: string) {
    return this.with((pokemon) => pokemon.setNameMut(name));
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

  push(...pokemons: Pokemon[]) {
    return new Pokemons(this.#list.push(...pokemons.filter((p) => !this.has(p))));
  }

  setName(index: number, name: string) {
    return this.#setAt(index, (pokemon) => {
      if (!pokemon.isCustom()) {
        throw new Error(`Can't change the name of a builtin pokemon.`);
      }
      return pokemon.setName(name);
    });
  }

  setTypes(index: number, typeKeys: string[]) {
    return this.#setAt(index, (pokemon) => pokemon.setTypes(typeKeys));
  }

  setTypeAt(index: number, typeIndex: number, typeKey: string | undefined) {
    return this.#setAt(index, (pokemon) => pokemon.setTypeAt(typeIndex, typeKey));
  }

  unsetTypes(index: number) {
    return this.#setAt(index, (pokemon) => {
      if (!pokemon.isBuiltin()) {
        throw new Error("Can't unset the type of a custom pokemon.");
      }
      return pokemon.unsetTypes();
    });
  }

  setExclude(index: number, exclude: boolean) {
    return this.#setAt(index, (pokemon) => pokemon.setExclude(exclude));
  }

  swap(index: number, jndex: number) {
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

  delete(index: number) {
    return this.#dup(this.#list.delete(index));
  }

  #setAt(index: number, f: (pokemon: Pokemon) => Pokemon) {
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
