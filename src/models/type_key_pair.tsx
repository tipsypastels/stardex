import { computed, createModel, signal } from "@preact/signals";
import { readonly } from "../utils/signal";
import { TYPES } from "./type";

export type TypeKeyPair = InstanceType<typeof TypeKeyPair>;

export interface TypeKeyPairOptions {
  fallback?: string[];
}

export const TypeKeyPair = createModel(
  (current: string[], { fallback }: TypeKeyPairOptions = {}) => {
    const keys = signal(current);
    const types = computed(() => keys.value.map(TYPES.of));
    const changed = computed(() => {
      return !!fallback && fallback.sort().join() !== keys.value.sort().join();
    });

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
