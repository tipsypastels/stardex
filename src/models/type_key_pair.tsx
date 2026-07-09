import { computed, createModel, signal } from "@preact/signals";
import { readonly } from "../utils/signal";
import { TYPES } from "./type";

export type TypeKeyPair = InstanceType<typeof TypeKeyPair>;

export interface TypeKeyPairOptions {
  reset: "initial" | "ignore";
}

export const TypeKeyPair = createModel((initial: string[], { reset }: TypeKeyPairOptions) => {
  const keys = signal(initial);
  const types = computed(() => keys.value.map(TYPES.of));
  const changed = computed(
    () => reset === "initial" && initial.sort().join() !== keys.value.sort().join(),
  );

  return {
    keys: readonly(keys),
    types,
    changed,
    set(newKeys: string[] | undefined) {
      newKeys = newKeys?.filter((s) => !!s);
      if (!newKeys || newKeys.length === 0) {
        if (reset === "initial") {
          keys.value = initial;
        }
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
});
