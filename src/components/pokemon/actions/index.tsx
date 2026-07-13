import { batch, Signal, useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import type { PokedexFilter } from "../../../models/pokedex/filter";
import type { PokedexMode } from "../../../models/pokedex/mode";
import type { AutosortRequest } from "../../../models/pokemon/autosort";
import type { PokemonList } from "../../../models/pokemon/list";
import { POKEMON_LIST_VERSION } from "../../../models/versioned";
import { toasts } from "../../../state/toast";
import { ActionBar, ActionBarItem } from "../../common/menus/action_bar";
import { AddPokemon } from "../add";
import { AutosortPokedexModal } from "./autosort";
import { filterPokedexActionIcon, FilterPokedexModal } from "./filter";
import { PokedexModeModal } from "./mode";

export interface PokedexActionsProps {
  pokemons: PokemonList;
  filter: PokedexFilter;
  mode: PokedexMode;
  zapper: Signal<boolean>;
  onAutosort(request: AutosortRequest): void;
}

export function PokedexActions({
  pokemons,
  filter,
  mode,
  zapper,
  onAutosort,
}: PokedexActionsProps) {
  const isNonTextMode = useComputed(() => mode.key.value !== "text");
  const isEmpty = useComputed(() => pokemons.size.value === 0);
  const modal = useSignal<"mode" | "filter" | "autosort">();

  useSignalEffect(() => {
    if (isEmpty.value || !isNonTextMode.value) {
      zapper.value = false;
    }
  });

  function toggleZapper() {
    batch(() => {
      if (zapper.value) {
        zapper.value = false;
        toasts.add("bolt", "Zapper deactivated.");
      } else {
        zapper.value = true;
        toasts.add("bolt", "Zapper active. Pokémon you click will be deleted!");
      }
    });
  }

  function clearPokedex() {
    if (!confirm("Are you sure you want to clear your Pokédex? You won't be getting it back.")) {
      return;
    }

    batch(() => {
      pokemons.setFromRaw({ v: POKEMON_LIST_VERSION, all: [] });
      toasts.add("trash", "Pokédex cleared! A blank slate...");
    });
  }

  return (
    <>
      <ActionBar isUpperHalf>
        <ActionBarItem name="Mode" icon={mode.icon.value} onClick={() => (modal.value = "mode")} />
        <Show when={isNonTextMode}>
          {() => (
            <>
              <ActionBarItem
                name="Filter"
                icon={filterPokedexActionIcon(filter.state.value)}
                active={!!filter.state.value}
                disabled={isEmpty}
                onClick={() => (modal.value = "filter")}
              />
              <ActionBarItem
                name="Sort"
                icon="arrow-down-1-9"
                disabled={isEmpty}
                onClick={() => (modal.value = "autosort")}
              />
              <ActionBarItem
                name="Zap"
                icon="bolt"
                active={zapper}
                disabled={isEmpty}
                onClick={toggleZapper}
              />
              <ActionBarItem name="Clear" icon="trash" disabled={isEmpty} onClick={clearPokedex} />
            </>
          )}
        </Show>
      </ActionBar>

      <Show when={() => mode.key.value !== "text"}>{() => <AddPokemon />}</Show>

      <Show when={() => modal.value === "mode"}>
        <PokedexModeModal mode={mode} onClose={() => (modal.value = undefined)} />
      </Show>

      <Show when={() => modal.value === "filter"}>
        <FilterPokedexModal filter={filter} onClose={() => (modal.value = undefined)} />
      </Show>

      <Show when={() => modal.value === "autosort"}>
        <AutosortPokedexModal
          onAutosort={(options) => {
            batch(() => {
              batch(() => {
                modal.value = undefined;
                onAutosort(options);
              });
            });
          }}
          onClose={() => (modal.value = undefined)}
        />
      </Show>
    </>
  );
}
