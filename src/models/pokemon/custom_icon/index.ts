import { createModel, effect, signal } from "@preact/signals";
import { Map as IMap } from "immutable";
import {
  addBulkCustomIconsDbEntries,
  addCustomIconsDbEntry,
  deleteCustomIconsDbEntry,
  getCustomIconDbEntries,
} from "../../../state/database";
import { blobToDataUrl } from "../../../utils/file";
import { readonly } from "../../../utils/signal";
import type { PokedexMode } from "../../pokedex/mode";
import type { ProjectList } from "../../project/list";
import type { RawSavedCustomIcons } from "../../save";
import { CUSTOM_ICONS_METADATA_VERSION } from "../../versioned";
import type { CustomIconsMetadata } from "./metadata";

export interface CustomIconLoadedEntry {
  dataUrl: string;
}

export type CustomIcons = InstanceType<typeof CustomIcons>;

export const CustomIcons = createModel(
  (metadata: CustomIconsMetadata, projects: ProjectList, mode: PokedexMode) => {
    const loadedEntries = signal(IMap<string, CustomIconLoadedEntry>());

    effect(() => {
      metadata.changed.value;

      const projectId = projects.active.value.id.value;
      const keysCount = metadata.pokemonKeys.value.size;
      const modeKey = mode.key.value;

      if (keysCount > 0 && modeKey === "icons") {
        getCustomIconDbEntries(projectId, (entries) => {
          if (entries.length === 0) {
            loadedEntries.value = IMap();
            return;
          }

          const newEntries = new Map<string, CustomIconLoadedEntry>();

          for (const entry of entries) {
            blobToDataUrl(entry.blob, (dataUrl) => {
              newEntries.set(entry.pokemonKey, { dataUrl });
              if (newEntries.size === entries.length) {
                loadedEntries.value = IMap(newEntries);
              }
            });
          }
        });
      } else if (keysCount === 0) {
        loadedEntries.value = IMap();
      }
    });

    return {
      loadedEntries: readonly(loadedEntries),
      metadata,
      upload(pokemonKey: string, blob: Blob) {
        addCustomIconsDbEntry({ pokemonKey, blob, projectId: projects.active.value.id.value }, () =>
          metadata.addPokemonKey(pokemonKey),
        );
      },
      delete(pokemonKey: string) {
        deleteCustomIconsDbEntry({ pokemonKey, projectId: projects.active.value.id.value }, () =>
          metadata.deletePokemonKey(pokemonKey),
        );
      },
      toRawSaved(): RawSavedCustomIcons {
        return { all: loadedEntries.value.toJS() };
      },
      setFromRawSaved(raw: RawSavedCustomIcons) {
        Promise.all(
          Object.entries(raw.all).map(async ([pokemonKey, { dataUrl }]) => {
            const blob = await fetch(dataUrl).then((res) => res.blob());
            return { pokemonKey, blob };
          }),
        ).then((entries) => {
          addBulkCustomIconsDbEntries(projects.active.value.id.value, entries, () => {
            metadata.setFromRaw({
              v: CUSTOM_ICONS_METADATA_VERSION,
              pokemonKeys: entries.map((e) => e.pokemonKey),
            });
          });
        });
      },
    };
  },
);
