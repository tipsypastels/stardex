import { syntaxTree } from "@codemirror/language";
import { hoverTooltip } from "@codemirror/view";
import { tw } from "../../../../utils/style";
import { getPokemonAtSpan } from "./parse";

const SHOW_IDS = !!localStorage.stardex_debug_tooltip_ids;

export const tooltip = hoverTooltip((view, pos) => {
  const node = syntaxTree(view.state).resolveInner(pos);
  if (node.name !== "Name") return null;

  const pokemon = getPokemonAtSpan(view.state, node);
  if (!pokemon) return null;

  return {
    pos,
    create() {
      const node = document.createElement("div");

      const name = document.createElement("span");
      name.classList.add(tw`text-editor-name`);
      name.innerText = pokemon.name;
      node.appendChild(name);

      const lparen = document.createElement("span");
      lparen.classList.add(tw`text-editor-punctuation`);
      lparen.innerText = " (";
      node.appendChild(lparen);

      if (pokemon.altNameOrNoAltName) {
        const altName = document.createElement("span");
        altName.classList.add(tw`text-editor-alt-name`);
        altName.innerText = pokemon.altNameOrNoAltName;
        node.appendChild(altName);

        const colon = document.createElement("span");
        colon.classList.add(tw`text-editor-punctuation`);
        colon.innerText = ":";
        node.appendChild(colon);
      }

      for (let i = 0; i < pokemon.types.length; i++) {
        if (i > 0) {
          const slash = document.createElement("span");
          slash.classList.add(tw`text-editor-punctuation`);
          slash.innerText = "/";
          node.appendChild(slash);
        }

        const type = document.createElement("span");
        type.classList.add(tw`text-editor-type-name`);
        type.innerText = pokemon.types[i].name;
        node.appendChild(type);
      }

      const rparen = document.createElement("span");
      rparen.classList.add(tw`text-editor-punctuation`);
      rparen.innerText = ")";
      node.appendChild(rparen);

      if (pokemon.exclude) {
        const exclude = document.createElement("span");
        exclude.classList.add(tw`text-editor-modifier`);
        exclude.innerText = " @exclude";
        node.appendChild(exclude);
      }

      if (SHOW_IDS) {
        const id = document.createElement("span");
        id.classList.add(tw`text-editor-comment`);
        id.innerText = ` # ${pokemon.id}`;
        node.appendChild(id);
      }

      return { dom: node };
    },
  };
});
