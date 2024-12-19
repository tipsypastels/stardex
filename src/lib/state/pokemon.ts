import {
  isPokemonCustom,
  resolvePokemonKey,
  resolvePokemonTypeKeys,
  type Pokemon,
  type PokemonSpecies,
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
    setType(monIndex: number, typeIndex: number, typeKey: string) {
      store.update(($pokemon) => {
        const $newPokemon = [...$pokemon];
        const mon = $newPokemon[monIndex];
        const typeKeys = resolvePokemonTypeKeys(mon);
        typeKeys[typeIndex] = typeKey;
        const newMon = { ...mon, type: typeKeys };

        if (!isPokemonCustom(mon) && areArraysEqual(typeKeys, mon.species.type)) {
          console.log("resetting", typeKeys);
          delete (newMon as PokemonSpecies).type;
        }

        $newPokemon[monIndex] = newMon;
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
