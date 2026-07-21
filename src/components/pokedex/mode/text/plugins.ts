import { LanguageSupport, LRLanguage } from "@codemirror/language";
import { styleTags, tags } from "@lezer/highlight";
import { parser } from "../../../../models/pokemon/text/parse.js";

export const language = new LanguageSupport(
  LRLanguage.define({
    parser: parser.configure({
      props: [
        styleTags({
          "Name": tags.definition(tags.variableName),
          "FormName": tags.labelName,
          "TypeList": tags.typeName,
          "Modifier": tags.annotation,
          "Comment": tags.lineComment,
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
