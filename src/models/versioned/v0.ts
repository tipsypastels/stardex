import { POKEMON_VERSION } from ".";
import type { RawBuiltinPokemon, RawCustomPokemon } from "../pokemon";

/* -------------------------------------------------------------------------- */
/*                                   Pokemon                                  */
/* -------------------------------------------------------------------------- */

/**
 * Pokemon V0:
 *  - No explicit version.
 *  - Species is an object.
 *  - Types is called type.
 */

export interface V0_RawSharedPokemon {
  exclude?: boolean;
  comment?: string;
  newlinesBefore?: number;
  newlinesAfterIfLast?: number;
}

export interface V0_RawBuiltinPokemon extends V0_RawSharedPokemon {
  species: { key: string };
  type?: string[];
}

export interface V0_RawCustomPokemon extends V0_RawSharedPokemon {
  key: string;
  name: string;
  type: string[];
}

export type V0_RawPokemon = V0_RawBuiltinPokemon | V0_RawCustomPokemon;

export function V0_upgradeRawBuiltinPokemon(raw: V0_RawBuiltinPokemon): RawBuiltinPokemon {
  const { species, type, ...rest } = raw;
  return {
    v: POKEMON_VERSION,
    species: species.key,
    types: type,
    ...rest,
  };
}

export function V0_upgradeRawCustomPokemon(raw: V0_RawCustomPokemon): RawCustomPokemon {
  const { type, ...rest } = raw;
  return { v: POKEMON_VERSION, types: type, ...rest };
}
