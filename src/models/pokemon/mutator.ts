import { produce, type SetStoreFunction } from "solid-js/store";
import type { Pokemon } from ".";
import { assert } from "../../utils/assert";
import { TYPE_KEY_PAIRS } from "../type/key_pair";

export interface PokemonMutator {
  setCustomName(name: string): void;
  setTypeKeys(typeKeys: string[] | undefined): void;
  setTypeKeyAt(index: number, typeKey: string | undefined): void;
  setAltKind(altKind: string): void;
  unsetTypeKeysAndAlt(): void;
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

    setAltKind(altKind) {
      setAll(
        (all) => all.id === id,
        produce((pokemon) => {
          assert(pokemon.isBuiltin(), "Can't set alt kind of custom Pokémon");
          pokemon.altKind = altKind;
          pokemon.changedTypeKeys = undefined;
        }),
      );
    },

    unsetTypeKeysAndAlt() {
      setAll(
        (all) => all.id === id,
        produce((pokemon) => {
          assert(pokemon.isBuiltin(), "Can't unset type keys and alt of custom Pokémon");
          pokemon.altKind = undefined;
          pokemon.changedTypeKeys = undefined;
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
