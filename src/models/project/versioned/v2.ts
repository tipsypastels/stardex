import * as v from "valibot";
import { PokedexModeKey } from "../../pokedex/mode";
import { RawCustomIconsMetadata } from "../../pokemon/custom_icon/metadata";
import { V2_RawPokemonList } from "../../pokemon/versioned/list/v2";
import { RegionKey } from "../../region";
import { StrictnessKey } from "../../strictness";
import { RawCustomTypeColors } from "../../type/custom_colors";
import { RawExcludedTypesSet } from "../../type/excluded";

export const V2_RawProjectModels = v.object({
  pokemons: V2_RawPokemonList,
  regions: v.array(RegionKey),
  strictness: StrictnessKey,
  pokedexMode: PokedexModeKey,
  customIconsMetadata: RawCustomIconsMetadata,
  excludedTypes: RawExcludedTypesSet,
  customTypeColors: v.optional(RawCustomTypeColors),
});

export const V2_RawProject = v.object({
  v: v.literal(2),
  id: v.string(),
  name: v.string(),
  dormantModels: v.optional(V2_RawProjectModels),
});

export const V2_RawProjectList = v.object({
  v: v.literal(2),
  all: v.array(V2_RawProject),
  activeId: v.string(),
});
