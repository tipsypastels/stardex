import { basicSetup, EditorView } from "codemirror";

let editor: EditorView;

export function init(parent: HTMLElement) {
  editor = new EditorView({
    doc: "",
    extensions: [basicSetup],
    parent,
  });
  console.log(editor);
}
