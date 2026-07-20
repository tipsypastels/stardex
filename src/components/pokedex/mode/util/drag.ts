import { createEffect, onCleanup } from "solid-js";
import Sortable from "sortablejs";
import { pokedexFilter } from "../../../../models/pokedex/filter";
import { pokemons } from "../../../../models/pokemon/list";

export function createDraggable() {
  const list: { current?: HTMLOListElement } = {};

  createEffect(() => {
    if (pokemons.all.length > 0 && !pokedexFilter.state && list.current) {
      let nextSibling: Node | null = null;

      const sortable = Sortable.create(list.current, {
        animation: 150,
        handle: "[data-handle]",
        ghostClass: "opacity-0",
        onStart(event) {
          nextSibling = event.item.nextSibling;
        },
        onEnd(event) {
          const item = event.item;
          const parent = event.to;

          if (nextSibling) {
            parent.insertBefore(item, nextSibling);
          } else {
            parent.appendChild(item);
          }

          pokemons.move(event.oldIndex!, event.newIndex!);
        },
      });
      onCleanup(() => sortable?.destroy());
    }
  });

  return {
    list(current: HTMLOListElement) {
      list.current = current;
    },
  };
}
