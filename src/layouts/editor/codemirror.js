import { basicSetup, EditorView } from "https://esm.sh/codemirror@6.0.1";

let editor;

export function init(parent) {
  editor = new EditorView({
    doc: "",
    extensions: [basicSetup],
    parent,
  });
  console.log(editor);
}
