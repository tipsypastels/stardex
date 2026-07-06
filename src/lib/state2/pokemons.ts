import { Pokemon, Pokemons, type PokemonData } from "$lib/models2/pokemon";
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
      store.update(($pokemons) => $pokemons.push(...pokemons));
    },
    setName(index: number, name: string) {
      store.update(($pokemons) => $pokemons.setName(index, name));
    },
    setTypes(index: number, typeKeys: string[]) {
      store.update(($pokemons) => $pokemons.setTypes(index, typeKeys));
    },
    setTypeAt(index: number, typeIndex: number, typeKey: string | undefined) {
      store.update(($pokemons) => $pokemons.setTypeAt(index, typeIndex, typeKey));
    },
    unsetTypes(index: number) {
      store.update(($pokemons) => $pokemons.unsetTypes(index));
    },
    setExclude(index: number, exclude: boolean) {
      store.update(($pokemons) => $pokemons.setExclude(index, exclude));
    },
    swap(index: number, jndex: number) {
      store.update(($pokemons) => $pokemons.swap(index, jndex));
    },
    delete(index: number) {
      store.update(($pokemons) => $pokemons.delete(index));
    },
    set(datas: PokemonData[]) {
      store.set(Pokemons.from(datas));
    },
    clear() {
      store.set(Pokemons.default());
    },
  }),
);
