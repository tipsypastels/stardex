import { parser } from "./mylang.grammar";
import {
  delimitedIndent,
  foldInside,
  foldNodeProp,
  indentNodeProp,
  LanguageSupport,
  LRLanguage,
} from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";

export const myLang = () =>
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
