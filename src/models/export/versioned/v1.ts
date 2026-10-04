import * as v from "valibot";
import { PokedexModeKey } from "../../pokedex/mode";
import { V1_RawPokemonList, V1_upgradeRawPokemonList } from "../../pokemon/versioned/list/v1";
import { RegionKey } from "../../region";
import { StrictnessKey } from "../../strictness";
import { RawExcludedTypesSet } from "../../type/excluded";
import type { V2_RawJSONExport } from "./v2";

/**
 * Export V1:
 * - Uses pokemons v1.
 */

export const V1_RawJSONExportCustomIcons = v.object({
  dataUrls: v.record(v.string(), v.string()),
});

export const V1_RawJSONExport = v.object({
  v: v.literal(1),
  projectName: v.optional(v.string()),
  pokemons: V1_RawPokemonList,
  regions: v.array(RegionKey),
  strictness: StrictnessKey,
  pokedexMode: PokedexModeKey,
  customIcons: V1_RawJSONExportCustomIcons,
  excludedTypes: RawExcludedTypesSet,
  customTypeColors: v.optional(v.record(v.string(), v.string())),
});

export function V1_upgradeRawJSONExport(
  raw: v.InferOutput<typeof V1_RawJSONExport>,
): v.InferOutput<typeof V2_RawJSONExport> {
  return {
    ...raw,
    v: 2,
    pokemons: V1_upgradeRawPokemonList(raw.pokemons),
  };
}
