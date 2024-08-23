import { basicSetup, EditorView } from "codemirror";
import { starLang } from "./starlang";

let editor: EditorView;

export function editorInit(parent: HTMLElement) {
  editor = new EditorView({
    doc: "",
    extensions: [basicSetup, starLang()],
    parent,
  });
}
