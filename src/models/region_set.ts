import { computed, createModel, effect, signal } from "@preact/signals";
import { Set as ISet } from "immutable";
import { readonly } from "../utils/signal";
import { stored } from "../utils/storage";
import { Region, REGIONS, type RegionKey } from "./region";

const store = stored<RegionKey[], ISet<RegionKey>>("stardex_regions");

export type RegionSet = InstanceType<typeof RegionSet>;

export const RegionSet = createModel(($keys: RegionKey[]) => {
  const keys = signal(ISet($keys));
  const all = computed(() => keys.value.toArray().map(REGIONS.of));
  const size = computed(() => keys.value.size);

  const isAll = computed(() => keys.value.size === REGIONS.allKeys.length);
  const isRecommended = computed(
    () => keys.value.size === REGIONS.recommendedKeys.length && !keys.value.has("kanto"),
  );

  effect(() => {
    store.dump(keys.value);
  });

  return {
    keys: readonly(keys),
    all,
    size,
    isAll,
    isRecommended,
    has(region: Region) {
      return this.hasKey(region.key);
    },
    hasKey(key: RegionKey) {
      return keys.value.has(key);
    },
    add(key: RegionKey) {
      keys.value = keys.value.add(key);
    },
    setAll() {
      keys.value = ISet(REGIONS.allKeys);
    },
    setRecommended() {
      keys.value = ISet(REGIONS.recommendedKeys);
    },
    setNone() {
      keys.value = ISet();
    },
    delete(key: RegionKey) {
      keys.value = keys.value.delete(key);
    },
  };
});

export const REGION_SETS = (() => {
  function initial() {
    return new RegionSet(store.load() ?? REGIONS.recommendedKeys);
  }
  return { initial };
})();
