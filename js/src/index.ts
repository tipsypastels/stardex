import { EditorView, minimalSetup } from "codemirror";
import { bracketMatching } from "@codemirror/language";
import { closeBrackets } from "@codemirror/autocomplete";
import { starLang } from "./starlang";
import { EditorState } from "@codemirror/state";
import { placeholder } from "@codemirror/view";

// For tests.
export * from "./starlang";

export function createEditor(doc: string, parent: HTMLElement) {
  return new EditorView({
    doc,
    parent,
    extensions: [
      ...shared(),
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
