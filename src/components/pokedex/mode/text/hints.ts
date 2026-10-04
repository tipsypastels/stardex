import { syntaxTree } from "@codemirror/language";
import { EditorState, Range, StateField } from "@codemirror/state";
import { Decoration, EditorView, WidgetType, type DecorationSet } from "@codemirror/view";
import { filterState } from "./filter";
import { getPokemonAtSpan } from "./parse";
import { forceRefresh } from "./refresh";

export const inlayHints = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(oldDecorations, tr) {
    if (tr.effects.some((effect) => effect.is(forceRefresh))) {
      return decorateTypeHints(tr.state);
    }
    return oldDecorations;
  },
  provide(field) {
    return EditorView.decorations.from(field);
  },
});

function decorateTypeHints(state: EditorState) {
  // Only show inlay hints while in filter mode.
  // This might change in the future.
  const idSet = state.field(filterState);
  if (!idSet) return Decoration.none;

  const widgets: Range<Decoration>[] = [];
  const listings = syntaxTree(state).topNode.getChildren("Listing");

  for (const listing of listings) {
    const pokemon = getPokemonAtSpan(state, listing);
    if (!pokemon) continue;

    // Both a sanity check and a hack - it's doing the
    // thing where the last line's inlay hint still renders
    // even though the line itself is hidden >:(.
    // This fixes it but if you ever have inlay hints
    // without filtering it's going to be an issue.
    if (!idSet.has(pokemon.id)) {
      continue;
    }

    const spec = listing.getChild("Spec");
    if (spec?.getChild("TypeList")) {
      continue;
    }

    const typeNames = pokemon.types.map((type) => type.name).join("/");
    let position: number;
    let text: string;

    if (spec) {
      const closeParen = spec.getChild(")");
      const separator = spec.getChild("SpecSeparator");
      const altName = spec.getChild("AltName");

      if (separator) {
        position = separator.to;
        text = typeNames;
      } else if (altName) {
        position = closeParen?.from ?? spec.to;
        text = `:${typeNames}`;
      } else {
        position = closeParen?.from ?? spec.to;
        text = typeNames;
      }
    } else {
      const nameNode = listing.getChild("Name");
      position = nameNode?.to ?? listing.from;
      text = ` (${typeNames})`;
    }

    widgets.push(
      Decoration.widget({ widget: new InlayHintWidget(text, "cm-type-hint"), side: 1 }).range(
        position,
      ),
    );
  }

  return Decoration.set(widgets, true);
}

class InlayHintWidget extends WidgetType {
  #text: string;
  #className: string;

  constructor(text: string, className: string) {
    super();
    this.#text = text;
    this.#className = className;
  }

  eq(other: this) {
    return this.#text === other.#text && this.#className === other.#className;
  }

  toDOM(): HTMLElement {
    const span = document.createElement("span");
    span.className = this.#className;
    span.textContent = this.#text;
    return span;
  }
}
