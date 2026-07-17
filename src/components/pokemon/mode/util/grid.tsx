import { useComputed } from "@preact/signals";
import { For, Show } from "@preact/signals/utils";
import hotkeys from "hotkeys-js";
import type { ComponentChildren, RefObject } from "preact";
import { useEffect } from "preact/hooks";
import type { PokedexModeViewProps } from "..";
import type { Pokemon } from "../../../../models/pokemon";
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

  useEffect(() => {
    const f = () => pokemons.delete(0);
    hotkeys("x", f);
    return () => hotkeys.unbind("x", f);
  });

  return (
    <>
      {list(
        gridRef,
        <>
          {/* Dummy, see useDraggable. */}
          <li class="hidden"></li>
          <For each={filtered} getKey={(entry) => entry.pokemon.id.value}>
            {({ pokemon, unfilteredIndex }) => item(pokemon)}
          </For>
        </>,
      )}
    </>
  );
}
