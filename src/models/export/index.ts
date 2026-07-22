import { batch } from "solid-js";
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
import { V0_RawJSONExport, V0_upgradeRawJSONExport } from "./versioned";

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

export const VAny_RawJSONExport = v.union([
  RawJSONExport,
  v.pipe(V0_RawJSONExport, v.transform(V0_upgradeRawJSONExport)),
]);

export function loadJSONExport(raw: RawJSONExport) {
  batch(() => {
    if (raw.projectName && projects.active.name.includes("Untitled")) {
      projects.setName(projects.activeId, raw.projectName);
    }

    pokemons.setFromRaw(raw.pokemons);
    regions.set(raw.regions);
    strictness.key = raw.strictness;
    pokedexMode.key = raw.pokedexMode;
    excludedTypes.setFromRaw(raw.excludedTypes);
    customIcons.setFromRawExport(raw.customIcons);
  });
}

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

export async function saveTextExport() {
  // This pulls in some of the text mode code that we try to keep out of the non-text bundle.
  // It's not the biggest deal (it doesn't load CM) but if they're in text mode where this would
  // actually be useful it should already be loaded.
  const { serializePokemonListToText } = await import("../pokemon/text/serialize");
  const text = serializePokemonListToText();
  const name = projects.active.name;
  saveToFile(`Stardex ${name}.txt`, "text", text);
}
