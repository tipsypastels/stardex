import * as v from "valibot";
import type { RawProject } from ".";
import { V0_PokedexModeKey, V0_upgradePokedexModeKey } from "../pokedex/mode/versioned";
import { CUSTOM_ICONS_METADATA_VERSION } from "../pokemon/custom_icon";
import { V0_RawPokemonList, V0_upgradeRawPokemonList } from "../pokemon/versioned";
import { RegionKey } from "../region";
import { StrictnessKey } from "../strictness";
import { EXCLUDED_TYPES_VERSION } from "../type/excluded";
import { RawProjectList } from "./list";

export const PROJECT_VERSION = 1;
export const PROJECT_LIST_VERSION = 1;

/**
 * Project V0:
 *  - No explicit version.
 *  - Pokemons is called pokemon.
 *  - Dormant models is called modelState.
 */

// Note: Same shape as V0_RawExport, but the upgraded
// versions are different.
export const V0_RawProjectModels = v.object({
  pokemon: V0_RawPokemonList,
  regions: v.array(RegionKey),
  strictness: StrictnessKey,
  pokedexFormat: V0_PokedexModeKey,
});

export const V0_RawProject = v.object({
  id: v.string(),
  name: v.string(),
  active: v.boolean(),
  modelState: v.optional(V0_RawProjectModels),
});

export function V0_upgradeRawProject(raw: v.InferOutput<typeof V0_RawProject>): RawProject {
  return {
    v: PROJECT_VERSION,
    id: raw.id,
    name: raw.name,
    dormantModels: raw.modelState
      ? {
          pokemons: V0_upgradeRawPokemonList(raw.modelState.pokemon),
          regions: raw.modelState.regions,
          strictness: raw.modelState.strictness,
          pokedexMode: V0_upgradePokedexModeKey(raw.modelState.pokedexFormat),
          customIconsMetadata: { v: CUSTOM_ICONS_METADATA_VERSION, pokemonIds: [] },
          excludedTypes: { v: EXCLUDED_TYPES_VERSION, all: [] },
        }
      : undefined,
  };
}

export const V0_RawProjectList = v.array(V0_RawProject);

export function V0_upgradeRawProjectList(
  raws: v.InferOutput<typeof V0_RawProjectList>,
): RawProjectList {
  const activeId = raws.find((raw) => raw.active)!.id;
  return { v: PROJECT_LIST_VERSION, all: raws.map(V0_upgradeRawProject), activeId };
}
