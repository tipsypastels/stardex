import { batch, createEffect, createSignal, Match, Show, Switch } from "solid-js";
import { pokedexFilter } from "../../../models/pokedex/filter";
import { pokedexMode } from "../../../models/pokedex/mode";
import type { AutosortRequest } from "../../../models/pokemon/autosort";
import { pokemons } from "../../../models/pokemon/list";
import { toasts } from "../../../models/ui/toast";
import { ActionBar, ActionBarItem } from "../../common/menus/action_bar";
import { AddPokemon } from "../add";
import { AutosortPokedexModal } from "./autosort";
import { filterPokedexActionIcon, FilterPokedexModal } from "./filter";
import { PokedexModeModal } from "./mode";

export interface PokedexActionsProps {
  zapper: boolean;
  setZapper(zapper: boolean): void;
  onAutosort(request: AutosortRequest): void;
}

export function PokedexActions(props: PokedexActionsProps) {
  const [modal, setModal] = createSignal<"mode" | "filter" | "autosort">();

  const isNonTextMode = () => pokedexMode.key !== "text";
  const isEmpty = () => pokemons.all.length === 0;

  createEffect(() => {
    if (isEmpty() || !isNonTextMode()) {
      props.setZapper(false);
    }
  });

  function toggleZapper() {
    batch(() => {
      if (props.zapper) {
        props.setZapper(false);
        toasts.add("bolt", "Zapper deactivated.");
      } else {
        props.setZapper(true);
        toasts.add("bolt", "Zapper active. Pokémon you click will be deleted!");
      }
    });
  }

  function clearPokedex() {
    if (!confirm("Are you sure you want to clear your Pokédex? You won't be getting it back.")) {
      return;
    }

    batch(() => {
      pokemons.clear();
      toasts.add("trash", "Pokédex cleared! A blank slate...");
    });
  }

  return (
    <>
      <ActionBar isUpperHalf>
        <ActionBarItem
          id="pokedex-mode"
          name="Mode"
          icon={pokedexMode.icon}
          onClick={() => setModal("mode")}
        />
        <Show when={isNonTextMode()}>
          {(_) => (
            <>
              <ActionBarItem
                id="pokedex-filter"
                name="Filter"
                icon={filterPokedexActionIcon(pokedexFilter.state)}
                active={!!pokedexFilter.state}
                disabled={isEmpty()}
                onClick={() => setModal("filter")}
              />
              <ActionBarItem
                id="pokedex-sort"
                name="Sort"
                icon="arrow-down-1-9"
                disabled={isEmpty()}
                onClick={() => setModal("autosort")}
              />
              <ActionBarItem
                id="pokedex-zapper"
                name="Zap"
                icon="bolt"
                active={props.zapper}
                disabled={isEmpty()}
                onClick={toggleZapper}
              />
              <ActionBarItem
                name="Clear"
                icon="trash"
                disabled={isEmpty()}
                onClick={clearPokedex}
              />
            </>
          )}
        </Show>
      </ActionBar>

      <Show when={isNonTextMode()}>
        <AddPokemon />
      </Show>

      <Switch>
        <Match when={modal() === "mode"}>
          <PokedexModeModal onClose={() => setModal(undefined)} />
        </Match>

        <Match when={modal() === "filter"}>
          <FilterPokedexModal onClose={() => setModal(undefined)} />
        </Match>

        <Match when={modal() === "autosort"}>
          <AutosortPokedexModal
            onAutosort={(request) => {
              batch(() => {
                setModal(undefined);
                props.onAutosort(request);
              });
            }}
            onClose={() => setModal(undefined)}
          />
        </Match>
      </Switch>
    </>
  );
}
