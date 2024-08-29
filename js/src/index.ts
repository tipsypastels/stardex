import { EditorView, minimalSetup } from "codemirror";
import { bracketMatching } from "@codemirror/language";
import { closeBrackets } from "@codemirror/autocomplete";
import { EditorState } from "@codemirror/state";
import { placeholder, ViewUpdate } from "@codemirror/view";
import randomColorFn from "randomcolor";

import { starLang } from "./starlang";
import { entries, EntryFn } from "./entry";
import { debouncer } from "./debounce";

// For tests.
export * from "./starlang";

export function createEditor(
  doc: string,
  parent: HTMLElement,
  onUpdate: (view: EditorView) => void,
  onUpdating?: () => void,
): EditorView {
  const debounce = debouncer({ onUpdate, onUpdating });
  const update = EditorView.updateListener.of((e) => {
    if (e.docChanged) {
      debounce.prepare(e.view);
    }
  });
  const handlers = EditorView.domEventHandlers({
    keyup() {
      debounce.commit();
    },
  });

  return new EditorView({
    doc,
    parent,
    extensions: [
      ...shared(),
      update,
      handlers,
      placeholder("Enter your Pokémon here..."),
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
