import { computed, createModel, effect, signal } from "@preact/signals";
import { Set as ISet } from "immutable";
import { TYPES } from ".";
import { readonly } from "../../utils/signal";
import { stored } from "../../utils/storage";
import { EXCLUDED_TYPES_VERSION } from "../versioned";

const store = stored<RawExcludedTypesSet, DumpedSet>("stardex_excluded_types");

export interface RawExcludedTypesSet {
  v: typeof EXCLUDED_TYPES_VERSION;
  all: string[];
}

interface DumpedSet {
  v: typeof EXCLUDED_TYPES_VERSION;
  all: ISet<string>;
}

export type ExcludedTypesSet = InstanceType<typeof ExcludedTypesSet>;

export const ExcludedTypesSet = createModel(($raw: RawExcludedTypesSet) => {
  const all = signal(ISet($raw.all));

  const icon = computed(() => {
    if (all.value.size === 0) return "empty-set";
    if (all.value.size === 1) return TYPES.of(all.value.first()!).icon;
    return "trash-can-list";
  });

  effect(() => {
    store.dump({
      v: EXCLUDED_TYPES_VERSION,
      all: all.value,
    });
  });

  return {
    all: readonly(all),
    icon,
    toggle(typeKey: string) {
      if (all.value.has(typeKey)) {
        all.value = all.value.remove(typeKey);
      } else {
        all.value = all.value.add(typeKey);
      }
    },
    setFromRaw(raw: RawExcludedTypesSet) {
      all.value = ISet(raw.all);
    },
    toRaw(): RawExcludedTypesSet {
      return {
        v: EXCLUDED_TYPES_VERSION,
        all: all.value.toArray(),
      };
    },
    toJSON(): unknown {
      return this.toRaw();
    },
  };
});

export const EXCLUDED_TYPES_SETS = {
  initial() {
    return new ExcludedTypesSet(store.load() ?? { v: EXCLUDED_TYPES_VERSION, all: [] });
  },
};
