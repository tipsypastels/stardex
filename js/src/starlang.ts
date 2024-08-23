import { parser } from "./starlang.grammar";
import {
  delimitedIndent,
  foldInside,
  foldNodeProp,
  HighlightStyle,
  indentNodeProp,
  LanguageSupport,
  LRLanguage,
  syntaxHighlighting,
} from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";

const grammar = () =>
  new LanguageSupport(LRLanguage.define({
    parser: parser.configure({
      props: [
        indentNodeProp.add({
          Application: delimitedIndent({ closing: ")", align: false }),
        }),
        foldNodeProp.add({
          Application: foldInside,
        }),
        styleTags({
          Identifier: t.variableName,
          Boolean: t.bool,
          String: t.string,
          LineComment: t.lineComment,
          "( )": t.paren,
        }),
      ],
    }),
    languageData: {
      commentTokens: { line: ";" },
    },
  }));

const highlighting = () =>
  syntaxHighlighting(
    HighlightStyle.define([
      { tag: t.variableName, color: "var(--highlight)" },
      { tag: t.bool, color: "red" },
    ]),
  );

export const starLang = () => [grammar(), highlighting()];
