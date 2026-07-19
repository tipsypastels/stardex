import { ReactiveSet } from "@solid-primitives/set";
import { batch, createEffect, createResource, createRoot } from "solid-js";
import * as v from "valibot";
import { blobToDataUrl } from "../../utils/file";
import { stored } from "../../utils/storage";
import {
  addCustomIconsDbEntry,
  deleteBulkCustomIconDbEntries,
  deleteCustomIconsDbEntry,
  getCustomIconDbEntries,
  type CustomIconsDbEntry,
} from "../database";
import { projects } from "../project/list";
import { catchValidationError } from "../ui/error/validation";

export const CUSTOM_ICONS_METADATA_VERSION = 1;

export type RawCustomIconsMetadata = v.InferOutput<typeof RawCustomIconsMetadata>;
export const RawCustomIconsMetadata = v.object({
  v: v.literal(CUSTOM_ICONS_METADATA_VERSION),
  pokemonIds: v.array(v.string()),
});

export type CustomIconResult =
  { type: "custom"; dataUrl: string } | { type: "loading" } | undefined;

export const customIcons = createRoot(() => {
  const store = stored("stardex_custom_icons_metadata");
  const pokemonIds = new ReactiveSet<string>();

  const [dataUrls, { mutate: mutateDataUrls }] = createResource(
    () => projects.activeId,
    () => getIconDataUrls(projects.activeId),
  );

  const caught = catchValidationError(() => {
    const raw = store.load();
    if (!raw) return;
    for (const pokemonId of v.parse(RawCustomIconsMetadata, raw).pokemonIds) {
      pokemonIds.add(pokemonId);
    }
  });

  if (!caught) {
    createEffect(() => {
      store.dump({
        v: CUSTOM_ICONS_METADATA_VERSION,
        pokemonIds: [...pokemonIds],
      } satisfies RawCustomIconsMetadata);
    });
  }

  return {
    pokemonIds: pokemonIds as ReadonlySet<string>,

    get(pokemonId: string): CustomIconResult {
      if (!pokemonIds.has(pokemonId)) {
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
          pokemonIds.add(pokemonId);
          mutateDataUrls((dataUrls) => ({ ...dataUrls, [pokemonId]: dataUrl }));
        });
      });

      addCustomIconsDbEntry({ pokemonId, projectId: projects.activeId, blob });
    },

    delete(pokemonId: string) {
      batch(() => {
        pokemonIds.delete(pokemonId);
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
        pokemonIds.clear();
        mutateDataUrls(() => ({}));
      });

      deleteBulkCustomIconDbEntries(projects.activeId);
    },

    setFromRawMetadata(raw: RawCustomIconsMetadata) {
      pokemonIds.clear();
      for (const pokemonId of raw.pokemonIds) {
        pokemonIds.add(pokemonId);
      }
    },

    toRawMetadata(): RawCustomIconsMetadata {
      return {
        v: CUSTOM_ICONS_METADATA_VERSION,
        pokemonIds: [...pokemonIds],
      };
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
