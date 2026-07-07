import { computed, createModel, signal } from "@preact/signals";
import { List as IList, Map as IMap } from "immutable";
import { readonly } from "../utils/signal";
import type { Pokemon } from "./pokemon";

export const PokemonList = createModel(($all: Pokemon[]) => {
  const all = signal(IList($all));
  const indices = computed(() => IMap(all.value.map((p, i) => [p.key.value, i])));

  return {
    all: readonly(all),
    indices: readonly(indices),
    has(pokemon: Pokemon) {
      return this.hasKey(pokemon.key.value);
    },
    hasKey(key: string) {
      return indices.value.has(key);
    },
    get(index: number) {
      return computed(() => all.value.get(index));
    },
    push(...pokemons: Pokemon[]) {
      all.value = all.value.push(...pokemons.filter((p) => !this.has(p)));
    },
    swap(index: number, jndex: number) {
      all.value = all.value.withMutations((list) => {
        const a = list.get(index)!;
        const b = list.get(jndex)!;
        list.set(index, b).set(jndex, a);
      });
    },
    delete(index: number) {
      all.value = all.value.delete(index);
    },
    toRaw() {
      return all.value.map((p) => p.toRaw());
    },
    toJSON(): unknown {
      return this.toRaw();
    },
  };
});
