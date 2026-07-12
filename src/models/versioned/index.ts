import type { RawBuiltinPokemon, RawCustomPokemon } from "../pokemon";
import type { RawPokemonList } from "../pokemon/list";
import type { RawActiveProject, RawInactiveProject } from "../project";
import {
  V0_upgradeRawActiveProject,
  V0_upgradeRawBuiltinPokemon,
  V0_upgradeRawCustomPokemon,
  V0_upgradeRawInactiveProject,
  V0_upgradeRawPokemonList,
  type V0_RawActiveProject,
  type V0_RawBuiltinPokemon,
  type V0_RawCustomPokemon,
  type V0_RawInactiveProject,
  type V0_RawPokemonList,
} from "./v0";

export const POKEMON_VERSION = 1;
export const POKEMON_LIST_VERSION = 1;
export const PROJECT_VERSION = 1;
export const CUSTOM_ICONS_METADATA_VERSION = 1;

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

/* -------------------------------------------------------------------------- */
/*                                Pokemon List                                */
/* -------------------------------------------------------------------------- */

export function upgradeRawPokemonList(raw: RawPokemonList | V0_RawPokemonList): RawPokemonList {
  return Array.isArray(raw) ? V0_upgradeRawPokemonList(raw) : raw;
}

/* -------------------------------------------------------------------------- */
/*                                   Project                                  */
/* -------------------------------------------------------------------------- */

export function upgradeRawActiveProject(
  raw: RawActiveProject | V0_RawActiveProject,
): RawActiveProject {
  return "v" in raw ? raw : V0_upgradeRawActiveProject(raw);
}

export function upgradeRawInactiveProject(
  raw: RawInactiveProject | V0_RawInactiveProject,
): RawInactiveProject {
  return "v" in raw ? raw : V0_upgradeRawInactiveProject(raw);
}
