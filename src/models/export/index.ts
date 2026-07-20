import * as v from "valibot";
import { saveToFile } from "../../utils/file";
import { pokedexMode, PokedexModeKey } from "../pokedex/mode";
import { customIcons } from "../pokemon/custom_icon";
import { pokemons, RawPokemonList } from "../pokemon/list";
import { projects } from "../project/list";
import { RegionKey } from "../region";
import { regions } from "../region/set";
import { strictness, StrictnessKey } from "../strictness";
import { excludedTypes, RawExcludedTypesSet } from "../type/excluded";

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

export function saveJSONExport() {
  const json: RawJSONExport = {
    v: JSON_EXPORT_VERSION,
    projectName: projects.active.name,
    pokemons: pokemons.toRaw(),
    regions: regions.toRaw(),
    strictness: strictness.key,
    pokedexMode: pokedexMode.key,
    excludedTypes: excludedTypes.toRaw(),
    customIcons: customIcons.toRawExport(),
  };
  saveToFile(`Stardex ${json.projectName}.json`, "json", JSON.stringify(json));
}

export function saveTextExport() {
  const text = pokemons.toSerializedText();
  const name = projects.active.name;
  saveToFile(`Stardex ${name}.txt`, "text", text);
}
