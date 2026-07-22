import {
  pickedCompletion,
  type Completion,
  type CompletionContext,
  type CompletionResult,
} from "@codemirror/autocomplete";
import { LanguageSupport, LRLanguage, syntaxTree } from "@codemirror/language";
import { styleTags, tags } from "@lezer/highlight";
import { EVOLUTION_LINES } from "../../../../models/pokemon/evolution_line";
import { SPECIES } from "../../../../models/pokemon/species";
import { parser } from "../../../../models/pokemon/text/lezer";
import type { Type } from "../../../../models/type";

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
          "@": tags.annotation,
        }),
      ],
    }),
    languageData: {
      commentTokens: { line: "#" },
      closeBrackets: { brackets: ["("] },
      autocomplete,
    },
  }),
);

function autocomplete(context: CompletionContext): CompletionResult | null {
  const node = syntaxTree(context.state).resolveInner(context.pos, -1);

  switch (node.name) {
    case "Name": {
      return {
        from: node.from,
        options: NAME_OPTIONS,
        validFor: /^[\w.]*$/,
      };
    }
    default: {
      return null;
    }
  }
}

declare module "@codemirror/autocomplete" {
  interface Completion {
    stardex?: { types: Type[] };
  }
}

const NAME_OPTIONS: Completion[] = SPECIES.all.flatMap((species) => {
  if (species.isStartOfEvolutionLine) {
    return [
      {
        label: species.name,
        stardex: { types: species.types },
      },
      {
        label: `${species.name} Family`,
        stardex: { types: species.types },
        apply(view, completion, from, to) {
          const names = EVOLUTION_LINES.of(species)
            .map((species) => species.name)
            .join("\n");

          view.dispatch({
            changes: { from, to, insert: names },
            selection: { anchor: from + names.length },
            annotations: pickedCompletion.of(completion),
          });
        },
      },
    ];
  }
  return {
    label: species.name,
    stardex: { types: species.types },
  };
});

export const autocompleteAddToOptions = [
  {
    position: 30,
    render(completion: Completion) {
      if (!completion.stardex?.types) {
        return null;
      }

      const span = document.createElement("span");

      span.classList.add("cm-completionStardexTypes");

      for (const type of completion.stardex.types) {
        const icon = document.createElement("i");

        icon.classList.add("fas", `fa-${type.icon}`);
        icon.style.color = type.color;

        span.appendChild(icon);
      }

      // TODO: Multiple types.

      return span;
    },
  },
];
