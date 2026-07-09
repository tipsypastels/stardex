import { computed, createModel, effect, signal } from "@preact/signals";
import { List as IList, Map as IMap } from "immutable";
import { POKEMONS, type Pokemon, type RawPokemon } from ".";
import { readonly } from "../../utils/signal";
import { stored } from "../../utils/storage";
import type { V0_RawPokemon } from "../versioned/v0";

const store = stored<RawPokemon[], IList<Pokemon>>("stardex_pokemon");

export type PokemonList = InstanceType<typeof PokemonList>;

export const PokemonList = createModel(($all: Pokemon[]) => {
  const all = signal(IList($all));
  const indices = computed(() => IMap(all.value.map((p, i) => [p.key.value, i])));
  const size = computed(() => all.value.size);

  function onChange() {
    store.dump(all.value);
  }

  effect(onChange);

  return {
    all: readonly(all),
    indices: readonly(indices),
    size,
    has(pokemon: Pokemon) {
      return this.hasKey(pokemon.key.value);
    },
    hasKey(key: string) {
      return indices.value.has(key);
    },
    get(index: number) {
      const pokemon = all.value.get(index);
      pokemon?.onChange(onChange);
      return pokemon;
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
    setFromRaw(raws: (RawPokemon | V0_RawPokemon)[]) {
      all.value = IList(raws.map(POKEMONS.from));
    },
    toRaw() {
      return all.value.map((p) => p.toRaw()).toArray();
    },
  };
});

export const POKEMON_LISTS = (() => {
  function initial() {
    return new PokemonList(store.load()?.map(POKEMONS.from) ?? []);
  }
  return { initial };
})();
