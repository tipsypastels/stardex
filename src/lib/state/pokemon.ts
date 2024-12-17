import type { Pokemon } from "$lib/models/pokemon";
import { resolveSpecies } from "$lib/models/species";
import { createActions } from "./_actions";
import { createStorage } from "./_storage";

const storage = createStorage<Pokemon[]>("stardex_pokemon");
const initial = storage.initial ?? [
  { species: resolveSpecies("bulbasaur") },
  { species: resolveSpecies("ivysaur") },
  { species: resolveSpecies("venusaur") },
  { species: resolveSpecies("charmander") },
  { species: resolveSpecies("charmeleon") },
  { species: resolveSpecies("charizard") },
  { species: resolveSpecies("squirtle") },
  { species: resolveSpecies("wartortle") },
  { species: resolveSpecies("blastoise") },
];

export const pokemon = createActions(initial, (store) => {
  return {
    swap(i1: number, i2: number) {
      store.update(($pokemon) => {
        const $newPokemon = [...$pokemon];
        [$newPokemon[i1], $newPokemon[i2]] = [$newPokemon[i2], $newPokemon[i1]];
        return $newPokemon;
      });
    },
  };
});

export const pokemonPersister = storage.persister(pokemon);
