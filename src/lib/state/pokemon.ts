import { resolvePokemonKey, type Pokemon } from "$lib/models/pokemon";
import { derived } from "svelte/store";
import { createActions } from "./_actions";
import { createStorage } from "./_storage";

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
