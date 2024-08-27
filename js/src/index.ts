import { EditorView, minimalSetup } from "codemirror";
import { bracketMatching } from "@codemirror/language";
import { closeBrackets } from "@codemirror/autocomplete";
import { EditorState } from "@codemirror/state";
import { placeholder } from "@codemirror/view";

import { starLang } from "./starlang";
import { update } from "./update";

// For tests.
export * from "./starlang";

export function createEditor(doc: string, parent: HTMLElement) {
  return new EditorView({
    doc,
    parent,
    extensions: [
      ...shared(),
      update(),
      placeholder("Enter your Pokémon here..."),
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
