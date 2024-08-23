import { EditorView, minimalSetup } from "codemirror";
import { bracketMatching } from "@codemirror/language";
import { closeBrackets } from "@codemirror/autocomplete";
import { starLang } from "./starlang";
import { EditorState } from "@codemirror/state";

export function createEditor(
  doc: string,
  parent: HTMLElement,
  readonly: boolean,
) {
  console.log("Creating editor...");
  return new EditorView({
    doc,
    parent,
    extensions: [
      minimalSetup,
      bracketMatching(),
      closeBrackets(),
      starLang(),
      EditorState.readOnly.of(readonly),
    ],
  });
}
