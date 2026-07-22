import { syntaxTree } from "@codemirror/language";
import { linter } from "@codemirror/lint";
import type { EditorState, Extension } from "@codemirror/state";
import { EditorView } from "codemirror";
import { createEffect, createRoot, createSignal } from "solid-js";
import { pokemons } from "../../../../models/pokemon/list";
import {
  parsePokemonListTextFromLezerTree,
  type ParsePokemonListTextResult,
} from "../../../../models/pokemon/text/parse";
import { id } from "../../../../utils/id";
import type { Span } from "../../../../utils/span";
import { getTrackedIdAtSpan } from "./metadata";

const state = createRoot(() => {
  const [result, setResult] = createSignal<ParsePokemonListTextResult>();

  createEffect(() => {
    const list = result()?.list;
    if (list) pokemons.setFromRaw(list);
  });

  return { result, setResult };
});

export const parser: Extension = [
  EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      const text = new SliceableDoc(update.state);
      const getId = (span: Span) => getTrackedIdAtSpan(update.state, span) ?? id();
      const result = parsePokemonListTextFromLezerTree(syntaxTree(update.state), text, getId);
      state.setResult(result);
    }
  }),
  linter(() => {
    return state.result()?.errors ?? [];
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
