import { LanguageSupport, LRLanguage } from "@codemirror/language";
import { styleTags, tags } from "@lezer/highlight";
import { parser } from "../../../../models/pokemon/text/lezer";

export const language = new LanguageSupport(
  LRLanguage.define({
    parser: parser.configure({
      props: [
        styleTags({
          "Name": tags.variableName,
          "AltName": tags.labelName,
          "TypeList": tags.typeName,
          "Modifier": tags.annotation,
          "Comment": tags.lineComment,
          "InlineComment": tags.lineComment,
          "( )": tags.paren,
          ":": tags.punctuation,
        }),
      ],
    }),
    languageData: {
      commentTokens: { line: "#" },
      closeBrackets: { brackets: ["("] },
    },
  }),
);
