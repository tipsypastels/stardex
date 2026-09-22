import * as v from "valibot";
import { makeId } from "../../utils/id";
import { TYPES, type Type } from "../type";
import { SPECIES, type Species, type SpeciesAlt } from "./species";
import { V0_RawPokemon, V0_upgradeRawPokemon } from "./versioned/v0";
import { V1_RawBuiltinPokemon, V1_RawCustomPokemon, V1_RawPokemon } from "./versioned/v1";

/* -------------------------------------------------------------------------- */
/*                                     Raw                                    */
/* -------------------------------------------------------------------------- */

export const POKEMON_VERSION = 1;

export type RawBuiltinPokemon = v.InferOutput<typeof RawBuiltinPokemon>;
export type RawCustomPokemon = v.InferOutput<typeof RawCustomPokemon>;
export type RawPokemon = v.InferOutput<typeof RawPokemon>;
export {
  V1_RawBuiltinPokemon as RawBuiltinPokemon,
  V1_RawCustomPokemon as RawCustomPokemon,
  V1_RawPokemon as RawPokemon,
};

export const VAny_RawPokemon = v.union([
  V1_RawPokemon,
  v.pipe(V0_RawPokemon, v.transform(V0_upgradeRawPokemon)),
]);

/* -------------------------------------------------------------------------- */
/*                                   Shared                                   */
/* -------------------------------------------------------------------------- */

export type Pokemon = BuiltinPokemon | CustomPokemon;

export const POKEMONS = {
  make(raw: RawPokemon) {
    return "species" in raw ? BUILTIN_POKEMONS.make(raw) : CUSTOM_POKEMONS.make(raw);
  },
};

/* -------------------------------------------------------------------------- */
/*                                   Builtin                                  */
/* -------------------------------------------------------------------------- */

export interface BuiltinPokemon {
  readonly id: string;
  readonly name: string;
  readonly nameWithAltNameOrNoAltName: string;
  readonly species: Species;
  altKind?: string;
  customAltName?: string;
  readonly alt?: SpeciesAlt;
  readonly altNameOrNoAltName?: string;
  changedTypeKeys: string[] | undefined;
  readonly typeKeys: string[];
  readonly types: Type[];
  exclude: boolean | undefined;
  comment: string | undefined;
  isBuiltin(): this is BuiltinPokemon;
  isCustom(): this is CustomPokemon;
  toRaw(): RawBuiltinPokemon;
  toJSON(): unknown;
}

export const BUILTIN_POKEMONS = (() => {
  function of(species: Species) {
    return make({ v: POKEMON_VERSION, id: makeId(), species: species.key });
  }

  function make(raw: RawBuiltinPokemon): BuiltinPokemon {
    return {
      get id() {
        return raw.id;
      },
      get name() {
        return this.species.name;
      },
      get nameWithAltNameOrNoAltName() {
        const altName = this.altNameOrNoAltName;
        return altName ? `${this.name} (${altName})` : this.name;
      },
      get species() {
        return SPECIES.of(raw.species);
      },
      altKind: raw.alt,
      customAltName: raw.customAltName,
      get alt() {
        if (!this.altKind) return;
        return this.species.alts.find((alt) => alt.kind === this.altKind);
      },
      get altNameOrNoAltName() {
        return this.customAltName ?? this.alt?.name ?? this.species.noAltName;
      },
      changedTypeKeys: raw.types,
      get typeKeys() {
        return this.changedTypeKeys ?? this.alt?.typeKeys ?? this.species.typeKeys;
      },
      get types() {
        return this.typeKeys.map(TYPES.of);
      },
      exclude: raw.exclude,
      comment: raw.comment,
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
          alt: this.altKind,
          customAltName: this.customAltName,
          types: this.changedTypeKeys,
          exclude: this.exclude || undefined,
          comment: this.comment || undefined,
        };
      },
      toJSON(): unknown {
        return this.toRaw();
      },
    };
  }
  return { of, make };
})();

/* -------------------------------------------------------------------------- */
/*                                   Custom                                   */
/* -------------------------------------------------------------------------- */

export interface CustomPokemon {
  readonly id: string;
  name: string;
  readonly nameWithAltNameOrNoAltName: string;
  readonly species?: undefined;
  altName?: string;
  readonly altKind?: undefined;
  readonly alt?: undefined;
  readonly altNameOrNoAltName?: string;
  typeKeys: string[];
  readonly types: Type[];
  exclude: boolean | undefined;
  comment: string | undefined;
  isBuiltin(): this is BuiltinPokemon;
  isCustom(): this is CustomPokemon;
  toRaw(): RawCustomPokemon;
  toJSON(): unknown;
}

export const CUSTOM_POKEMONS = (() => {
  function of(name: string, typeKeys: string[]) {
    return make({ v: POKEMON_VERSION, id: makeId(), name, types: typeKeys });
  }

  function make(raw: RawCustomPokemon): CustomPokemon {
    return {
      get id() {
        return raw.id;
      },
      name: raw.name,
      get nameWithAltNameOrNoAltName() {
        return this.altName ? `${this.name} (${this.altName})` : this.name;
      },
      get species() {
        return undefined;
      },
      altName: raw.altName,
      get altKind(): undefined {
        return undefined;
      },
      get alt(): undefined {
        return undefined;
      },
      get altNameOrNoAltName() {
        return this.altName;
      },
      typeKeys: raw.types,
      get types() {
        return this.typeKeys.map(TYPES.of);
      },
      exclude: raw.exclude,
      comment: raw.comment,
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
          altName: this.altName,
          types: this.typeKeys,
          exclude: this.exclude || undefined,
          comment: this.comment || undefined,
        };
      },
      toJSON(): unknown {
        return this.toRaw();
      },
    };
  }
  return { of, make };
})();
