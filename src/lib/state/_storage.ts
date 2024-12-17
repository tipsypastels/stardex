import { onMount } from "svelte";
import type { Readable } from "svelte/store";

interface Storage<T> {
  initial: T | undefined;
  clear(): void;
  // type may differ in storage and runtime, e.g.
  // regions is iset but stored as array.
  persister<U = T>(store: Readable<U>): () => void;
}

export function createStorage<T>(key: string): Storage<T> {
  const initial = getInitial(key);
  return {
    initial,
    clear() {
      localStorage.removeItem(key);
    },
    persister<U = T>(store: Readable<U>) {
      return () => {
        onMount(() =>
          store.subscribe(($value) => {
            const json = JSON.stringify($value);
            localStorage.setItem(key, json);
          }),
        );
      };
    },
  };
}

function getInitial(key: string) {
  const json = localStorage.getItem(key);
  if (json) return JSON.parse(json);
}
