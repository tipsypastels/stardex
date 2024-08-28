import { EditorView, minimalSetup } from "codemirror";
import { bracketMatching } from "@codemirror/language";
import { closeBrackets } from "@codemirror/autocomplete";
import { EditorState } from "@codemirror/state";
import { placeholder } from "@codemirror/view";

import { starLang } from "./starlang";
import { entries, EntryFn } from "./entry";

// For tests.
export * from "./starlang";

export function createEditor(
  doc: string,
  parent: HTMLElement,
  onUpdate: () => void,
) {
  return new EditorView({
    doc,
    parent,
    extensions: [
      ...shared(),
      placeholder("Enter your Pokémon here..."),
      EditorView.updateListener.of((e) => e.docChanged && onUpdate()),
    ],
  });
}

export function createTutorial(doc: string, parent: HTMLElement) {
  return new EditorView({
    doc,
    parent,
    extensions: [...shared(), EditorState.readOnly.of(true)],
  });
}

export function walkEditor(view: EditorView, fn: EntryFn) {
  entries(view.state, fn);
}

const shared = () => [
  minimalSetup,
  bracketMatching(),
  closeBrackets(),
  starLang(),
];
