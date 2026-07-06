import { reducible } from "$lib/utils/stores";
import { writable } from "svelte/store";

export const pokedexFilterType = reducible(writable<string | undefined>(), (store) => ({
  set(value: string | undefined) {
    store.set(value ? value : undefined);
  },
}));
