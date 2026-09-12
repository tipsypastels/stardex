import { batch, Show, type JSXElement } from "solid-js";
import { pokedexFilter, pokemonsFiltered } from "../../../../models/pokedex/filter";
import { toasts } from "../../../../models/ui/toast";
import { Empty } from "../../../common/empty";
import { ButtonLink } from "../../../common/link";
import { runPokedexModeRefreshCallback } from "../refresh";

export interface WithFilterNoneProps {
  children: JSXElement;
}

export function WithFilterNone(props: WithFilterNoneProps) {
  return (
    <Show when={pokemonsFiltered.all.length === 0} fallback={props.children}>
      <FilterNone />
    </Show>
  );
}

export function FilterNone() {
  return (
    <Empty class="mt-4">
      Your filter didn't match any Pokémon.{" "}
      <ButtonLink
        onClick={() => {
          batch(() => {
            pokedexFilter.state = undefined;
            toasts.add("asterisk", "Cleared filter.");
          });
          runPokedexModeRefreshCallback();
        }}
      >
        Clear it?
      </ButtonLink>
    </Empty>
  );
}
