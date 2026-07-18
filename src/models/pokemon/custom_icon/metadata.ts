import { ReactiveSet } from "@solid-primitives/set";
import { createRoot } from "solid-js";
import * as v from "valibot";
import { stored } from "../../../utils/storage";

export const CUSTOM_ICONS_METADATA_VERSION = 1;

export type RawCustomIconsMetadata = v.InferOutput<typeof RawCustomIconsMetadata>;
export const RawCustomIconsMetadata = v.object({
  v: v.literal(CUSTOM_ICONS_METADATA_VERSION),
  pokemonIds: v.array(v.string()),
});

export const customIconsMetadata = createRoot(() => {
  const store = stored("stardex_custom_icons_metadata");
  const raw = v.parse(
    RawCustomIconsMetadata,
    store.load() ?? { v: CUSTOM_ICONS_METADATA_VERSION, pokemonIds: [] },
  );

  const pokemonIds = new ReactiveSet(raw.pokemonIds);

  return {
    get pokemonIds() {
      return pokemonIds;
    },

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

// import { createModel, effect, signal } from "@preact/signals";
// import { Set as ISet } from "immutable";
// import { readonly } from "../../../utils/signal";
// import { stored } from "../../../utils/storage";
// import { CUSTOM_ICONS_METADATA_VERSION } from "../../versioned";

// const store = stored<RawCustomIconsMetadata, Dumped>("stardex_custom_icons_metadata");

// export interface RawCustomIconsMetadata {
//   v: typeof CUSTOM_ICONS_METADATA_VERSION;
//   pokemonIds: string[];
// }

// interface Dumped {
//   v: typeof CUSTOM_ICONS_METADATA_VERSION;
//   pokemonIds: ISet<string>;
// }

// export type CustomIconsMetadata = InstanceType<typeof CustomIconsMetadata>;

// export const CustomIconsMetadata = createModel(($raw: RawCustomIconsMetadata) => {
//   const pokemonIds = signal(ISet($raw.pokemonIds));
//   const changed = signal(0);

//   effect(() => {
//     store.dump({
//       v: CUSTOM_ICONS_METADATA_VERSION,
//       pokemonIds: pokemonIds.value,
//     });
//   });

//   return {
//     pokemonIds: readonly(pokemonIds),
//     changed: readonly(changed),
//     addPokemonId(pokemonId: string) {
//       pokemonIds.value = pokemonIds.value.add(pokemonId);
//       changed.value++;
//     },
//     deletePokemonId(pokemonId: string) {
//       pokemonIds.value = pokemonIds.value.delete(pokemonId);
//       changed.value++;
//     },
//     setFromRaw(raw: RawCustomIconsMetadata) {
//       pokemonIds.value = ISet(raw.pokemonIds);
//       changed.value++;
//     },
//     toRaw(): RawCustomIconsMetadata {
//       return {
//         v: CUSTOM_ICONS_METADATA_VERSION,
//         pokemonIds: pokemonIds.value.toArray(),
//       };
//     },
//     toJSON(): unknown {
//       return this.toRaw();
//     },
//   };
// });

// export const CUSTOM_ICONS_METADATAS = {
//   initial() {
//     return new CustomIconsMetadata(
//       store.load() ?? { v: CUSTOM_ICONS_METADATA_VERSION, pokemonIds: [] },
//     );
//   },
// };
