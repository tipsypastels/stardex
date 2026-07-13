import { batch, Signal, useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import type { PokedexFilter } from "../../../models/pokedex/filter";
import type { PokedexMode } from "../../../models/pokedex/mode";
import type { AutosortRequest } from "../../../models/pokemon/autosort";
import type { PokemonList } from "../../../models/pokemon/list";
import { POKEMON_LIST_VERSION } from "../../../models/versioned";
import { toasts } from "../../../state/toast";
import { Actions } from "../../common/menus/actions";
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
  const emptyOrTextMode = useComputed(() => pokemons.size.value === 0 || mode.key.value === "text");
  const modal = useSignal<"mode" | "filter" | "autosort">();

  useSignalEffect(() => {
    if (emptyOrTextMode.value) {
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
      <Actions
        actions={[
          {
            icon: mode.icon.value,
            name: "Mode",
            onClick: () => (modal.value = "mode"),
          },
          {
            icon: filterPokedexActionIcon(filter.state.value),
            name: "Filter",
            onClick: () => (modal.value = "filter"),
            active: !!filter.state.value,
            disabled: emptyOrTextMode,
          },
          {
            icon: "arrow-down-1-9",
            name: "Sort",
            onClick: () => (modal.value = "autosort"),
            disabled: emptyOrTextMode,
          },
          {
            icon: "bolt",
            name: "Zapper",
            onClick: toggleZapper,
            active: zapper.value,
            disabled: emptyOrTextMode,
            desktop: true,
          },
        ]}
        // TODO: This really should be a More i think...
        // TODO: This renders wrong on light mode.
        rightAction={{
          icon: "trash",
          name: "Clear",
          look: "footer",
          onClick: clearPokedex,
          disabled: emptyOrTextMode,
        }}
        isUpperHalf
      />

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
