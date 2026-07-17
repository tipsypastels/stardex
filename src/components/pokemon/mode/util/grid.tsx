import { batch, useComputed } from "@preact/signals";
import { For, Show } from "@preact/signals/utils";
import type { ComponentChildren, RefObject } from "preact";
import type { PokedexModeViewProps } from "..";
import type { Pokemon } from "../../../../models/pokemon";
import { toasts } from "../../../../state/toast";
import { EmptyPokedex } from "../../empty";
import { useDraggable } from "./drag";

export interface PokedexGridlikeViewProps extends PokedexModeViewProps {
  list(gridRef: RefObject<HTMLOListElement>, contents: ComponentChildren): ComponentChildren;
  item(pokemon: Pokemon, onClick: () => void): ComponentChildren;
}

export function PokedexGridlikeView(props: PokedexGridlikeViewProps) {
  return (
    <Show when={() => props.pokemons.size.value > 0} fallback={<EmptyPokedex />}>
      {() => <Inner {...props} />}
    </Show>
  );
}

function Inner({
  filter,
  zapper,
  pokemons,
  filtered,
  setEditingIndex,
  list,
  item,
}: PokedexGridlikeViewProps) {
  const draggableEnabled = useComputed(() => !filter.state.value);
  const { gridRef } = useDraggable(draggableEnabled, pokemons);
  return (
    <>
      {list(
        gridRef,
        <>
          {/* Dummy, see useDraggable. */}
          <li class="hidden"></li>
          <For each={filtered} getKey={(entry) => entry.pokemon.id.value}>
            {({ pokemon, unfilteredIndex }) =>
              item(pokemon, () => {
                if (zapper.value) {
                  batch(() => {
                    toasts.add("bolt", `Zapped ${pokemon.name.peek()}!`);
                    pokemons.delete(unfilteredIndex);
                  });
                } else {
                  setEditingIndex(unfilteredIndex);
                }
              })
            }
          </For>
        </>,
      )}
    </>
  );
}
