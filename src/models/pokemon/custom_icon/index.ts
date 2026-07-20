import { batch, createResource, createRoot } from "solid-js";
import { blobToDataUrl } from "../../../utils/file";
import {
  addBulkCustomIconsDbEntries,
  addCustomIconsDbEntry,
  deleteBulkCustomIconDbEntries,
  deleteCustomIconsDbEntry,
  getCustomIconDbEntries,
  type CustomIconsDbEntry,
} from "../../database";
import type { RawJSONExportCustomIcons } from "../../export";
import { projects } from "../../project/list";
import { customIconsMetadata } from "./metadata";

export type CustomIconResult =
  { type: "custom"; dataUrl: string } | { type: "loading" } | undefined;

export const customIcons = createRoot(() => {
  const [dataUrls, { mutate: mutateDataUrls }] = createResource(
    () => projects.activeId,
    () => getIconDataUrls(projects.activeId),
  );

  return {
    get pokemonIds() {
      return customIconsMetadata.pokemonIds;
    },

    get(pokemonId: string): CustomIconResult {
      if (!this.pokemonIds.has(pokemonId)) {
        return;
      }
      if (dataUrls.loading) {
        return { type: "loading" };
      }

      const urls = dataUrls();
      if (urls && pokemonId in urls) {
        return { type: "custom", dataUrl: urls[pokemonId] };
      }

      return { type: "loading" };
    },

    add(pokemonId: string, blob: Blob) {
      blobToDataUrl(blob, (dataUrl) => {
        batch(() => {
          this.pokemonIds.add(pokemonId);
          mutateDataUrls((dataUrls) => ({ ...dataUrls, [pokemonId]: dataUrl }));
        });
      });

      addCustomIconsDbEntry({ pokemonId, projectId: projects.activeId, blob });
    },

    delete(pokemonId: string) {
      batch(() => {
        this.pokemonIds.delete(pokemonId);
        mutateDataUrls((dataUrls) => {
          const newDataUrls = { ...dataUrls };
          delete newDataUrls[pokemonId];
          return newDataUrls;
        });
      });

      deleteCustomIconsDbEntry({ pokemonId, projectId: projects.activeId });
    },

    clear() {
      batch(() => {
        this.pokemonIds.clear();
        mutateDataUrls(() => ({}));
      });

      deleteBulkCustomIconDbEntries(projects.activeId);
    },

    setFromRawExport(raw: RawJSONExportCustomIcons) {
      const promises = Object.entries(raw.dataUrls).map(async ([pokemonId, dataUrl]) => {
        const blob = await fetch(dataUrl).then((res) => res.blob());
        return { pokemonId, blob };
      });

      Promise.all(promises).then((entries) => {
        batch(() => {
          this.pokemonIds.clear();

          const newDataUrls: Record<string, string> = {};

          for (const entry of entries) {
            this.pokemonIds.add(entry.pokemonId);
            newDataUrls[entry.pokemonId] = raw.dataUrls[entry.pokemonId];
          }

          mutateDataUrls(() => newDataUrls);
        });

        addBulkCustomIconsDbEntries(projects.activeId, entries);
      });
    },

    toRawExport(): RawJSONExportCustomIcons {
      return { dataUrls: dataUrls() || {} };
    },
  };
});

async function getIconDataUrls(projectId: string) {
  const rawEntries = await new Promise<CustomIconsDbEntry[]>((ok) =>
    getCustomIconDbEntries(projectId, ok),
  );

  const entries = rawEntries.map(async (entry) => {
    const dataUrl = await new Promise<string>((ok) => blobToDataUrl(entry.blob, ok));
    return [entry.pokemonId, dataUrl] as const;
  });

  return Object.fromEntries(await Promise.all(entries));
}
