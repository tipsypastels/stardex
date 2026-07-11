import { createModel, effect, signal } from "@preact/signals";
import { Map as IMap, type MapOf } from "immutable";
import { readonly } from "../../utils/signal";
import { stored } from "../../utils/storage";
import { CUSTOM_ICON_PACK_VERSION } from "../versioned";

const store = stored<RawCustomIconPack, DumpedPack>("stardex_custom_icon_pack");

export interface RawCustomIcon {
  url: string;
}

export interface RawCustomIconPack {
  v: typeof CUSTOM_ICON_PACK_VERSION;
  all: Record<string, RawCustomIcon>;
}

interface DumpedPack {
  v: typeof CUSTOM_ICON_PACK_VERSION;
  all: MapOf<Record<string, RawCustomIcon>>;
}

export type CustomIconPack = InstanceType<typeof CustomIconPack>;

export const CustomIconPack = createModel(($raw: RawCustomIconPack) => {
  const map = signal(IMap($raw.all));

  effect(() => {
    store.dump({ v: CUSTOM_ICON_PACK_VERSION, all: map.value });
  });

  return {
    map: readonly(map),
    set(key: string, url: string) {
      map.value = map.value.set(key, { url });
    },
    delete(key: string) {
      map.value = map.value.delete(key);
    },
    setFromRaw(raw: RawCustomIconPack) {
      map.value = IMap(raw.all);
    },
    toRaw(): RawCustomIconPack {
      return {
        v: CUSTOM_ICON_PACK_VERSION,
        all: map.value.toJS(),
      };
    },
    toJSON(): unknown {
      return this.toRaw();
    },
  };
});

export const CUSTOM_ICON_PACKS = (() => {
  function initial() {
    return new CustomIconPack(store.load() ?? { v: CUSTOM_ICON_PACK_VERSION, all: {} });
  }
  return { initial };
})();
