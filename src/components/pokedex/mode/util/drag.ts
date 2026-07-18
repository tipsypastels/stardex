import { createEffect, onCleanup, type Accessor } from "solid-js";
import Sortable from "sortablejs";
import { pokemons } from "../../../../models/pokemon/list";

declare module "solid-js" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Directives {
      draggable: boolean;
    }
  }
}

export function draggable(element: HTMLElement, enabled: Accessor<boolean>) {
  createEffect(() => {
    if (enabled()) {
      let nextSibling: Node | null = null;

      const sortable = Sortable.create(element, {
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
}
