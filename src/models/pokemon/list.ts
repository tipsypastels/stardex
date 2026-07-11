import { computed, createModel, effect, signal } from "@preact/signals";
import { List as IList, Map as IMap } from "immutable";
import { POKEMONS, type Pokemon, type RawPokemon } from ".";
import { readonly } from "../../utils/signal";
import { stored } from "../../utils/storage";
import type { Region } from "../region";
import { POKEMON_LIST_VERSION, POKEMON_VERSION, upgradeRawPokemonList } from "../versioned";
import type { V0_RawPokemonList } from "../versioned/v0";
import { runAutosort, type AutosortRequest } from "./autosort";
import { PokemonListTextDiff } from "./text/diff";
import { serializePokemonListToText } from "./text/serialize";

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
    autosort(request: AutosortRequest) {
      all.value = runAutosort(all.value, request);
    },
    setFromRaw($raw: RawPokemonList | V0_RawPokemonList) {
      const raw = upgradeRawPokemonList($raw);
      all.value = IList(raw.all.map(POKEMONS.from));
      textDiff.set(raw.textDiff);
    },
    setFromRegion(region: Region) {
      all.value = IList(
        region.members.map((member) =>
          POKEMONS.from({
            v: POKEMON_VERSION,
            species: member.speciesKey,
            types: member.getAltTypeKeys(),
          }),
        ),
      );
    },
    toRaw(): RawPokemonList {
      return {
        v: POKEMON_LIST_VERSION,
        all: all.value.map((p) => p.toRaw()).toArray(),
        textDiff: textDiff.raw.value,
      };
    },
    peekSerializeToText() {
      const iter = all.peek();

      function* eager() {
        for (const pokemon of iter) {
          yield pokemon.toRaw();
        }
      }

      return serializePokemonListToText({
        pokemons: eager(),
        textDiff: textDiff.raw.peek(),
      });
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
