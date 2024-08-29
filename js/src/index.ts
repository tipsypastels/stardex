import { EditorView, minimalSetup } from "codemirror";
import { bracketMatching } from "@codemirror/language";
import { closeBrackets } from "@codemirror/autocomplete";
import { EditorState } from "@codemirror/state";
import { placeholder } from "@codemirror/view";
import randomColorFn from "randomcolor";

import { starLang } from "./starlang";
import { entries, EntryFn } from "./entry";

// For tests.
export * from "./starlang";

export function createEditor(
  doc: string,
  parent: HTMLElement,
  onUpdate: (view: EditorView) => void,
): EditorView {
  return new EditorView({
    doc,
    parent,
    extensions: [
      ...shared(),
      placeholder("Enter your Pokémon here..."),
      EditorView.updateListener.of((e) => e.docChanged && onUpdate(e.view)),
    ],
  });
}

export function createTutorial(doc: string, parent: HTMLElement): EditorView {
  return new EditorView({
    doc,
    parent,
    extensions: [...shared(), EditorState.readOnly.of(true)],
  });
}

export function walkEditor(view: EditorView, fn: EntryFn): boolean {
  return entries(view.state, fn);
}

export function randomColor(seed: string): string {
  return randomColorFn({ seed });
}

const shared = () => [
  minimalSetup,
  bracketMatching(),
  closeBrackets(),
  starLang(),
];
