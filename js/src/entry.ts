import { syntaxTree } from "@codemirror/language";
import { EditorState } from "@codemirror/state";

export type EntryFn = (
  name: string,
  types: string[] | undefined,
  attrs: string[],
) => boolean;

interface Span {
  from: number;
  to: number;
}

export function entries(state: EditorState, fn: EntryFn) {
  const text = (span: Span) => state.sliceDoc(span.from, span.to);

  const tree = syntaxTree(state);
  const lines = tree.topNode.getChildren("Line");

  for (const line of lines) {
    const cursor = line.cursor();

    if (!cursor.firstChild()) {
      continue;
    }

    let name = "";
    let types: string[] | undefined;
    const attrs: string[] = [];

    do {
      switch (cursor.name) {
        case "Name": {
          if (name.length > 0) {
            name += " ";
          }
          name += text(cursor);
          break;
        }
        case "Types": {
          types = parseTypes(text(cursor));
          break;
        }
        case "Attr": {
          attrs.push(text(cursor));
          break;
        }
        case "": {
          break;
        }
        default: {
          console.warn("Unhandled node type", cursor.name, text(cursor));
        }
      }
    } while (cursor.nextSibling());

    if (!fn(name, types, attrs)) {
      return false;
    }
  }

  return true;
}

function parseTypes(s: string) {
  // We have to be defensive because lezer will try to parse invalid syntax anyways.
  return s.replace(/^\(/, "").replace(/\)$/, "").split("/").map((t) => t.trim())
    .filter((t) => t.length > 0);
}
