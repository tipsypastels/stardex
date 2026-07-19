import { createEffect, onCleanup, type Accessor } from "solid-js";
import Sortable from "sortablejs";
import { pokemons } from "../../../../models/pokemon/list";

export function createDraggable(enabled: Accessor<boolean>) {
  const list: { current?: HTMLOListElement } = {};

  createEffect(() => {
    if (enabled() && list.current) {
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
