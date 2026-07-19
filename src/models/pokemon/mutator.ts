import { produce, type SetStoreFunction } from "solid-js/store";
import type { Pokemon } from ".";
import { assert } from "../../utils/assert";
import { TYPE_KEY_PAIRS } from "../type/key_pair";

export interface PokemonMutator {
  setCustomName(name: string): void;
  setTypeKeys(typeKeys: string[] | undefined): void;
  setTypeKeyAt(index: number, typeKey: string | undefined): void;
  setExclude(exclude: boolean): void;
}

export function createPokemonMutator(
  id: string,
  setAll: SetStoreFunction<Pokemon[]>,
): PokemonMutator {
  return {
    setCustomName(name) {
      setAll(
        (all) => all.id === id,
        produce((pokemon) => {
          assert(pokemon.isCustom(), "Can't rename builtin Pokémon");
          pokemon.name = name;
        }),
      );
    },

    setTypeKeys(typeKeys) {
      setAll(
        (all) => all.id === id,
        produce((pokemon) => {
          TYPE_KEY_PAIRS.set(pokemon, typeKeys);
        }),
      );
    },

    setTypeKeyAt(index, typeKey) {
      setAll(
        (all) => all.id === id,
        produce((pokemon) => {
          TYPE_KEY_PAIRS.setAt(pokemon, index, typeKey);
        }),
      );
    },

    setExclude(exclude) {
      setAll(
        (all) => all.id === id,
        produce((pokemon) => {
          pokemon.exclude = exclude || undefined;
        }),
      );
    },
  };
}
