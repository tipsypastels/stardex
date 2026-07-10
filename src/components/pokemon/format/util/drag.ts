import { useEffect, useRef } from "preact/hooks";
import Sortable from "sortablejs";
import type { PokedexFormatKey } from "../../../../models/pokedex/format";
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
export function useDraggable(format: PokedexFormatKey, pokemons: PokemonList) {
  const gridRef = useRef<HTMLOListElement>(null);
  const sortableRef = useRef<Sortable>(null);

  useEffect(() => {
    if (format !== "text" && gridRef.current && !sortableRef.current) {
      sortableRef.current = Sortable.create(gridRef.current, {
        animation: 150,
        ghostClass: "opacity-0",
        onEnd: (event) => pokemons.move(event.oldIndex! - 1, event.newIndex! - 1),
      });
      return () => {
        sortableRef.current?.destroy();
        sortableRef.current = null;
      };
    }
  }, [format]);

  function sort(keys: string[]) {
    sortableRef.current?.sort(keys, true);
  }

  return { gridRef, sort };
}
