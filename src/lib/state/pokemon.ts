import {
  isPokemonCustom,
  type Pokemon,
  type PokemonSpecies,
  resolvePokemonKey,
  resolvePokemonTypeKeys,
} from "$lib/models/pokemon";
import { derived } from "svelte/store";
import { createActions } from "./_actions";
import { createStorage } from "./_storage";
import { areArraysEqual } from "$lib/utils/arrays";

const storage = createStorage<Pokemon[]>("stardex_pokemon");
const initial: Pokemon[] = storage.initial ?? [];

export const pokemon = createActions(initial, (store) => {
  return {
    add(mon: Pokemon) {
      store.update(($pokemon) => $pokemon.concat(mon));
    },
    addBatch(mons: Pokemon[]) {
      store.update(($pokemon) => $pokemon.concat(...mons));
    },
    setType(monIndex: number, typeIndex: number, typeKey: string | undefined) {
      store.update(($pokemon) => {
        const $newPokemon = [...$pokemon];
        const mon = $newPokemon[monIndex];
        const typeKeys = [...resolvePokemonTypeKeys(mon)];

        if (typeKey) {
          typeKeys[typeIndex] = typeKey;
        } else {
          typeKeys.splice(typeIndex, 1);
        }

        const newMon = { ...mon, type: [...new Set(typeKeys)] };

        if (
          !isPokemonCustom(mon) && areArraysEqual(typeKeys, mon.species.type)
        ) {
          delete (newMon as PokemonSpecies).type;
        }

        $newPokemon[monIndex] = newMon;
        return $newPokemon;
      });
    },
    resetType(index: number) {
      store.update(($pokemon) => {
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
    },
    setExclude(index: number, exclude: boolean) {
      store.update(($pokemon) => {
        const $newPokemon = [...$pokemon];
        $newPokemon[index].exclude = exclude;
        return $newPokemon;
      });
    },
    swap(i1: number, i2: number) {
      store.update(($pokemon) => {
        const $newPokemon = [...$pokemon];
        [$newPokemon[i1], $newPokemon[i2]] = [$newPokemon[i2], $newPokemon[i1]];
        return $newPokemon;
      });
    },
    remove(index: number) {
      store.update(($pokemon) => {
        const $newPokemon = [...$pokemon];
        $newPokemon.splice(index, 1);
        return $newPokemon;
      });
    },
    set(mons: Pokemon[]) {
      store.set(mons);
    },
    clear() {
      store.set([]);
    },
  };
});

export const pokemonInclusion = derived(
  pokemon,
  ($pokemon) => new Map($pokemon.map((mon, i) => [resolvePokemonKey(mon), i])),
);

export const pokemonPersister = storage.persister(pokemon);
