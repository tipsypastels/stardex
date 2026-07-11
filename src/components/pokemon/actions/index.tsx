import { batch, Signal, useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { PokedexFilter } from "../../../models/pokedex/filter";
import type { AutosortRequest } from "../../../models/pokemon/autosort";
import { PokedexFormatContext } from "../../../state/context";
import { toasts } from "../../../state/toast";
import { Actions, type ActionsAction } from "../../common/menus/actions";
import { AddPokemon } from "../add";
import { AutosortPokedexModal } from "./autosort";
import { filterPokedexActionIcon, FilterPokedexModal } from "./filter";
import { FormatPokedexModal } from "./format";

export interface PokedexActionsProps {
  filter: PokedexFilter;
  zapper: Signal<boolean>;
  inTextView: boolean;
  onAutosort(request: AutosortRequest): void;
}

export function PokedexActions({ filter, zapper, inTextView, onAutosort }: PokedexActionsProps) {
  const format = useContext(PokedexFormatContext);
  const modal = useSignal<"format" | "filter" | "autosort">();

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

  const actions: ActionsAction[] = [
    {
      icon: format.icon.value,
      name: "Format",
      onClick: () => (modal.value = "format"),
    },
  ];

  if (!inTextView) {
    actions.push(
      {
        icon: filterPokedexActionIcon(filter.state.value),
        name: "Filter",
        onClick: () => (modal.value = "filter"),
      },
      {
        icon: "arrow-down-1-9",
        name: "Autosort",
        onClick: () => (modal.value = "autosort"),
      },
      {
        icon: "bolt",
        name: "Zapper",
        onClick: toggleZapper,
        active: zapper.value,
        desktop: true,
      },
    );
  }

  return (
    <>
      <Actions actions={actions} isUpperHalf={!inTextView} />
      {!inTextView ? <AddPokemon /> : null}

      <Show when={() => modal.value === "format"}>
        <FormatPokedexModal format={format} onClose={() => (modal.value = undefined)} />
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
