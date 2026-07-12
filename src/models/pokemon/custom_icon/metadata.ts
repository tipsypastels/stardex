import { createModel, effect, signal } from "@preact/signals";
import { Set as ISet } from "immutable";
import { readonly } from "../../../utils/signal";
import { stored } from "../../../utils/storage";
import { CUSTOM_ICONS_METADATA_VERSION } from "../../versioned";

const store = stored<RawCustomIconsMetadata, Dumped>("stardex_custom_icons_metadata");

export interface RawCustomIconsMetadata {
  v: typeof CUSTOM_ICONS_METADATA_VERSION;
  pokemonKeys: string[];
}

interface Dumped {
  v: typeof CUSTOM_ICONS_METADATA_VERSION;
  pokemonKeys: ISet<string>;
}

export type CustomIconsMetadata = InstanceType<typeof CustomIconsMetadata>;

export const CustomIconsMetadata = createModel(($raw: RawCustomIconsMetadata) => {
  const pokemonKeys = signal(ISet($raw.pokemonKeys));

  effect(() => {
    store.dump({
      v: CUSTOM_ICONS_METADATA_VERSION,
      pokemonKeys: pokemonKeys.value,
    });
  });

  return {
    pokemonKeys: readonly(pokemonKeys),
    setFromRaw(raw: RawCustomIconsMetadata) {
      pokemonKeys.value = ISet(raw.pokemonKeys);
    },
    toRaw(): RawCustomIconsMetadata {
      return {
        v: CUSTOM_ICONS_METADATA_VERSION,
        pokemonKeys: pokemonKeys.value.toArray(),
      };
    },
    toJSON(): unknown {
      return this.toRaw();
    },
  };
});

export const CUSTOM_ICONS_METADATAS = {
  initial() {
    return new CustomIconsMetadata(
      store.load() ?? { v: CUSTOM_ICONS_METADATA_VERSION, pokemonKeys: [] },
    );
  },
};
