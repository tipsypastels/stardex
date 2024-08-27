import { EditorView } from "@codemirror/view";
import { entries } from "./entry";

interface Span {
  from: number;
  to: number;
}

export function update() {
  return EditorView.updateListener.of((event) => {
    if (!event.docChanged) {
      return;
    }

    const e = entries(event.state);
    console.log(JSON.stringify(e, null, 2));
  });
}
