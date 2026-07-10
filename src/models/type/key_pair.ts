import { computed, createModel, signal } from "@preact/signals";
import { PairSorting } from "immutable";
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

export const TYPE_KEY_PAIRS = (() => {
  function asEqualityTestString(typeKeys: string[]) {
    return [...typeKeys].sort().join();
  }

  function equal(left: string[], right: string[]) {
    return asEqualityTestString(left) === asEqualityTestString(right);
  }

  function findEqual<T extends { typeKeys: string[] }>(needle: string[], haystack: T[]) {
    const left = asEqualityTestString(needle);
    return haystack.find((item) => left === asEqualityTestString(item.typeKeys));
  }

  function compare(left: string[], right: string[]) {
    return new Array(Math.max(left.length, right.length))
      .fill(undefined)
      .reduce((prev: number, _, index) => {
        if (prev) return prev;

        const leftKey = left.at(index);
        const rightKey = right.at(index);

        // Note this is reversed, Pokemon with fewer types sort earlier.
        if (leftKey && !rightKey) return PairSorting.RightThenLeft;
        if (!leftKey && rightKey) return PairSorting.LeftThenRight;
        if (!leftKey && !rightKey) return 0;
        return TYPES.compareKeys(leftKey!, rightKey!);
      }, 0);
  }

  return { equal, findEqual, compare };
})();

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
