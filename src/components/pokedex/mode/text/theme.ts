import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { EditorView } from "codemirror";

export const theme = EditorView.theme({
  ".cm-content, .cm-gutter": {
    minHeight: "100px",
  },

  ".cm-scroller": {
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-lg)",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    border: "0",
  },
  ".cm-gutterElement": {
    backgroundColor: "transparent",
    color: "var(--foreground-lesser)",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--foreground)",
  },
});

export const highlightTheme = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.variableName, color: "var(--primary)" },
    { tag: tags.labelName, color: "var(--secondary)" },
    { tag: tags.typeName, color: "var(--primary)" },
    { tag: tags.annotation, color: "var(--secondary)" },
    { tag: tags.comment, color: "var(--foreground-lesser)" },
  ]),
);
