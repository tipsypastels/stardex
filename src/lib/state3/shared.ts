import type { Writable } from "svelte/store";

const NON_V1_KEY = "stardexState";

export function getNonV1StateData(): object | undefined {
  const json = localStorage.getItem(NON_V1_KEY);
  if (!json) return;
  const data = JSON.parse(json);
  if (!data || typeof data !== "object") throw new Error("Invalid state.");
  return data;
}

export function setNonV1StateData(data: object) {
  localStorage.set(NON_V1_KEY, JSON.stringify(data));
}

export function transformed<T>(store: Writable<T>, f: (value: T) => T): Writable<T> {
  return {
    subscribe: store.subscribe,
    set(value) {
      store.set(f(value));
    },
    update(updater) {
      store.update((v) => updater(f(v)));
    },
  };
}
