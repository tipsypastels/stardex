import { batch } from "solid-js";
import * as v from "valibot";
import { saveToFile } from "../../utils/fs/web";
import { pokedexMode } from "../pokedex/mode";
import { customIcons } from "../pokemon/custom_icon";
import { pokemons } from "../pokemon/list";
import { projects } from "../project/list";
import { regions } from "../region/set";
import { strictness } from "../strictness";
import { customTypeColors } from "../type/custom_colors";
import { excludedTypes } from "../type/excluded";
import { V0_RawJSONExport, V0_upgradeRawJSONExport } from "./versioned/v0";
import { V1_RawJSONExport, V1_upgradeRawJSONExport } from "./versioned/v1";
import { V2_RawJSONExport, V2_RawJSONExportCustomIcons } from "./versioned/v2";

export const JSON_EXPORT_VERSION = 2;

export type RawJSONExportCustomIcons = v.InferOutput<typeof RawJSONExportCustomIcons>;
export type RawJSONExport = v.InferOutput<typeof RawJSONExport>;
export {
  V2_RawJSONExport as RawJSONExport,
  V2_RawJSONExportCustomIcons as RawJSONExportCustomIcons,
};

// prettier-ignore
export const VAny_RawJSONExport = v.union([
  V2_RawJSONExport,
  v.pipe(V1_RawJSONExport, v.transform(V1_upgradeRawJSONExport)),
  v.pipe(V0_RawJSONExport, v.transform(V0_upgradeRawJSONExport), v.transform(V1_upgradeRawJSONExport)),
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

    if (raw.customTypeColors) {
      customTypeColors.setFromRaw(raw.customTypeColors);
    }
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
    customTypeColors: customTypeColors.toRaw(),
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
