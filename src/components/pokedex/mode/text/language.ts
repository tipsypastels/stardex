import { LanguageSupport, LRLanguage } from "@codemirror/language";
import { styleTags, tags } from "@lezer/highlight";
import { parser } from "../../../../models/pokemon/text/lezer";
import { runAutocomplete } from "./autocomplete";

export const language = new LanguageSupport(
  LRLanguage.define({
    parser: parser.configure({
      props: [
        styleTags({
          "Name": tags.variableName,
          "AltName": tags.labelName,
          "TypeName": tags.typeName,
          "Modifier": tags.annotation,
          "Comment": tags.lineComment,
          "InlineComment": tags.lineComment,

          "SpecSeparator": tags.punctuation,
          '( ) : "/"': tags.punctuation,
          "@": tags.annotation,
        }),
      ],
    }),
    languageData: {
      commentTokens: { line: "#" },
      closeBrackets: { brackets: ["("] },
      autocomplete: runAutocomplete,
    },
  }),
);
