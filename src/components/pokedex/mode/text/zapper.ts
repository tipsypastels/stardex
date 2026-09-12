import { syntaxTree } from "@codemirror/language";
import { Facet, StateEffect, StateField, type Extension } from "@codemirror/state";
import { EditorView } from "codemirror";
import { toasts } from "../../../../models/ui/toast";
import { getPokemonAtSpan } from "./parse";

export const setZapperEnabled = StateEffect.define<boolean>();

export function zapper(initial: boolean): Extension {
  return [enabled, enabledInitial.of(initial), onClick];
}

const enabledInitial = Facet.define<boolean, boolean>({
  combine: (values) => values.at(-1) ?? false,
});

const enabled = StateField.define<boolean>({
  create(state) {
    return state.facet(enabledInitial);
  },
  update(value, tr) {
    return tr.effects.find((effect) => effect.is(setZapperEnabled))?.value ?? value;
  },
});

const onClick = EditorView.domEventHandlers({
  mousedown(event, view) {
    if (!view.state.field(enabled)) return false;

    const position = view.posAtCoords({ x: event.clientX, y: event.clientY });
    if (position == null) return false;

    let node = syntaxTree(view.state).resolveInner(position, -1);
    while (node.name !== "Listing") {
      const parent = node.parent;
      if (!parent) return false;
      node = parent;
    }

    const pokemon = getPokemonAtSpan(view.state, node);
    if (!pokemon) return false;

    const deleteSpan =
      node.from === 0
        ? // When deleting the first listing, delete the newline after it.
          { from: node.from, to: Math.min(node.to + 1, view.state.doc.length) }
        : // When deleting any other listing, delete the newline before it.
          { from: Math.max(node.from - 1), to: node.to };

    event.preventDefault();
    view.dispatch({ changes: { ...deleteSpan, insert: "" } });
    toasts.add("bolt", `Zapped ${pokemon.name}!`);

    return true;
  },
});
