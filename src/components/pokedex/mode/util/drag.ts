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

/**
 * NOTE: Moving items to index zero causes a desync
 * between the state and sortable. I haven't figured
 * out why, possibly zero being falsey breaking something?
 *
 * But instead I just require that the lists have
 * a hidden dummy element at the start that offsets
 * everything. Shrug.
 */
export function draggable(element: HTMLElement, enabled: Accessor<boolean>) {
  createEffect(() => {
    if (enabled()) {
      const sortable = Sortable.create(element, {
        animation: 150,
        handle: "[data-handle]",
        ghostClass: "opacity-0",
        onEnd(event) {
          pokemons.move(event.oldIndex! - 1, event.newIndex! - 1);
        },
      });
      onCleanup(() => sortable?.destroy());
    }
  });
}
