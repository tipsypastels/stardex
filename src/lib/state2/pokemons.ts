import { Pokemon, Pokemons } from "$lib/models2/pokemon";
import { persistedWritable, reducible } from "$lib/utils/stores";
import { derived } from "svelte/store";

export const pokemons = reducible(
  persistedWritable({
    key: "stardex_pokemon",
    default: () => Pokemons.default(),
    load: (data) => Pokemons.from(data),
  }),
  (store) => ({
    hasKey(key: string) {
      return derived(store, ($pokemons) => $pokemons.hasKey(key));
    },
    get(index: number) {
      return derived(store, ($pokemons) => $pokemons.get(index));
    },
    push(...pokemons: Pokemon[]) {
      store.update(($pokemons) => $pokemons.withPushed(...pokemons));
    },
    setName(index: number, name: string) {
      store.update(($pokemons) => $pokemons.withName(index, name));
    },
    setTypes(index: number, typeKeys: string[]) {
      store.update(($pokemons) => $pokemons.withTypes(index, typeKeys));
    },
    setTypeAt(index: number, typeIndex: number, typeKey: string | undefined) {
      store.update(($pokemons) => $pokemons.withTypeAt(index, typeIndex, typeKey));
    },
    resetTypes(index: number) {
      store.update(($pokemons) => $pokemons.withoutTypes(index));
    },
    setExclude(index: number, exclude: boolean) {
      store.update(($pokemons) => $pokemons.withExclude(index, exclude));
    },
    swap(index: number, jndex: number) {
      store.update(($pokemons) => $pokemons.withSwapped(index, jndex));
    },
    delete(index: number) {
      store.update(($pokemons) => $pokemons.without(index));
    },
    clear() {
      store.set(Pokemons.default());
    },
  }),
);
