import type { RawBuiltinPokemon, RawCustomPokemon } from "../pokemon";
import {
  V0_upgradeRawBuiltinPokemon,
  V0_upgradeRawCustomPokemon,
  type V0_RawBuiltinPokemon,
  type V0_RawCustomPokemon,
} from "./v0";

export const POKEMON_VERSION = 1;
export const PROJECT_VERSION = 1;

/* -------------------------------------------------------------------------- */
/*                                   Pokemon                                  */
/* -------------------------------------------------------------------------- */

export function upgradeRawBuiltinPokemon(raw: RawBuiltinPokemon | V0_RawBuiltinPokemon) {
  return "v" in raw ? raw : V0_upgradeRawBuiltinPokemon(raw);
}

export function upgradeRawCustomPokemon(
  raw: RawCustomPokemon | V0_RawCustomPokemon,
): RawCustomPokemon {
  return "v" in raw ? raw : V0_upgradeRawCustomPokemon(raw);
}
