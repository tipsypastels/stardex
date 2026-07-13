import { useSignalEffect, type ReadonlySignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import Sortable from "sortablejs";
import type { PokemonList } from "../../../../models/pokemon/list";

/**
 * NOTE: Moving items to index zero causes a desync
 * between the state and sortable. I haven't figured
 * out why, possibly zero being falsey breaking something?
 *
 * But instead I just require that the lists have
 * a hidden dummy element at the start that offsets
 * everything. Shrug.
 */
export function useDraggable(enabled: ReadonlySignal<boolean>, pokemons: PokemonList) {
  const gridRef = useRef<HTMLOListElement>(null);
  const sortableRef = useRef<Sortable>(null);

  useSignalEffect(() => {
    if (enabled.value && gridRef.current) {
      sortableRef.current = Sortable.create(gridRef.current, {
        animation: 150,
        handle: "[data-handle]",
        ghostClass: "opacity-0",
        onEnd: (event) => pokemons.move(event.oldIndex! - 1, event.newIndex! - 1),
      });
      return () => {
        sortableRef.current?.destroy();
        sortableRef.current = null;
      };
    }
  });

  return { gridRef };
}
