import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { EditorView } from "codemirror";

export const theme = EditorView.theme({
  ".cm-gutters": {
    display: "none",
  },
});

export const highlightTheme = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.variableName, color: "var(--primary)" },
    { tag: tags.labelName, color: "var(--secondary)" },
    { tag: tags.typeName, color: "var(--primary)" },
    { tag: tags.modifier, color: "var(--secondary)" },
    { tag: tags.comment, color: "var(--foreground-lesser)" },
  ]),
);
