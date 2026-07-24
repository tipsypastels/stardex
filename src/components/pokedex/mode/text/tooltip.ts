import { hoverTooltip } from "@codemirror/view";
import { getPokemonAtSpan } from "./parse";

export const tooltip = hoverTooltip((view, pos) => {
  const span = view.state.doc.lineAt(pos);
  const pokemon = getPokemonAtSpan(view.state, span);
  if (!pokemon) return null;

  return {
    pos,
    create() {
      const node = document.createElement("div");
      node.innerText = JSON.stringify(pokemon.toRaw());
      return { dom: node };
    },
  };
});
