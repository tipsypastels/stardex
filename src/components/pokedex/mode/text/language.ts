import {
  pickedCompletion,
  type Completion,
  type CompletionContext,
  type CompletionResult,
} from "@codemirror/autocomplete";
import { LanguageSupport, LRLanguage, syntaxTree } from "@codemirror/language";
import type { EditorState } from "@codemirror/state";
import type { SyntaxNode } from "@lezer/common";
import { styleTags, tags } from "@lezer/highlight";
import { EVOLUTION_LINES } from "../../../../models/pokemon/evolution_line";
import { Species, SPECIES, SpeciesAlt } from "../../../../models/pokemon/species";
import { parser } from "../../../../models/pokemon/text/lezer";
import { BUILTIN_TYPES, type Type } from "../../../../models/type";
import { getPokemonBySpan } from "./parse";

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
      const seenExplicitSpecSeparator = context.matchBefore(/:[^)]*/);
      const options = seenExplicitSpecSeparator
        ? TYPE_OPTIONS
        : makeAltNameOptions(context.state, node, true).concat(TYPE_OPTIONS);

      return {
        from: node.from,
        options,
        validFor: /^[\w.]*$/,
      };
    }
    case "AltName": {
      return {
        from: node.from,
        options: makeAltNameOptions(context.state, node, false),
        validFor: /^[\w.]*$/,
      };
    }
    case "@":
    case "Modifier": {
      return {
        from: node.from,
        options: MODIFIER_OPTIONS,
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
    stardex?:
      | { kind: "species"; species: Species }
      | { kind: "type"; type: Type }
      | { kind: "alt"; alt: SpeciesAlt };
  }
}

const NAME_OPTIONS: Completion[] = SPECIES.all.flatMap((species) => {
  const out: Completion[] = [
    {
      label: species.name,
      detail: species.noAltNameLower ? `(${species.noAltName})` : undefined,
      stardex: { kind: "species", species },
    },
  ];

  if (species.alts.length > 0) {
    out.push(
      ...species.alts.map((alt) => ({
        label: `${species.name} (${alt.name}:)`,
        displayLabel: species.name,
        detail: `(${alt.name})`,
        stardex: { kind: "alt" as const, alt },
      })),
    );
  }

  if (species.isStartOfEvolutionLine) {
    out.push({
      label: species.name,
      detail: "(Family)",
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
    });
  }

  return out;
});

const TYPE_OPTIONS: Completion[] = BUILTIN_TYPES.all.map((type) => ({
  label: type.name,
  stardex: { kind: "type", type },
}));

const MODIFIER_OPTIONS: Completion[] = [{ label: "@exclude" }];

function makeAltNameOptions(
  state: EditorState,
  node: SyntaxNode,
  needsColon: boolean,
): Completion[] {
  let listing = node;

  while (listing.name !== "Listing") {
    const parent = listing.parent;
    if (!parent) return [];
    listing = parent;
  }

  const pokemon = getPokemonBySpan(state, listing);
  if (!pokemon?.isBuiltin() || pokemon.species.alts.length === 0) return [];

  return pokemon.species.alts.map((alt) => ({
    label: `${alt.name}${needsColon ? ":" : ""}`,
    displayLabel: alt.name,
    stardex: { kind: "alt", alt },
  }));
}

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
          div.appendChild(renderSpeciesIcon(species.id));

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
        case "alt": {
          const { alt } = completion.stardex;

          const div = document.createElement("div");
          div.classList.add("cm-completionStardexSpecies");
          div.appendChild(renderSpeciesIcon(alt.iconIndex));

          return div;
        }
      }
    },
  },
];

function renderSpeciesIcon(id: number) {
  const img = document.createElement("div");
  img.classList.add("cm-completionStardexSpeciesIcon", "dim");
  img.role = "img";
  img.style.setProperty("--left", `-${(id % 12) * 40}px`);
  img.style.setProperty("--top", `-${Math.floor(id / 12) * 30}px`);
  return img;
}
