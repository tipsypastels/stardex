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
      const idsCount = metadata.pokemonIds.value.size;
      const modeKey = mode.key.value;

      if (idsCount > 0 && modeKey === "icons") {
        getCustomIconDbEntries(projectId, (entries) => {
          if (entries.length === 0) {
            loadedEntries.value = IMap();
            return;
          }

          const newEntries = new Map<string, CustomIconLoadedEntry>();

          for (const entry of entries) {
            blobToDataUrl(entry.blob, (dataUrl) => {
              newEntries.set(entry.pokemonId, { dataUrl });
              if (newEntries.size === entries.length) {
                loadedEntries.value = IMap(newEntries);
              }
            });
          }
        });
      } else if (idsCount === 0) {
        loadedEntries.value = IMap();
      }
    });

    return {
      loadedEntries: readonly(loadedEntries),
      metadata,
      upload(pokemonId: string, blob: Blob) {
        addCustomIconsDbEntry({ pokemonId, blob, projectId: projects.active.value.id.value }, () =>
          metadata.addPokemonId(pokemonId),
        );
      },
      delete(pokemonId: string) {
        deleteCustomIconsDbEntry({ pokemonId, projectId: projects.active.value.id.value }, () =>
          metadata.deletePokemonId(pokemonId),
        );
      },
      toRawSaved(): RawSavedCustomIcons {
        return { all: loadedEntries.value.toJS() };
      },
      setFromRawSaved(raw: RawSavedCustomIcons) {
        Promise.all(
          Object.entries(raw.all).map(async ([pokemonId, { dataUrl }]) => {
            const blob = await fetch(dataUrl).then((res) => res.blob());
            return { pokemonId, blob };
          }),
        ).then((entries) => {
          addBulkCustomIconsDbEntries(projects.active.value.id.value, entries, () => {
            metadata.setFromRaw({
              v: CUSTOM_ICONS_METADATA_VERSION,
              pokemonIds: entries.map((e) => e.pokemonId),
            });
          });
        });
      },
    };
  },
);
