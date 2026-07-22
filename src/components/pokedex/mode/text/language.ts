import {
  pickedCompletion,
  type Completion,
  type CompletionContext,
  type CompletionResult,
} from "@codemirror/autocomplete";
import { LanguageSupport, LRLanguage, syntaxTree } from "@codemirror/language";
import { styleTags, tags } from "@lezer/highlight";
import { EVOLUTION_LINES } from "../../../../models/pokemon/evolution_line";
import { Species, SPECIES } from "../../../../models/pokemon/species";
import { parser } from "../../../../models/pokemon/text/lezer";
import { BUILTIN_TYPES, type Type } from "../../../../models/type";

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
    case "TypeName": {
      return {
        from: node.from,
        options: TYPE_OPTIONS,
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
    stardex?: { kind: "species"; species: Species } | { kind: "type"; type: Type };
  }
}

const NAME_OPTIONS: Completion[] = SPECIES.all.flatMap((species) => {
  if (species.isStartOfEvolutionLine) {
    return [
      {
        label: species.name,
        stardex: { kind: "species", species },
      },
      {
        label: `${species.name} Family`,
        stardex: { kind: "species", species },
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
    stardex: { kind: "species", species },
  };
});

const TYPE_OPTIONS: Completion[] = BUILTIN_TYPES.all.map((type) => {
  return {
    label: type.name,
    stardex: { kind: "type", type },
  };
});

export const autocompleteAddToOptions = [
  {
    position: 30,
    render(completion: Completion) {
      if (!completion.stardex) {
        return null;
      }

      switch (completion.stardex.kind) {
        case "species": {
          const { species } = completion.stardex;

          const div = document.createElement("div");
          div.classList.add("cm-completionStardexSpecies");

          const img = document.createElement("div");
          img.classList.add("cm-completionStardexSpeciesIcon", "dim");
          img.role = "img";
          img.title = species.name;
          img.style.setProperty("--left", `-${(species.id % 12) * 40}px`);
          img.style.setProperty("--top", `-${Math.floor(species.id / 12) * 30}px`);

          div.appendChild(img);

          return div;
        }
        case "type": {
          const { type } = completion.stardex;

          const div = document.createElement("div");
          div.classList.add("cm-completionStardexType");

          const icon = document.createElement("i");
          icon.classList.add("cm-completionStardexTypeIcon", "fas", `fa-${type.icon}`, "dim");
          icon.style.color = type.color;

          div.appendChild(icon);

          return div;
        }
      }
    },
  },
];
