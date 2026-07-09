import { computed, createModel, effect, signal } from "@preact/signals";
import { Set as ISet } from "immutable";
import { Region, REGIONS, type RegionKey } from ".";
import { readonly } from "../../utils/signal";
import { stored } from "../../utils/storage";

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
    set(newKeys: RegionKey[]) {
      keys.value = ISet(newKeys);
    },
    delete(key: RegionKey) {
      keys.value = keys.value.delete(key);
    },
    toRaw() {
      return keys.value.toArray();
    },
  };
});

export const REGION_SETS = (() => {
  function initial() {
    return new RegionSet(store.load() ?? REGIONS.recommendedKeys);
  }
  return { initial };
})();
