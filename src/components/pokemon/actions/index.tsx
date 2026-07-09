import { useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { PokedexFilter } from "../../../models/pokedex/filter";
import { PokedexFormatContext } from "../../../state/context";
import { Actions } from "../../common/menus/actions";
import { AddPokemon } from "../add";
import { FilterPokedexModal } from "./filter";
import { FormatPokedexModal } from "./format";

export interface PokedexActionsProps {
  filter: PokedexFilter;
}

export function PokedexActions({ filter }: PokedexActionsProps) {
  const format = useContext(PokedexFormatContext);
  const modal = useSignal<"format" | "filter">();

  return (
    <>
      <Actions
        actions={[
          {
            icon: format.icon.value,
            name: "Format",
            onClick: () => (modal.value = "format"),
          },
          {
            icon: filter.icon.value,
            name: "Filter",
            onClick: () => (modal.value = "filter"),
          },
        ]}
        isUpperHalf
      />
      <AddPokemon />

      <Show when={() => modal.value === "format"}>
        <FormatPokedexModal format={format} onClose={() => (modal.value = undefined)} />
      </Show>

      <Show when={() => modal.value === "filter"}>
        <FilterPokedexModal filter={filter} onClose={() => (modal.value = undefined)} />
      </Show>
    </>
  );
}
