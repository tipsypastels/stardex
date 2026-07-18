import * as v from "valibot";
import type { RawActiveProject, RawInactiveProject, RawProject } from ".";
import { V0_PokedexModeKey, V0_upgradePokedexModeKey } from "../pokedex/mode/versioned";
import { CUSTOM_ICONS_METADATA_VERSION } from "../pokemon/custom_icon/metadata";
import { V0_RawPokemonList, V0_upgradeRawPokemonList } from "../pokemon/versioned";
import { RegionKey } from "../region";
import { StrictnessKey } from "../strictness";
import { EXCLUDED_TYPES_VERSION } from "../type/excluded";

export const PROJECT_VERSION = 1;

/**
 * Project V0:
 *  - No explicit version.
 *  - Pokemons is called pokemon.
 *  - Models is called modelState.
 */

// Note: Same shape as V0_RawExport, but the upgraded
// versions are different.
export const V0_RawProjectModels = v.object({
  pokemon: V0_RawPokemonList,
  regions: v.array(RegionKey),
  strictness: StrictnessKey,
  pokedexFormat: V0_PokedexModeKey,
});

export const V0_RawActiveProject = v.object({
  id: v.string(),
  name: v.string(),
  active: v.literal(true),
});

export const V0_RawInactiveProject = v.object({
  id: v.string(),
  name: v.string(),
  active: v.literal(false),
  modelState: V0_RawProjectModels,
});

export const V0_RawProject = v.union([V0_RawActiveProject, V0_RawInactiveProject]);

export function V0_upgradeRawActiveProject(
  raw: v.InferOutput<typeof V0_RawActiveProject>,
): RawActiveProject {
  return {
    v: PROJECT_VERSION,
    ...raw,
  };
}

export function V0_upgradeRawInactiveProject(
  raw: v.InferOutput<typeof V0_RawInactiveProject>,
): RawInactiveProject {
  const {
    modelState: { pokemon, pokedexFormat, ...models },
    ...rest
  } = raw;
  return {
    v: PROJECT_VERSION,
    models: {
      ...models,
      pokemons: V0_upgradeRawPokemonList(pokemon),
      pokedexMode: V0_upgradePokedexModeKey(pokedexFormat),
      customIconsMetadata: { v: CUSTOM_ICONS_METADATA_VERSION, pokemonIds: [] },
      excludedTypes: { v: EXCLUDED_TYPES_VERSION, all: [] },
    },
    ...rest,
  };
}

export function V0_upgradeRawProject(raw: v.InferOutput<typeof V0_RawProject>): RawProject {
  return raw.active ? V0_upgradeRawActiveProject(raw) : V0_upgradeRawInactiveProject(raw);
}
