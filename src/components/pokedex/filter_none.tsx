import { batch, Show, type JSXElement } from "solid-js";
import { pokedexFilter, pokemonsFiltered } from "../../models/pokedex/filter";
import { toasts } from "../../models/ui/toast";
import { Empty } from "../common/empty";
import { ButtonLink } from "../common/link";

export interface WithFilterNoneProps {
  children: JSXElement;
}

export function WithFilterNone(props: WithFilterNoneProps) {
  return (
    <Show when={pokemonsFiltered.all.length === 0} fallback={props.children}>
      <Empty class="mt-4">
        Your filter didn't match any Pokémon.{" "}
        <ButtonLink
          onClick={() => {
            batch(() => {
              pokedexFilter.state = undefined;
              toasts.add("asterisk", "Cleared filter.");
            });
          }}
        >
          Clear it?
        </ButtonLink>
      </Empty>
    </Show>
  );
}
