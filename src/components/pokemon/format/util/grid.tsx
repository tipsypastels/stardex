import { For, Show } from "@preact/signals/utils";
import type { ComponentChildren, RefObject } from "preact";
import type { PokedexFormatViewProps } from "..";
import type { Pokemon } from "../../../../models/pokemon";
import { useDraggable } from "./drag";
import { EmptyPokedex } from "./empty";

export interface PokedexGridlikeViewProps extends PokedexFormatViewProps {
  list(gridRef: RefObject<HTMLOListElement>, contents: ComponentChildren): ComponentChildren;
  item(pokemon: Pokemon, onClick: () => void): ComponentChildren;
}

export function PokedexGridlikeView({
  filter,
  pokemons,
  pokemonsFiltered,
  setEditingIndex,
  list,
  item,
}: PokedexGridlikeViewProps) {
  const { gridRef } = useDraggable(!filter.state.value, pokemons);
  return (
    <Show when={() => pokemons.size.value > 0} fallback={<EmptyPokedex />}>
      {list(
        gridRef,
        <>
          {/* Dummy, see useDraggable. */}
          <li class="hidden"></li>
          <For each={pokemonsFiltered} getKey={(pokemon) => pokemon.key.value}>
            {(pokemon) =>
              item(pokemon, () =>
                // NOTE: We can't use the loop index here, that's the filtered index and we need
                // the unfiltered index to do the lookup in the parent.
                setEditingIndex(pokemons.indices.value.get(pokemon.key.value)!),
              )
            }
          </For>
        </>,
      )}
    </Show>
  );
}
