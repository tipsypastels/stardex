import { INITIAL_REGION_KEYS, type RegionKey } from "$lib/models/region";
import { createActions } from "./_actions";
import { createStorage } from "./_storage";
import { Set as ISet } from "immutable";

const storage = createStorage<RegionKey[]>("stardex_regions");
const initial = ISet(storage.initial ?? INITIAL_REGION_KEYS);

export const regions = createActions(initial, (store) => {
  return {
    set(keys: RegionKey[]) {
      store.update(() => ISet(keys));
    },

    enable(key: RegionKey) {
      store.update(($regions) => $regions.add(key));
    },

    disable(key: RegionKey) {
      store.update(($regions) => $regions.remove(key));
    },
  };
});

export const regionsPersister = storage.persister(regions);
