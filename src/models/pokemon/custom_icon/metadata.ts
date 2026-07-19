import { ReactiveSet } from "@solid-primitives/set";
import { createEffect, createRoot } from "solid-js";
import * as v from "valibot";
import { stored } from "../../../utils/storage";
import { catchValidationError } from "../../ui/error/validation";

export const CUSTOM_ICONS_METADATA_VERSION = 1;

export type RawCustomIconsMetadata = v.InferOutput<typeof RawCustomIconsMetadata>;
export const RawCustomIconsMetadata = v.object({
  v: v.literal(CUSTOM_ICONS_METADATA_VERSION),
  pokemonIds: v.array(v.string()),
});

export const customIconsMetadata = createRoot(() => {
  const store = stored("stardex_custom_icons_metadata");
  const pokemonIds = new ReactiveSet<string>();

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
    pokemonIds,

    setFromRaw(raw: RawCustomIconsMetadata) {
      pokemonIds.clear();
      for (const pokemonId of raw.pokemonIds) {
        pokemonIds.add(pokemonId);
      }
    },

    toRaw(): RawCustomIconsMetadata {
      return {
        v: CUSTOM_ICONS_METADATA_VERSION,
        pokemonIds: [...pokemonIds],
      };
    },

    toJSON(): unknown {
      return this.toRaw();
    },
  };
});
