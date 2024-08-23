import { basicSetup, EditorView } from "codemirror";
import { myLang } from "./mylang";

let editor: EditorView;

export function init(parent: HTMLElement) {
  editor = new EditorView({
    doc: "",
    extensions: [basicSetup, myLang()],
    parent,
  });
  console.log(editor);
}
