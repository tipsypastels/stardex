import { ReactiveSet } from "@solid-primitives/set";
import { createEffect, createMemo, createRoot } from "solid-js";
import * as v from "valibot";
import { RegionKey, REGIONS } from ".";
import { stored } from "../../utils/storage";
import { catchValidationError } from "../ui/error/validation";

export const regions = createRoot(() => {
  const store = stored("stardex_regions");

  const keys = new ReactiveSet<RegionKey>(REGIONS.recommendedKeys);
  const all = createMemo(() => [...keys].map(REGIONS.of));

  const caught = catchValidationError(() => {
    const raw = store.load();
    if (!raw) return;
    for (const key of v.parse(v.array(RegionKey), raw)) {
      keys.add(key);
    }
  });

  if (!caught) {
    createEffect(() => {
      store.dump([...keys]);
    });
  }

  return {
    keys: keys as ReadonlySet<RegionKey>,
    get all() {
      return all();
    },
    get isAll() {
      return keys.size === REGIONS.allKeys.length;
    },
    get isRecommended() {
      return keys.size === REGIONS.recommendedKeys.length && !keys.has("kanto");
    },
    add(key: RegionKey) {
      keys.add(key);
    },
    delete(key: RegionKey) {
      keys.delete(key);
    },
    set(newKeys: RegionKey[]) {
      keys.clear();
      for (const key of newKeys) {
        keys.add(key);
      }
    },
    toRaw() {
      return [...keys];
    },
  };
});
