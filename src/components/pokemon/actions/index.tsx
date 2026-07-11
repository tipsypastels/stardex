import { batch, Signal, useComputed, useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import type { PokedexFilter } from "../../../models/pokedex/filter";
import type { PokedexMode } from "../../../models/pokedex/mode";
import type { AutosortRequest } from "../../../models/pokemon/autosort";
import type { PokemonList } from "../../../models/pokemon/list";
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
            name: "Autosort",
            onClick: () => (modal.value = "autosort"),
            disabled: emptyOrTextMode,
          },
          {
            icon: "bolt",
            name: "Zapper",
            onClick: toggleZapper,
            active: zapper.value,
            desktop: true,
          },
        ]}
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
