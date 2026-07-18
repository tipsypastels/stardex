import { ReactiveSet } from "@solid-primitives/set";
import { createEffect, createRoot } from "solid-js";
import * as v from "valibot";
import { stored } from "../../utils/storage";

export const EXCLUDED_TYPES_VERSION = 1;

export type RawExcludedTypesSet = v.InferOutput<typeof RawExcludedTypesSet>;
export const RawExcludedTypesSet = v.object({
  v: v.literal(EXCLUDED_TYPES_VERSION),
  all: v.array(v.string()),
});

export const EXCLUDED_TYPES_SETS = (() => {
  function initial() {
    return createRoot(() => {
      const store = stored("stardex_excluded_types");
      const raw = v.parse(
        RawExcludedTypesSet,
        store.load() ?? { v: EXCLUDED_TYPES_VERSION, all: [] },
      );

      const all = new ReactiveSet(raw.all);

      createEffect(() => {
        store.dump({
          v: EXCLUDED_TYPES_VERSION,
          all: [...all],
        } satisfies RawExcludedTypesSet);
      });

      return {
        all: all as ReadonlySet<string>,

        toggle(typeKey: string) {
          if (all.has(typeKey)) {
            all.delete(typeKey);
          } else {
            all.add(typeKey);
          }
        },
        setFromRaw(raw: RawExcludedTypesSet) {
          all.clear();
          for (const type of raw.all) {
            all.add(type);
          }
        },
        toRaw(): RawExcludedTypesSet {
          return {
            v: EXCLUDED_TYPES_VERSION,
            all: [...all],
          };
        },
        toJSON(): unknown {
          return this.toRaw();
        },
      };
    });
  }

  return { initial };
})();

export const excludedTypes = EXCLUDED_TYPES_SETS.initial();
