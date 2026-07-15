import { computed, createModel, effect, signal } from "@preact/signals";
import { List as IList, Map as IMap } from "immutable";
import { BUILTIN_POKEMONS, CUSTOM_POKEMONS, POKEMONS, type Pokemon, type RawPokemon } from ".";
import { id } from "../../state/id";
import { makeLifter, readonly, type Lifter } from "../../utils/signal";
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

export const PokemonList = createModel(
  ($all: Pokemon[], $textDiff: string[] | undefined, lifter: Lifter) => {
    const all = signal(IList($all));
    const indicesById = computed(() => IMap(all.value.map((p, i) => [p.id.value, i])));
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
    lifter.onChange(onChange);

    function push(pokemons: Pokemon[]) {
      all.value = all.value.push(...pokemons);
    }

    return {
      all: readonly(all),
      indicesById,
      size,
      textDiff,
      get(index: number) {
        return all.value.get(index);
      },
      pushBuiltins(speciesKeys: string[]) {
        push(speciesKeys.map((speciesKey) => BUILTIN_POKEMONS.of(speciesKey, lifter)));
      },
      pushCustom(name: string, typeKeys: string[]) {
        push([CUSTOM_POKEMONS.of(name, typeKeys, lifter)]);
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
        all.value = IList(raw.all.map((raw) => POKEMONS.from(raw, lifter)));
        textDiff.set(raw.textDiff);
      },
      setFromRegion(region: Region) {
        all.value = IList(
          region.members.map((member) =>
            POKEMONS.from(
              {
                v: POKEMON_VERSION,
                id: id(),
                species: member.speciesKey,
                types: member.getAltTypeKeys(),
              },
              lifter,
            ),
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
  },
);

export const POKEMON_LISTS = (() => {
  function initial() {
    const lifter = makeLifter();
    const raw = store.load();
    if (raw) {
      const { all, textDiff } = upgradeRawPokemonList(raw);
      return new PokemonList(
        all.map((raw) => POKEMONS.from(raw, lifter)),
        textDiff,
        lifter,
      );
    } else {
      return new PokemonList([], undefined, lifter);
    }
  }
  return { initial };
})();
