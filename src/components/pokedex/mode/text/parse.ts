import { syntaxTree } from "@codemirror/language";
import { type Diagnostic, linter } from "@codemirror/lint";
import type { EditorState, Extension } from "@codemirror/state";
import { EditorView } from "codemirror";
import { batch, createEffect, createMemo, createRoot, createSignal } from "solid-js";
import { pokedexMode } from "../../../../models/pokedex/mode";
import type { Pokemon } from "../../../../models/pokemon";
import { pokemons, RawPokemonList } from "../../../../models/pokemon/list";
import { parsePokemonListTextFromLezerTree } from "../../../../models/pokemon/text/parse";
import { id } from "../../../../utils/id";
import type { Span } from "../../../../utils/span";
import { getTrackedIdAtSpan } from "./metadata";

const current = createRoot(() => {
  const [list, setList] = createSignal<RawPokemonList>();
  const [errors, setErrors] = createSignal<Diagnostic[]>();

  const pokemonsById = createMemo(() =>
    // This is still tracked even when we're not in text mode (assuming the text mode bundle
    // is loaded i.e. we've opened it) but we do not use these outside of that, stub it out
    // to prevent wasting memory and sending useless updates.
    pokedexMode.key === "text"
      ? new Map(pokemons.all.map((pokemon) => [pokemon.id, pokemon]))
      : new Map<string, Pokemon>(),
  );

  createEffect(() => {
    const currentList = list();
    if (currentList) {
      pokemons.setFromRaw(currentList);
    }
  });

  return {
    get errors() {
      return errors();
    },
    get pokemonsById() {
      return pokemonsById();
    },
    parse(state: EditorState, onlySetErrors = false) {
      const text = new SliceableDoc(state);
      const getId = (span: Span) => getTrackedIdAtSpan(state, span) ?? id();
      const result = parsePokemonListTextFromLezerTree(syntaxTree(state), text, getId);

      if (onlySetErrors) {
        setErrors(result.errors);
      } else {
        batch(() => {
          setList(result.list);
          setErrors(result.errors);
        });
      }
    },
  };
});

export function parseInitial(state: EditorState) {
  // Don't overwrite the pokedex, first of all because we know it can't have changed yet,
  // but more importantly because the syntax tree may not have been fully initialized,
  // which would result in us losing pokemon.
  current.parse(state, true);
}

export function getPokemonBySpan(state: EditorState, span: Span) {
  const id = getTrackedIdAtSpan(state, span);
  return id ? current.pokemonsById.get(id) : undefined;
}

export const parser: Extension = [
  EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      current.parse(update.state);
    }
  }),
  linter(() => {
    return current.errors ?? [];
  }),
];

class SliceableDoc implements Pick<string, "slice"> {
  #state: EditorState;

  constructor(state: EditorState) {
    this.#state = state;
  }

  slice(from?: number, to?: number) {
    return this.#state.sliceDoc(from, to);
  }
}
