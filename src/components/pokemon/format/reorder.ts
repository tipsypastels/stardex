import { useEffect, useRef } from "preact/hooks";
import Sortable from "sortablejs";
import type { PokemonList } from "../../../models/pokemon/list";

/**
 * NOTE: Moving items to index zero causes a desync
 * between the state and sortable. I haven't figured
 * out why, possibly zero being falsey breaking something?
 *
 * But instead I just require that the lists have
 * a hidden dummy element at the start that offsets
 * everything. Shrug.
 */
export function useReordering(pokemons: PokemonList) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (ref.current) {
      const sortable = Sortable.create(ref.current, {
        animation: 150,
        onEnd: (event) => pokemons.move(event.oldIndex! - 1, event.newIndex! - 1),
      });
      return () => sortable.destroy();
    }
  }, []);

  return ref;
}
