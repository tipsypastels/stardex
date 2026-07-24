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
    color: "var(--foreground-muted)",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--foreground)",
  },
  ".cm-tooltip-hover": {
    backgroundColor: "transparent",
    border: "0",
  },
  ".cm-diagnostic": {
    backgroundColor: "var(--background)",
    borderRadius: "var(--radius-md)",
    paddingLeft: "calc(var(--spacing) * 4)",
    paddingRight: "calc(var(--spacing) * 4)",
  },
  ".cm-diagnostic:not(:first-child)": {
    marginTop: "calc(var(--spacing) * 2)",
  },
  ".cm-diagnostic-warning": {
    border: "2px solid var(--warning)",
  },
  ".cm-diagnostic-error": {
    border: "2px solid var(--error)",
  },
  ".cm-tooltip-autocomplete": {
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    border: "2px solid var(--primary)",
  },
  ".cm-tooltip-autocomplete ul": {
    fontFamily: "var(--font-sans) !important",
    fontSize: "var(--text-lg) !important",
  },
  ".cm-tooltip-autocomplete li": {
    display: "flex",
    alignItems: "center",
    padding: "0 !important",
  },
  ".cm-tooltip-autocomplete li[aria-selected]": {
    backgroundColor: "var(--background) !important",
    color: "var(--primary) !important",
  },
  ".cm-completionIcon": {
    display: "none",
  },
  ".cm-completionStardexSpecies": {
    display: "inline-block",
    position: "relative",
  },
  ".cm-completionStardexSpeciesIcon": {
    backgroundImage: 'url("https://play.pokemonshowdown.com/sprites/pokemonicons-sheet.png?v22")',
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "scroll",
    backgroundPosition: "var(--left) var(--top)",
    backgroundSize: "480px",
    imageRendering: "pixelated",
    height: "calc(var(--spacing) * 7.5)",
    width: "calc(var(--spacing) * 10)",
  },
  ".cm-completionStardexSpeciesFamilyIcon": {
    position: "absolute",
    top: "4px",
    right: 0,
    fontSize: "50%",
  },
  ".cm-completionStardexType": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "calc(var(--spacing) * 7.5)",
    width: "calc(var(--spacing) * 10)",
  },
  ".cm-completionMatchedText": {
    textDecoration: "none !important",
    fontWeight: "bold",
  },
});

// TODO: Style .cm-activeLineGutter identically to how you end up styling active line.

export const highlightTheme = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.variableName, color: "var(--primary)" },
    { tag: tags.labelName, color: "var(--secondary)" },
    { tag: tags.typeName, color: "var(--primary)" },
    { tag: tags.annotation, color: "var(--secondary)" },
    { tag: tags.comment, color: "var(--foreground-muted)" },
  ]),
);
