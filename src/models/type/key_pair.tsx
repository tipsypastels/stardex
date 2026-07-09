import { computed, createModel, signal } from "@preact/signals";
import { TYPES } from ".";
import { readonly } from "../../utils/signal";

export type TypeKeyPair = InstanceType<typeof TypeKeyPair>;

export interface TypeKeyPairOptions {
  fallback?: string[];
}

export const TypeKeyPair = createModel(
  (current: string[], { fallback }: TypeKeyPairOptions = {}) => {
    const keys = signal(current);
    const types = computed(() => keys.value.map(TYPES.of));
    const changed = computed(() => !!fallback && fallback.join() !== keys.value.join());

    return {
      keys: readonly(keys),
      types,
      changed,
      set(newKeys: string[] | undefined) {
        newKeys = newKeys?.filter((s) => !!s);
        if (!newKeys || newKeys.length === 0) {
          if (fallback) keys.value = fallback;
          return;
        }
        keys.value = newKeys;
      },
      setAt(index: number, key: string | undefined) {
        const newKeys = [...keys.value];
        if (key) {
          newKeys[index] = key;
        } else {
          newKeys.splice(index, 1);
        }
        this.set(newKeys);
      },
    };
  },
);

export function compareTypeKeysUnordered(left: string[], right: string[]) {
  return comparable(left) === comparable(right);
}

export function matchTypeKeysUnorderedInArray<T extends { typeKeys: string[] }>(
  needle: string[],
  haystack: T[],
) {
  const aComparable = comparable(needle);
  return haystack.find((item) => comparable(item.typeKeys) === aComparable);
}

function comparable(typeKeys: string[]) {
  return [...typeKeys].sort().join();
}
