import { computed, createModel, signal } from "@preact/signals";
import { Set as ISet } from "immutable";
import { readonly } from "../utils/signal";
import { REGIONS, type RegionKey } from "./region";

export type RegionSet = InstanceType<typeof RegionSet>;

export const RegionSet = createModel(($keys: RegionKey[]) => {
  const keys = signal(ISet($keys));
  const all = computed(() => keys.value.toArray().map(REGIONS.of));

  return {
    keys: readonly(keys),
    all,
    add(key: RegionKey) {
      keys.value = keys.value.add(key);
    },
    delete(key: RegionKey) {
      keys.value = keys.value.delete(key);
    },
    toJSON(): unknown {
      return keys.value.toArray();
    },
  };
});
