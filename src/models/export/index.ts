import * as v from "valibot";
import { PokedexModeKey } from "../pokedex/mode";
import { RawPokemonList } from "../pokemon/list";
import { RegionKey } from "../region";
import { StrictnessKey } from "../strictness";
import { RawExcludedTypesSet } from "../type/excluded";

export const JSON_EXPORT_VERSION = 1;

export const RawJSONExportCustomIcons = v.object({
  dataUrls: v.record(v.string(), v.string()),
});

export const RawJSONExport = v.object({
  v: v.literal(JSON_EXPORT_VERSION),
  projectName: v.optional(v.string()),
  pokemons: RawPokemonList,
  regions: v.array(RegionKey),
  strictness: StrictnessKey,
  pokedexMode: PokedexModeKey,
  customIcons: RawJSONExportCustomIcons,
  excludedTypes: RawExcludedTypesSet,
});

export type RawJSONExportCustomIcons = v.InferOutput<typeof RawJSONExportCustomIcons>;
export type RawJSONExport = v.InferOutput<typeof RawJSONExport>;
