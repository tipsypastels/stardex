import { resolveRegion, type RegionKey } from "$lib/models/region";
import { derived, type Readable, type Writable } from "svelte/store";
import { Set as ISet } from "immutable";
import { createRegionAllotment, type Allotment } from "$lib/metrics/allotment";

export class RegionsState implements Readable<ISet<RegionKey>> {
  #store: Writable<ISet<RegionKey>>;

  readonly allotment: Readable<Allotment>;

  constructor(store: Writable<ISet<RegionKey>>) {
    this.#store = store;
    this.allotment = derived(store, ($keys) =>
      createRegionAllotment([...$keys].map(resolveRegion)),
    );
  }

  get subscribe() {
    return this.#store.subscribe;
  }

  set(keys: RegionKey[]) {
    this.#store.update(() => ISet(keys));
  }
  enable(key: RegionKey) {
    this.#store.update(($regions) => $regions.add(key));
  }

  disable(key: RegionKey) {
    this.#store.update(($regions) => $regions.remove(key));
  }
}
