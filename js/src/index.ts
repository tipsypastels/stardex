import { EditorView, minimalSetup } from "codemirror";
import { bracketMatching } from "@codemirror/language";
import { closeBrackets } from "@codemirror/autocomplete";
import { starLang } from "./starlang";

let editor: EditorView;

export function editorInit(parent: HTMLElement) {
  editor = new EditorView({
    doc: "",
    parent,
    extensions: [minimalSetup, bracketMatching(), closeBrackets(), starLang()],
  });
}
