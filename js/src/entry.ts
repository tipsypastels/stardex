import { syntaxTree } from "@codemirror/language";
import { EditorState } from "@codemirror/state";

export interface Entry {
  name: string;
  types?: string[];
  attrs: string[];
}

interface Span {
  from: number;
  to: number;
}

export function entries(state: EditorState) {
  const entries: Entry[] = [];
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

    entries.push({ name, types, attrs });
  }

  return entries;
}

function parseTypes(s: string) {
  // Don't just slice 1..-1, because lezer's loose syntax
  // will try to "fix" missing parens.
  return s.replace(/^\(/, "").replace(/\)$/, "").split(/\w*\/\w*/);
}
