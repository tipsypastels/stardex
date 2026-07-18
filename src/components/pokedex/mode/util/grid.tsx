import { batch, For, Show, type JSXElement } from "solid-js";
import type { PokedexModeViewProps } from "..";
import type { Pokemon } from "../../../../models/pokemon";
import { pokemons } from "../../../../models/pokemon/list";
import { toasts } from "../../../../models/ui/toast";
import { EmptyPokedex } from "../../empty";

export interface PokedexGridlikeViewProps extends PokedexModeViewProps {
  list(contents: JSXElement): JSXElement;
  item(pokemon: Pokemon, onClick: () => void): JSXElement;
}

export function PokedexGridlikeView(props: PokedexGridlikeViewProps) {
  return (
    <Show when={pokemons.all.length > 0} fallback={<EmptyPokedex />}>
      <Inner {...props} />
    </Show>
  );
}

function Inner(props: PokedexGridlikeViewProps) {
  return (
    <>
      {props.list(
        <>
          {/* Dummy, see useDraggable. */}
          <li class="hidden" />
          <For each={props.filtered}>
            {({ pokemon, unfilteredIndex }) =>
              // This *is* a click handler, but eslint can't see that from only this file.
              // eslint-disable-next-line solid/reactivity
              props.item(pokemon, () => {
                if (props.zapper) {
                  batch(() => {
                    toasts.add("bolt", `Zapped ${pokemon.name}!`);
                    pokemons.delete(unfilteredIndex);
                  });
                } else {
                  props.setEditingIndex(unfilteredIndex);
                }
              })
            }
          </For>
        </>,
      )}
    </>
  );
}
