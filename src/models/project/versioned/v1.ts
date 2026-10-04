import * as v from "valibot";
import { PokedexModeKey } from "../../pokedex/mode";
import { RawCustomIconsMetadata } from "../../pokemon/custom_icon/metadata";
import { V1_RawPokemonList, V1_upgradeRawPokemonList } from "../../pokemon/versioned/list/v1";
import { RegionKey } from "../../region";
import { StrictnessKey } from "../../strictness";
import { RawExcludedTypesSet } from "../../type/excluded";
import type { V2_RawProject, V2_RawProjectList } from "./v2";

/**
 * Project V1:
 * - Uses pokemons v1.
 */

export const V1_RawProjectModels = v.object({
  pokemons: V1_RawPokemonList,
  regions: v.array(RegionKey),
  strictness: StrictnessKey,
  pokedexMode: PokedexModeKey,
  customIconsMetadata: RawCustomIconsMetadata,
  excludedTypes: RawExcludedTypesSet,
});

export const V1_RawProject = v.object({
  v: v.literal(1),
  id: v.string(),
  name: v.string(),
  dormantModels: v.optional(V1_RawProjectModels),
});

export function V1_upgradeRawProject(
  raw: v.InferOutput<typeof V1_RawProject>,
): v.InferOutput<typeof V2_RawProject> {
  return {
    v: 2,
    id: raw.id,
    name: raw.name,
    dormantModels: raw.dormantModels
      ? { ...raw.dormantModels, pokemons: V1_upgradeRawPokemonList(raw.dormantModels.pokemons) }
      : undefined,
  };
}

export const V1_RawProjectList = v.object({
  v: v.literal(1),
  all: v.array(V1_RawProject),
  activeId: v.string(),
});

export function V1_upgradeRawProjectList(
  raw: v.InferOutput<typeof V1_RawProjectList>,
): v.InferOutput<typeof V2_RawProjectList> {
  return { v: 2, all: raw.all.map(V1_upgradeRawProject), activeId: raw.activeId };
}
