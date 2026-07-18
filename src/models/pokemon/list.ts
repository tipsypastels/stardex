import { createEffect, createRoot, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import * as v from "valibot";
import { POKEMONS, RawPokemon, type Pokemon } from ".";
import { stored } from "../../utils/storage";
import { runAutosort, type AutosortRequest } from "./autosort";
import { POKEMON_LIST_VERSION, V0_RawPokemonList, V0_upgradeRawPokemonList } from "./versioned";

/* -------------------------------------------------------------------------- */
/*                                     Raw                                    */
/* -------------------------------------------------------------------------- */

export type RawPokemonList = v.InferOutput<typeof RawPokemonList>;

export const RawPokemonList = v.object({
  v: v.literal(POKEMON_LIST_VERSION),
  all: v.array(RawPokemon),
  textDiff: v.optional(v.array(v.string())),
});

export const VAny_RawPokemonList = v.union([
  RawPokemonList,
  v.pipe(V0_RawPokemonList, v.transform(V0_upgradeRawPokemonList)),
]);

/* -------------------------------------------------------------------------- */
/*                                    List                                    */
/* -------------------------------------------------------------------------- */

export interface PokemonList {
  all: Pokemon[];
  textDiff?: string[];
}

export const POKEMON_LISTS = (() => {
  function initial() {
    return createRoot(() => {
      const store = stored("stardex_pokemon");
      const raw = v.parse(
        VAny_RawPokemonList,
        store.load() ?? { v: POKEMON_LIST_VERSION, any: [] },
      );

      const [all, setAll] = createStore(raw.all.map(POKEMONS.from));
      const [textDiff, setTextDiff] = createSignal(raw.textDiff);

      createEffect(() => {
        store.dump({
          v: POKEMON_LIST_VERSION,
          all: [...all],
          textDiff: textDiff(),
        });
      });

      return {
        all,
        textDiff,

        move(index: number, toIndex: number) {
          setAll(
            produce((all) => {
              const [pokemon] = all.splice(index, 1);
              all.splice(toIndex, 0, pokemon);
            }),
          );
        },

        delete(id: string) {
          setAll((all) => all.filter((pokemon) => pokemon.id !== id));
        },

        autosort(request: AutosortRequest) {
          setAll((all) => runAutosort(all, request));
        },

        clear() {
          this.setFromRaw({ v: POKEMON_LIST_VERSION, all: [] });
        },

        setFromRaw(raw: RawPokemonList) {
          setAll(raw.all.map(POKEMONS.from));
          setTextDiff(raw.textDiff);
        },

        toRaw(): RawPokemonList {
          return {
            v: POKEMON_LIST_VERSION,
            all: all.map((pokemon) => pokemon.toRaw()),
            textDiff: textDiff(),
          };
        },
        toJSON(): unknown {
          return this.toRaw();
        },
      };
    });
  }
  return { initial };
})();

export const pokemons = POKEMON_LISTS.initial();
