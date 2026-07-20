import { createEffect, createRoot, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import * as v from "valibot";
import { POKEMONS, RawPokemon, type Pokemon } from ".";
import { id } from "../../utils/id";
import { stored } from "../../utils/storage";
import type { Region } from "../region";
import { catchInitialValidationError } from "../ui/error/validation";
import { runAutosort, type AutosortRequest } from "./autosort";
import { createPokemonMutator } from "./mutator";
import {
  POKEMON_LIST_VERSION,
  POKEMON_VERSION,
  V0_RawPokemonList,
  V0_upgradeRawPokemonList,
} from "./versioned";

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

      const [all, setAll] = createStore<Pokemon[]>([]);
      const [textDiff, setTextDiff] = createSignal<string[]>();

      const caught = catchInitialValidationError(() => {
        const raw_ = store.load();
        if (!raw_) return;

        const raw = v.parse(VAny_RawPokemonList, raw_);

        setAll(raw.all.map(POKEMONS.make));
        setTextDiff(raw.textDiff);
      });

      if (!caught) {
        createEffect(() => {
          store.dump({
            v: POKEMON_LIST_VERSION,
            all: [...all],
            textDiff: textDiff(),
          });
        });
      }

      return {
        all,
        textDiff,

        mutator(id: string) {
          return createPokemonMutator(id, setAll);
        },

        push(pokemon: Pokemon) {
          setAll(all.length, pokemon);
        },

        pushMany(pokemons: Pokemon[]) {
          setAll((all) => all.concat(pokemons));
        },

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
          setAll(raw.all.map(POKEMONS.make));
          setTextDiff(raw.textDiff);
        },

        setFromRegion(region: Region) {
          setAll(
            region.members.map((member) =>
              POKEMONS.make({
                v: POKEMON_VERSION,
                id: id(),
                species: member.speciesKey,
                types: member.getAltTypeKeys(),
              }),
            ),
          );
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
