import * as v from "valibot";
import { PokedexModeKey } from "../../pokedex/mode";
import { V2_RawPokemonList } from "../../pokemon/versioned/list/v2";
import { RegionKey } from "../../region";
import { StrictnessKey } from "../../strictness";
import { RawCustomTypeColors } from "../../type/custom_colors";
import { RawExcludedTypesSet } from "../../type/excluded";

export const V2_RawJSONExportCustomIcons = v.object({
  dataUrls: v.record(v.string(), v.string()),
});

export const V2_RawJSONExport = v.object({
  v: v.literal(2),
  projectName: v.optional(v.string()),
  pokemons: V2_RawPokemonList,
  regions: v.array(RegionKey),
  strictness: StrictnessKey,
  pokedexMode: PokedexModeKey,
  customIcons: V2_RawJSONExportCustomIcons,
  excludedTypes: RawExcludedTypesSet,
  customTypeColors: v.optional(RawCustomTypeColors),
});
