import { batch, createEffect, createRoot, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import * as v from "valibot";
import { POKEMON_VERSION, POKEMONS, type Pokemon } from ".";
import { makeId } from "../../utils/id";
import { stored } from "../../utils/storage";
import type { Region } from "../region";
import { catchStartupError } from "../ui/error";
import { runAutosort, type AutosortRequest } from "./autosort";
import { createPokemonMutator, pokemonListBulkReplaceTypeKey } from "./mutator";
import { deletePokemonListVerbatimTextEntry, type PokemonListVerbatimText } from "./text/verbatim";
import { V0_RawPokemonList, V0_upgradeRawPokemonList } from "./versioned/list/v0";
import { V1_RawPokemonList, V1_upgradeRawPokemonList } from "./versioned/list/v1";
import { V2_RawPokemonList } from "./versioned/list/v2";

/* -------------------------------------------------------------------------- */
/*                                     Raw                                    */
/* -------------------------------------------------------------------------- */

export const POKEMON_LIST_VERSION = 2;

export type RawPokemonList = v.InferOutput<typeof RawPokemonList>;
export { V2_RawPokemonList as RawPokemonList };

// prettier-ignore
export const VAny_RawPokemonList = v.union([
  V2_RawPokemonList,
  v.pipe(V1_RawPokemonList, v.transform(V1_upgradeRawPokemonList)),
  v.pipe(V0_RawPokemonList, v.transform(V0_upgradeRawPokemonList), v.transform(V1_upgradeRawPokemonList)),
]);

/* -------------------------------------------------------------------------- */
/*                                    List                                    */
/* -------------------------------------------------------------------------- */

export const pokemons = createRoot(() => {
  const store = stored("stardex_pokemon");

  const [all, setAll] = createStore<Pokemon[]>([]);
  const [verbatimText, setVerbatimText] = createSignal<PokemonListVerbatimText>([[], {}]);

  const caught = catchStartupError("pokemonList", () => {
    const raw_ = store.load();
    if (!raw_) return;

    const raw = v.parse(VAny_RawPokemonList, raw_);

    setAll(raw.all.map(POKEMONS.make));
    setVerbatimText(raw.verbatimText);
  });

  if (!caught) {
    createEffect(() => {
      store.dump({
        v: POKEMON_LIST_VERSION,
        all: [...all],
        verbatimText: verbatimText(),
      });
    });
  }

  return {
    all,

    get verbatimText() {
      return verbatimText();
    },

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
      batch(() => {
        let index = -1;

        setAll(
          produce((all) => {
            index = all.findIndex((pokemon) => pokemon.id === id);
            all.splice(index, 1);
          }),
        );
        setVerbatimText((verbatimText) => deletePokemonListVerbatimTextEntry(verbatimText, index));
      });
    },

    bulkReplaceTypeKey(oldKey: string, newKey: string) {
      pokemonListBulkReplaceTypeKey(oldKey, newKey, setAll);
    },

    autosort(request: AutosortRequest) {
      batch(() => {
        setAll((all) => runAutosort(all, request));
        setVerbatimText([[], {}]);
      });
    },

    clear() {
      this.setFromRaw({ v: POKEMON_LIST_VERSION, all: [], verbatimText: [[], {}] });
    },

    setFromRaw(raw: RawPokemonList) {
      batch(() => {
        setAll(raw.all.map(POKEMONS.make));
        setVerbatimText(raw.verbatimText);
      });
    },

    setFromRegion(region: Region) {
      batch(() => {
        setAll(
          region.members.map((member) =>
            POKEMONS.make({
              v: POKEMON_VERSION,
              id: makeId(),
              species: member.speciesKey,
              alt: member.altKind,
            }),
          ),
        );
        setVerbatimText([[], {}]);
      });
    },

    toRaw(): RawPokemonList {
      return {
        v: POKEMON_LIST_VERSION,
        all: all.map((pokemon) => pokemon.toRaw()),
        verbatimText: verbatimText(),
      };
    },

    toJSON(): unknown {
      return this.toRaw();
    },
  };
});
