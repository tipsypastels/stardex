import { computed, createModel, Signal, signal } from "@preact/signals";
import { readonly } from "../utils/signal";
import { SPECIES } from "./species";
import { TYPES } from "./type";
import { POKEMON_VERSION, upgradeRawBuiltinPokemon, upgradeRawCustomPokemon } from "./versioned";
import {
  type V0_RawBuiltinPokemon,
  type V0_RawCustomPokemon,
  type V0_RawPokemon,
} from "./versioned/v0";

/* -------------------------------------------------------------------------- */
/*                                     Raw                                    */
/* -------------------------------------------------------------------------- */

export interface RawSharedPokemon {
  v: typeof POKEMON_VERSION;
  exclude?: boolean;
  comment?: string;
  newlinesBefore?: number;
  newlinesAfterIfLast?: number;
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
  function from(raw: RawPokemon | V0_RawPokemon) {
    return "species" in raw ? BUILTIN_POKEMONS.from(raw) : CUSTOM_POKEMONS.from(raw);
  }
  return { from };
})();

/* -------------------------------------------------------------------------- */
/*                               Builtin Pokemon                              */
/* -------------------------------------------------------------------------- */

export type BuiltinPokemon = InstanceType<typeof BuiltinPokemon>;

export const BuiltinPokemon = createModel((raw: RawBuiltinPokemon) => {
  const cmpTypes = (typeKeys: string[]) => typeKeys.sort().join();

  const species = signal(SPECIES.of(raw.species));
  const key = computed(() => species.value.key);
  const name = computed(() => species.value.name);

  const typeKeys = signal(raw.types ?? species.value.typeKeys);
  const typeChanged = computed(() => cmpTypes(typeKeys.value) !== cmpTypes(species.value.typeKeys));
  const types = computed(() => typeKeys.value.map(TYPES.of));

  const alt = computed(() => {
    if (!typeChanged.value || species.value.alts.length === 0) {
      return;
    }

    const own = cmpTypes(typeKeys.value);
    return species.value.alts.find((alt) => cmpTypes(alt.typeKeys) === own);
  });

  const exclude = signal(raw.exclude);

  return {
    species: readonly(species),
    key,
    name,
    typeKeys: readonly(typeKeys),
    typeChanged,
    types,
    alt,
    exclude,
    isBuiltin(): true {
      return true;
    },
    isCustom(): false {
      return false;
    },
    setTypeKeys(newTypeKeys: string[] | undefined) {
      typeKeys.value = newTypeKeys ?? species.value.typeKeys;
    },
    setTypeKeyAt(index: number, typeKey: string | undefined) {
      setTypeKeyAt(typeKeys, index, typeKey);
    },
    toRaw(): RawBuiltinPokemon {
      return {
        ...raw,
        species: species.value.key,
        types: typeChanged.value ? typeKeys.value : undefined,
        exclude: exclude.value,
      };
    },
    toJSON(): unknown {
      return this.toRaw();
    },
  };
});

export const BUILTIN_POKEMONS = (() => {
  function of(key: string) {
    return new BuiltinPokemon({ v: POKEMON_VERSION, species: key });
  }

  function from(raw: RawBuiltinPokemon | V0_RawBuiltinPokemon) {
    return new BuiltinPokemon(upgradeRawBuiltinPokemon(raw));
  }

  return { of, from };
})();

/* -------------------------------------------------------------------------- */
/*                               Custom Pokemon                               */
/* -------------------------------------------------------------------------- */

export type CustomPokemon = InstanceType<typeof CustomPokemon>;

export const CustomPokemon = createModel((raw: RawCustomPokemon) => {
  const key = signal(raw.key);
  const name = signal(raw.name);

  const typeKeys = signal(raw.types);
  const types = computed(() => typeKeys.value.map(TYPES.of));

  const species = signal(undefined);
  const alt = signal(undefined);

  const exclude = signal(raw.exclude);

  return {
    species,
    key,
    name,
    typeKeys,
    types,
    alt,
    exclude,
    isBuiltin(): false {
      return false;
    },
    isCustom(): true {
      return true;
    },
    setTypeKeys(newTypeKeys: string[]) {
      typeKeys.value = newTypeKeys;
    },
    setTypeKeyAt(index: number, typeKey: string | undefined) {
      setTypeKeyAt(typeKeys, index, typeKey);
    },
    toRaw(): RawCustomPokemon {
      return {
        ...raw,
        key: key.value,
        name: name.value,
        types: typeKeys.value,
        exclude: exclude.value,
      };
    },
    toJSON(): unknown {
      return this.toRaw();
    },
  };
});

export const CUSTOM_POKEMONS = (() => {
  function of(key: string, name: string, typeKeys: string[]) {
    return new CustomPokemon({ v: POKEMON_VERSION, key, name, types: typeKeys });
  }

  function from(raw: RawCustomPokemon | V0_RawCustomPokemon) {
    return new CustomPokemon(upgradeRawCustomPokemon(raw));
  }

  return { of, from };
})();

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function setTypeKeyAt(signal: Signal<string[]>, index: number, typeKey: string | undefined) {
  const newValue = [...signal.value];
  if (typeKey) {
    newValue[index] = typeKey;
  } else {
    newValue.splice(index, 1);
  }
  signal.value = newValue;
}
