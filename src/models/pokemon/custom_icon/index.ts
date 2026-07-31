import { batch, createResource, createRoot, onMount } from "solid-js";
import { DEBUG } from "../../../debug";
import { assert } from "../../../utils/assert";
import { blobToDataUrl } from "../../../utils/fs/web";
import type { RawJSONExportCustomIcons } from "../../export";
import { projects } from "../../project/list";
import {
  addBulkCustomIconsDbEntries,
  addCustomIconsDbEntry,
  deleteBulkCustomIconDbEntries,
  deleteBulkCustomIconDbEntriesWherePokemonIdNot,
  getCustomIconDbEntries,
  type CustomIconsDbEntry,
} from "../../util/database";
import { pokemons } from "../list";
import { customIconsMetadata } from "./metadata";

export type CustomIconResult =
  { type: "custom"; dataUrl: string } | { type: "loading" } | undefined;

export const customIcons = createRoot(() => {
  const [dataUrls, { mutate: mutateDataUrls }] = createResource(
    () => projects.activeId,
    () => getIconDataUrls(projects.activeId),
  );

  onMount(() => {
    function flushCustomIcons() {
      const deleteCounts = { metadata: 0, dataUrls: 0, database: 0 };
      const concreteIds = new Set<string>();

      for (const pokemon of pokemons.all) {
        if (customIconsMetadata.pokemonIds.has(pokemon.id)) {
          concreteIds.add(pokemon.id);
        }
      }

      batch(() => {
        for (const expectedId of customIconsMetadata.pokemonIds) {
          if (!concreteIds.has(expectedId)) {
            customIconsMetadata.pokemonIds.delete(expectedId);
            deleteCounts.metadata++;
          }
        }
        mutateDataUrls((dataUrls) => {
          if (!dataUrls) return;

          const entries = Object.entries(dataUrls);
          const entriesFiltered = entries.filter(([k]) => concreteIds.has(k));

          deleteCounts.dataUrls += entries.length - entriesFiltered.length;
          return Object.fromEntries(entriesFiltered);
        });
        deleteBulkCustomIconDbEntriesWherePokemonIdNot(projects.activeId, concreteIds, (count) => {
          deleteCounts.database = count;
        });
      });

      if (deleteCounts.metadata > 0 || deleteCounts.dataUrls > 0 || deleteCounts.database > 0) {
        // eslint-disable-next-line no-console
        console.log("Flushed custom icons", deleteCounts);
      }
    }

    setInterval(flushCustomIcons, 10 * 60 * 1000);

    if (DEBUG) {
      // @ts-expect-error Just so we can call it in testing.
      window.flushCustomIcons = flushCustomIcons;
    }
  });

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
      addCustomIconsDbEntry({
        pokemonId,
        projectId: projects.activeId,
        blob,
      });
    },

    deleteProject(projectId: string) {
      assert(projectId !== projects.activeId, "Can't delete custom icons for the active project.");
      // We don't need to update state because we know this isn't the active project.
      deleteBulkCustomIconDbEntries(projectId);
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
        if (entries.length > 0) {
          addBulkCustomIconsDbEntries(projects.activeId, entries);
        }
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
