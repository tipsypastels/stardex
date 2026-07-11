import { batch, useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { PokedexFilter } from "../../../models/pokedex/filter";
import type { AutosortRequest } from "../../../models/pokemon/autosort";
import { PokedexFormatContext } from "../../../state/context";
import { Actions, type ActionsAction } from "../../common/menus/actions";
import { AddPokemon } from "../add";
import { AutosortPokedexModal } from "./autosort";
import { filterPokedexActionIcon, FilterPokedexModal } from "./filter";
import { FormatPokedexModal } from "./format";

export interface PokedexActionsProps {
  filter: PokedexFilter;
  inTextView: boolean;
  onAutosort(request: AutosortRequest): void;
}

export function PokedexActions({ filter, inTextView, onAutosort }: PokedexActionsProps) {
  const format = useContext(PokedexFormatContext);
  const modal = useSignal<"format" | "filter" | "autosort">();

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
