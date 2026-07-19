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

    set(pokemon: Pokemon, keys: string[] | undefined) {
      keys = keys?.filter((s) => !!s);
      if (!keys || keys.length === 0) {
        if (pokemon.isBuiltin()) {
          pokemon.changedTypeKeys = undefined;
        }
        return;
      }
      if (pokemon.isBuiltin()) {
        if (this.equal(keys, pokemon.species.typeKeys)) {
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
