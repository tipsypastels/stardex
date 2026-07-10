import { useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { PokedexFilter } from "../../../models/pokedex/filter";
import { PokedexFormatContext } from "../../../state/context";
import { Actions, type ActionsAction } from "../../common/menus/actions";
import { AddPokemon } from "../add";
import { FilterPokedexModal } from "./filter";
import { FormatPokedexModal } from "./format";

export interface PokedexActionsProps {
  filter: PokedexFilter;
  inTextView: boolean;
}

export function PokedexActions({ filter, inTextView }: PokedexActionsProps) {
  const format = useContext(PokedexFormatContext);
  const modal = useSignal<"format" | "filter">();

  const actions: ActionsAction[] = [
    {
      icon: format.icon.value,
      name: "Format",
      onClick: () => (modal.value = "format"),
    },
  ];

  if (!inTextView) {
    actions.push({
      icon: filter.icon.value,
      name: "Filter",
      onClick: () => (modal.value = "filter"),
    });
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
    </>
  );
}
