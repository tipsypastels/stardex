import { TYPES } from ".";
import type { Pokemon } from "../pokemon";

export const TYPE_KEY_PAIRS = (() => {
  function equatable(typeKeys: string[]) {
    return [...typeKeys].sort().join();
  }

  return {
    equal(left: string[], right: string[]) {
      return equatable(left) === equatable(right);
    },

    select(left: string[]) {
      return (right: string[]) => this.equal(left, right);
    },

    ordering(left: string[], right: string[]) {
      return new Array(Math.max(left.length, right.length))
        .fill(undefined)
        .reduce((prev: number, _, index) => {
          if (prev) return prev;

          const leftKey = left.at(index);
          const rightKey = right.at(index);

          if (leftKey && rightKey) return TYPES.ordering(leftKey, rightKey);
          // Pokemon with fewer types sort earlier.
          else if (leftKey) return 1;
          else if (rightKey) return -1;
          return 0;
        }, 0);
    },

    set(pokemon: Pokemon, keys: string[] | undefined) {
      keys = keys?.filter((s) => !!s);
      if (!keys || keys.length === 0) {
        if (pokemon.isBuiltin()) {
          pokemon.changedTypeKeys = undefined;
        }
        return;
      }
      if (pokemon.isBuiltin()) {
        if (this.equal(keys, pokemon.alt?.typeKeys ?? pokemon.species.typeKeys)) {
          pokemon.changedTypeKeys = undefined;
          return;
        }
        pokemon.changedTypeKeys = keys;
      } else {
        pokemon.typeKeys = keys;
      }
    },

    setAt(pokemon: Pokemon, index: number, key: string | undefined) {
      const keys = [...pokemon.typeKeys];
      if (key) {
        keys[index] = key;
      } else {
        keys.splice(index, 1);
      }
      this.set(pokemon, keys);
    },
  };
})();
