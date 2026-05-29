import { createAllotment, type Allotment } from "$lib/metrics/allotment";
import {
  isPokemonCustom,
  resolvePokemonKey,
  resolvePokemonTypeKeys,
  type Pokemon,
  type PokemonSpecies,
} from "$lib/models/pokemon";
import { areArraysEqual } from "$lib/utils/arrays";
import { derived, type Readable, type Writable } from "svelte/store";

export class PokemonState implements Readable<Pokemon[]> {
  #store: Writable<Pokemon[]>;

  readonly inclusion: Readable<Map<string, number>>;
  readonly allotment: Readable<Allotment>;

  constructor(store: Writable<Pokemon[]>) {
    this.#store = store;

    this.inclusion = derived(
      store,
      ($mons) => new Map($mons.map((mon, i) => [resolvePokemonKey(mon), i])),
    );
    this.allotment = derived(store, createAllotment);
  }

  get subscribe() {
    return this.#store.subscribe;
  }

  add(mon: Pokemon) {
    this.#store.update(($pokemon) => $pokemon.concat(mon));
  }

  addBatch(mons: Pokemon[]) {
    this.#store.update(($pokemon) => $pokemon.concat(...mons));
  }

  setType(monIndex: number, typeIndex: number, typeKey: string | undefined) {
    this.#store.update(($pokemon) => {
      const $newPokemon = [...$pokemon];
      const mon = $newPokemon[monIndex];
      const typeKeys = [...resolvePokemonTypeKeys(mon)];

      if (typeKey) {
        typeKeys[typeIndex] = typeKey;
      } else {
        typeKeys.splice(typeIndex, 1);
      }

      const newMon = { ...mon, type: [...new Set(typeKeys)] };

      if (!isPokemonCustom(mon) && areArraysEqual(typeKeys, mon.species.type)) {
        delete (newMon as PokemonSpecies).type;
      }

      $newPokemon[monIndex] = newMon;
      return $newPokemon;
    });
  }

  resetType(index: number) {
    this.#store.update(($pokemon) => {
      const $newPokemon = [...$pokemon];
      const mon = $newPokemon[index];

      if (isPokemonCustom(mon)) {
        throw new Error("Can't call resetType() on a custom mon");
      }

      const newMon: PokemonSpecies = { ...mon };
      delete newMon.type;

      $newPokemon[index] = newMon;
      return $newPokemon;
    });
  }

  setExclude(index: number, exclude: boolean) {
    this.#store.update(($pokemon) => {
      const $newPokemon = [...$pokemon];
      $newPokemon[index].exclude = exclude;
      return $newPokemon;
    });
  }

  swap(i1: number, i2: number) {
    this.#store.update(($pokemon) => {
      const $newPokemon = [...$pokemon];
      [$newPokemon[i1], $newPokemon[i2]] = [$newPokemon[i2], $newPokemon[i1]];
      return $newPokemon;
    });
  }

  remove(index: number) {
    this.#store.update(($pokemon) => {
      const $newPokemon = [...$pokemon];
      $newPokemon.splice(index, 1);
      return $newPokemon;
    });
  }

  set(mons: Pokemon[]) {
    this.#store.set(mons);
  }

  clear() {
    this.#store.set([]);
  }
}
