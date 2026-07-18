import * as v from "valibot";
import { TYPES, type Type } from "../type";
import { SPECIES, type Species, type SpeciesAlt } from "./species";
import {
  POKEMON_VERSION,
  V0_RawBuiltinPokemon,
  V0_RawCustomPokemon,
  V0_RawPokemon,
  V0_upgradeRawBuiltinPokemon,
  V0_upgradeRawCustomPokemon,
  V0_upgradeRawPokemon,
} from "./versioned";

/* -------------------------------------------------------------------------- */
/*                                     Raw                                    */
/* -------------------------------------------------------------------------- */

export type RawBuiltinPokemon = v.InferOutput<typeof RawBuiltinPokemon>;
export type RawCustomPokemon = v.InferOutput<typeof RawCustomPokemon>;
export type RawPokemon = v.InferOutput<typeof RawPokemon>;

const RawSharedPokemon = v.object({
  v: v.literal(POKEMON_VERSION),
  id: v.string(),
  exclude: v.optional(v.boolean()),
});

export const RawBuiltinPokemon = v.object({
  ...RawSharedPokemon.entries,
  species: v.string(),
  types: v.optional(v.array(v.string())),
});

export const RawCustomPokemon = v.object({
  ...RawSharedPokemon.entries,
  name: v.string(),
  types: v.array(v.string()),
});

export const RawPokemon = v.union([RawBuiltinPokemon, RawCustomPokemon]);

export const VAny_RawBuiltinPokemon = v.union([
  RawBuiltinPokemon,
  v.pipe(V0_RawBuiltinPokemon, v.transform(V0_upgradeRawBuiltinPokemon)),
]);

export const VAny_RawCustomPokemon = v.union([
  RawCustomPokemon,
  v.pipe(V0_RawCustomPokemon, v.transform(V0_upgradeRawCustomPokemon)),
]);

export const VAny_RawPokemon = v.union([
  RawPokemon,
  v.pipe(V0_RawPokemon, v.transform(V0_upgradeRawPokemon)),
]);

/* -------------------------------------------------------------------------- */
/*                                   Shared                                   */
/* -------------------------------------------------------------------------- */

export type Pokemon = BuiltinPokemon | CustomPokemon;

export const POKEMONS = (() => {
  function make(raw: RawPokemon) {
    return "species" in raw ? BUILTIN_POKEMONS.make(raw) : CUSTOM_POKEMONS.make(raw);
  }
  function from(raw: unknown) {
    return make(v.parse(VAny_RawPokemon, raw));
  }
  return { make, from };
})();

/* -------------------------------------------------------------------------- */
/*                                   Builtin                                  */
/* -------------------------------------------------------------------------- */

export interface BuiltinPokemon {
  readonly id: string;
  readonly name: string;
  readonly species: Species;
  readonly alt?: SpeciesAlt;
  changedTypeKeys: string[] | undefined;
  readonly typeKeys: string[];
  readonly types: Type[];
  exclude: boolean | undefined;
  isBuiltin(): this is BuiltinPokemon;
  isCustom(): this is CustomPokemon;
  toRaw(): RawBuiltinPokemon;
  toJSON(): unknown;
}

export const BUILTIN_POKEMONS = (() => {
  function make(raw: RawBuiltinPokemon): BuiltinPokemon {
    return {
      get id() {
        return raw.id;
      },
      get name() {
        return this.species.name;
      },
      get species() {
        return SPECIES.of(raw.species);
      },
      get alt(): SpeciesAlt | undefined {
        // TODO
        return;
      },
      changedTypeKeys: raw.types,
      get typeKeys() {
        return this.changedTypeKeys ?? this.species.typeKeys;
      },
      get types() {
        return this.typeKeys.map(TYPES.of);
      },
      exclude: raw.exclude,
      isBuiltin(): this is BuiltinPokemon {
        return true;
      },
      isCustom(): this is CustomPokemon {
        return false;
      },
      toRaw(): RawBuiltinPokemon {
        return {
          v: POKEMON_VERSION,
          species: raw.species,
          id: raw.id,
          types: this.changedTypeKeys,
          exclude: this.exclude || undefined,
        };
      },
      toJSON(): unknown {
        return this.toRaw();
      },
    };
  }
  return { make };
})();

/* -------------------------------------------------------------------------- */
/*                                   Custom                                   */
/* -------------------------------------------------------------------------- */

export interface CustomPokemon {
  readonly id: string;
  name: string;
  readonly species?: undefined;
  readonly alt?: undefined;
  typeKeys: string[];
  readonly types: Type[];
  exclude: boolean | undefined;
  isBuiltin(): this is BuiltinPokemon;
  isCustom(): this is CustomPokemon;
  toRaw(): RawCustomPokemon;
  toJSON(): unknown;
}

export const CUSTOM_POKEMONS = (() => {
  function make(raw: RawCustomPokemon): CustomPokemon {
    return {
      get id() {
        return raw.id;
      },
      name: raw.name,
      get species() {
        return undefined;
      },
      get alt(): undefined {
        return undefined;
      },
      typeKeys: raw.types,
      get types() {
        return this.typeKeys.map(TYPES.of);
      },
      exclude: raw.exclude,
      isBuiltin(): this is BuiltinPokemon {
        return false;
      },
      isCustom(): this is CustomPokemon {
        return true;
      },
      toRaw(): RawCustomPokemon {
        return {
          v: POKEMON_VERSION,
          id: raw.id,
          name: this.name,
          types: this.typeKeys,
          exclude: this.exclude || undefined,
        };
      },
      toJSON(): unknown {
        return this.toRaw();
      },
    };
  }
  return { make };
})();
