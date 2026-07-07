import { computed, createModel, Signal, signal } from "@preact/signals";
import { readonly } from "../utils/signal";
import { SPECIES } from "./species";
import { TYPES } from "./type";
import type { POKEMON_VERSION } from "./versioned";

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
    setTypeKeys(newTypeKeys: string[] | undefined) {
      typeKeys.value = newTypeKeys ?? species.value.typeKeys;
    },
    setTypeKeyAt(index: number, typeKey: string | undefined) {
      setTypeKeyAt(typeKeys, index, typeKey);
    },
    isBuiltin(): this is BuiltinPokemon {
      return true;
    },
    isCustom(): this is CustomPokemon {
      return false;
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
    setTypeKeys(newTypeKeys: string[]) {
      typeKeys.value = newTypeKeys;
    },
    setTypeKeyAt(index: number, typeKey: string | undefined) {
      setTypeKeyAt(typeKeys, index, typeKey);
    },
    isBuiltin(): this is BuiltinPokemon {
      return false;
    },
    isCustom(): this is CustomPokemon {
      return true;
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
