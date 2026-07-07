import type { RawBuiltinPokemon, RawCustomPokemon } from "../pokemon";
import type { RawActiveProject, RawInactiveProject } from "../project";
import {
  V0_upgradeRawActiveProject,
  V0_upgradeRawBuiltinPokemon,
  V0_upgradeRawCustomPokemon,
  V0_upgradeRawInactiveProject,
  type V0_RawActiveProject,
  type V0_RawBuiltinPokemon,
  type V0_RawCustomPokemon,
  type V0_RawInactiveProject,
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
