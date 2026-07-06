import { Regions, type RegionKey } from "$lib/models/region";
import { persistedWritable, reducible } from "$lib/utils/stores";

export const regions = reducible(
  persistedWritable({
    key: "stardex_regions",
    default: () => Regions.DEFAULT,
    load: (data) => Regions.from(data),
  }),
  (store) => ({
    set(keys: RegionKey[]) {
      store.set(Regions.from(keys));
    },
    add(key: RegionKey) {
      store.update(($regions) => $regions.add(key));
    },
    delete(key: RegionKey) {
      store.update(($regions) => $regions.delete(key));
    },
  }),
);
