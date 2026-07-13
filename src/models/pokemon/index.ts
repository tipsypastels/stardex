import { computed, createModel, effect, signal } from "@preact/signals";
import { readonly, type Lifter } from "../../utils/signal";
import { matchTypeKeysUnorderedInArray, TypeKeyPair } from "../type/key_pair";
import { POKEMON_VERSION, upgradeRawBuiltinPokemon, upgradeRawCustomPokemon } from "../versioned";
import {
  type V0_RawBuiltinPokemon,
  type V0_RawCustomPokemon,
  type V0_RawPokemon,
} from "../versioned/v0";
import { SPECIES } from "./species";

/* -------------------------------------------------------------------------- */
/*                                     Raw                                    */
/* -------------------------------------------------------------------------- */

export interface RawSharedPokemon {
  v: typeof POKEMON_VERSION;
  exclude?: boolean;
}

export interface RawBuiltinPokemon extends RawSharedPokemon {
  species: string;
  types?: string[];
}

export interface RawCustomPokemon extends RawSharedPokemon {
  key: string;
  name: string;
  types: string[];
}

export type RawPokemon = RawBuiltinPokemon | RawCustomPokemon;

/* -------------------------------------------------------------------------- */
/*                                   Shared                                   */
/* -------------------------------------------------------------------------- */

export type Pokemon = BuiltinPokemon | CustomPokemon;

export const POKEMONS = (() => {
  function from(raw: RawPokemon | V0_RawPokemon, lifter: Lifter) {
    return "species" in raw
      ? BUILTIN_POKEMONS.from(raw, lifter)
      : CUSTOM_POKEMONS.from(raw, lifter);
  }
  return { from };
})();

/* -------------------------------------------------------------------------- */
/*                               Builtin Pokemon                              */
/* -------------------------------------------------------------------------- */

export type BuiltinPokemon = InstanceType<typeof BuiltinPokemon>;

export const BuiltinPokemon = createModel((raw: RawBuiltinPokemon, lifter: Lifter) => {
  const species = signal(SPECIES.of(raw.species));
  const key = computed(() => species.value.key);
  const name = computed(() => species.value.name);

  const typeKeyPair = new TypeKeyPair(raw.types ?? species.value.typeKeys, {
    fallback: species.value.typeKeys,
  });

  const alt = computed(() => {
    if (typeKeyPair.changed.value && species.value.alts.length > 0) {
      return matchTypeKeysUnorderedInArray(typeKeyPair.keys.value, species.value.alts);
    }
  });

  const exclude = signal(raw.exclude);

  effect(() => {
    typeKeyPair.keys.value;
    exclude.value;
    lifter.change();
  });

  return {
    species: readonly(species),
    key,
    name,
    typeKeys: typeKeyPair.keys,
    typeChanged: typeKeyPair.changed,
    types: typeKeyPair.types,
    alt,
    exclude,
    setTypeKeys(newTypeKeys: string[] | undefined) {
      typeKeyPair.set(newTypeKeys);
    },
    setTypeKeyAt(index: number, typeKey: string | undefined) {
      typeKeyPair.setAt(index, typeKey);
    },
    toRaw(): RawBuiltinPokemon {
      return {
        ...raw,
        species: species.value.key,
        types: typeKeyPair.changed.value ? typeKeyPair.keys.value : undefined,
        exclude: exclude.value,
      };
    },
    toJSON(): unknown {
      return this.toRaw();
    },
  };
});

export const BUILTIN_POKEMONS = (() => {
  function of(key: string, lifter: Lifter) {
    return new BuiltinPokemon({ v: POKEMON_VERSION, species: key }, lifter);
  }

  function from(raw: RawBuiltinPokemon | V0_RawBuiltinPokemon, lifter: Lifter) {
    return new BuiltinPokemon(upgradeRawBuiltinPokemon(raw), lifter);
  }

  return { of, from };
})();

/* -------------------------------------------------------------------------- */
/*                               Custom Pokemon                               */
/* -------------------------------------------------------------------------- */

export type CustomPokemon = InstanceType<typeof CustomPokemon>;

export const CustomPokemon = createModel((raw: RawCustomPokemon, lifter: Lifter) => {
  const key = signal(raw.key);
  const name = signal(raw.name);

  const typeKeyPair = new TypeKeyPair(raw.types);

  const species = signal(undefined);
  const alt = signal(undefined);

  const exclude = signal(raw.exclude);

  effect(() => {
    name.value;
    typeKeyPair.keys.value;
    exclude.value;
    lifter.change();
  });

  return {
    species,
    key,
    name,
    typeKeys: typeKeyPair.keys,
    typeChanged: typeKeyPair.changed,
    types: typeKeyPair.types,
    alt,
    exclude,
    setTypeKeys(newTypeKeys: string[] | undefined) {
      typeKeyPair.set(newTypeKeys);
    },
    setTypeKeyAt(index: number, typeKey: string | undefined) {
      typeKeyPair.setAt(index, typeKey);
    },
    toRaw(): RawCustomPokemon {
      return {
        ...raw,
        key: key.value,
        name: name.value,
        types: typeKeyPair.keys.value,
        exclude: exclude.value,
      };
    },
    toJSON(): unknown {
      return this.toRaw();
    },
  };
});

export const CUSTOM_POKEMONS = (() => {
  function of(key: string, name: string, typeKeys: string[], lifter: Lifter) {
    return new CustomPokemon({ v: POKEMON_VERSION, key, name, types: typeKeys }, lifter);
  }

  function from(raw: RawCustomPokemon | V0_RawCustomPokemon, lifter: Lifter) {
    return new CustomPokemon(upgradeRawCustomPokemon(raw), lifter);
  }

  return { of, from };
})();
