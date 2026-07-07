import { computed, createModel, effect, signal } from "@preact/signals";
import { Set as ISet } from "immutable";
import { readonly } from "../utils/signal";
import { stored } from "../utils/storage";
import { REGIONS, type RegionKey } from "./region";

const store = stored<RegionKey[], ISet<RegionKey>>("stardex_regions");

export type RegionSet = InstanceType<typeof RegionSet>;

export const RegionSet = createModel(($keys: RegionKey[]) => {
  const keys = signal(ISet($keys));
  const all = computed(() => keys.value.toArray().map(REGIONS.of));

  effect(() => {
    store.dump(keys.value);
  });

  return {
    keys: readonly(keys),
    all,
    add(key: RegionKey) {
      keys.value = keys.value.add(key);
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
