import { parser } from "./index.grammar";
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

export const starLangLanguage = () =>
  LRLanguage.define({
    parser: parser.configure({
      props: [
        indentNodeProp.add({
          Application: delimitedIndent({ closing: ")", align: false }),
        }),
        foldNodeProp.add({
          Application: foldInside,
        }),
        styleTags({
          Name: t.variableName,
          Types: t.processingInstruction,
          Attr: t.modifier,
          LineComment: t.lineComment,
        }),
      ],
    }),
    languageData: {
      commentTokens: { line: "#" },
    },
  });

export const starLangGrammar = () =>
  new LanguageSupport(
    starLangLanguage(),
  );

export const starLangHighlighting = () =>
  syntaxHighlighting(
    HighlightStyle.define([
      { tag: t.variableName, color: "var(--cm-starlang-ident)" },
      {
        tag: t.processingInstruction,
        color: "var(--cm-starlang-types)",
        fontStyle: "italic",
      },
      {
        tag: t.modifier,
        color: "var(--cm-starlang-attr)",
        textDecoration: "underline",
      },
      { tag: t.paren, color: "var(--cm-starlang-paren)" },
      { tag: t.lineComment, color: "var(--cm-starlang-comment)" },
    ]),
  );

export const starLang = () => [starLangGrammar(), starLangHighlighting()];
