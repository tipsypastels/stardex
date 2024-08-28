import { EditorView, minimalSetup } from "codemirror";
import { bracketMatching } from "@codemirror/language";
import { closeBrackets } from "@codemirror/autocomplete";
import { EditorState } from "@codemirror/state";
import { placeholder } from "@codemirror/view";

import { starLang } from "./starlang";

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

const shared = () => [
  minimalSetup,
  bracketMatching(),
  closeBrackets(),
  starLang(),
];
