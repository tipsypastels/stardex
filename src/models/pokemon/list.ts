import { computed, createModel, effect, signal } from "@preact/signals";
import { List as IList, Map as IMap } from "immutable";
import { POKEMONS, type Pokemon, type RawPokemon } from ".";
import { readonly } from "../../utils/signal";
import { stored } from "../../utils/storage";
import { POKEMON_LIST_VERSION, upgradeRawPokemonList } from "../versioned";
import type { V0_RawPokemonList } from "../versioned/v0";
import { runAutosort, type AutosortOptions } from "./autosort";
import { PokemonListTextDiff } from "./text/diff";

const store = stored<RawPokemonList, DumpedPokemonList>("stardex_pokemon");

export interface RawPokemonList {
  v: typeof POKEMON_LIST_VERSION;
  all: RawPokemon[];
  textDiff?: string[];
}

interface DumpedPokemonList {
  v: typeof POKEMON_LIST_VERSION;
  all: IList<Pokemon>;
  textDiff?: string[];
}

export type PokemonList = InstanceType<typeof PokemonList>;

export const PokemonList = createModel(($all: Pokemon[], $textDiff?: string[]) => {
  const all = signal(IList($all));
  const indices = computed(() => IMap(all.value.map((p, i) => [p.key.value, i])));
  const size = computed(() => all.value.size);

  const textDiff = new PokemonListTextDiff($textDiff);

  function onChange() {
    store.dump({
      v: POKEMON_LIST_VERSION,
      all: all.value,
      textDiff: textDiff.raw.value,
    });
  }

  effect(onChange);

  return {
    all: readonly(all),
    indices: readonly(indices),
    size,
    textDiff,
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
    move(index: number, jndex: number) {
      const value = all.value.get(index);
      // These methods don't support withMutations.
      if (value) all.value = all.value.delete(index).insert(jndex, value);
    },
    delete(index: number) {
      all.value = all.value.delete(index);
    },
    autosorter(options: AutosortOptions) {
      const newList = runAutosort(all.value, options);
      return {
        keys: newList.map((p) => p.key.value).toArray(),
        apply: () => (all.value = newList),
      };
    },
    setFromRaw($raw: RawPokemonList | V0_RawPokemonList) {
      const raw = upgradeRawPokemonList($raw);
      all.value = IList(raw.all.map(POKEMONS.from));
      textDiff.set(raw.textDiff);
    },
    toRaw(): RawPokemonList {
      return {
        v: POKEMON_LIST_VERSION,
        all: all.value.map((p) => p.toRaw()).toArray(),
        textDiff: textDiff.raw.value,
      };
    },
  };
});

export const POKEMON_LISTS = (() => {
  function initial() {
    const raw = store.load();
    if (raw) {
      const { all, textDiff } = upgradeRawPokemonList(raw);
      return new PokemonList(all.map(POKEMONS.from), textDiff);
    } else {
      return new PokemonList([]);
    }
  }
  return { initial };
})();
