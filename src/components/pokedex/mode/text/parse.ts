import { ensureSyntaxTree, syntaxTree } from "@codemirror/language";
import { linter } from "@codemirror/lint";
import type { EditorState, Extension } from "@codemirror/state";
import { EditorView } from "codemirror";
import { createEffect, createMemo, createRoot, createSignal } from "solid-js";
import { pokedexMode } from "../../../../models/pokedex/mode";
import type { Pokemon } from "../../../../models/pokemon";
import { pokemons } from "../../../../models/pokemon/list";
import {
  parsePokemonListTextFromLezerTree,
  type ParsePokemonListTextResult,
} from "../../../../models/pokemon/text/parse";
import { id } from "../../../../utils/id";
import type { Span } from "../../../../utils/span";
import { getTrackedIdAtSpan } from "./metadata";

const current = createRoot(() => {
  const [result, setResult] = createSignal<ParsePokemonListTextResult>();

  const pokemonsById = createMemo(() =>
    // This is still tracked even when we're not in text mode (assuming the text mode bundle
    // is loaded i.e. we've opened it) but we do not use these outside of that, stub it out
    // to prevent wasting memory and sending useless updates.
    pokedexMode.key === "text"
      ? new Map(pokemons.all.map((pokemon) => [pokemon.id, pokemon]))
      : new Map<string, Pokemon>(),
  );

  createEffect(() => {
    const list = result()?.list;
    if (list) pokemons.setFromRaw(list);
  });

  return {
    get result() {
      return result();
    },
    get pokemonsById() {
      return pokemonsById();
    },
    parse(state: EditorState) {
      const text = new SliceableDoc(state);
      const getId = (span: Span) => getTrackedIdAtSpan(state, span) ?? id();
      const result = parsePokemonListTextFromLezerTree(syntaxTree(state), text, getId);
      setResult(result);
    },
  };
});

export function parseInitial(state: EditorState) {
  ensureSyntaxTree(state, state.doc.length, 5000);
  current.parse(state);
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
    return current.result?.errors ?? [];
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
