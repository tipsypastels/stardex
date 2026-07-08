import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { PokedexFilter } from "../../../models/pokedex_filter";
import { POKEDEX_FORMATS, type PokedexFormat } from "../../../models/pokedex_format";
import { MetricsContext, PokedexFormatContext } from "../../../state/context";
import { Actions } from "../../common/menus/actions";
import { Drawer, useCabinetState } from "../../common/menus/drawer";
import { ModePicker } from "../../common/menus/mode_picker";

export interface PokedexActionsProps {
  filter: PokedexFilter;
}

export function PokedexActions({ filter }: PokedexActionsProps) {
  const format = useContext(PokedexFormatContext);
  const dropdown = useCabinetState<"format" | "filter">();

  return (
    <>
      <Actions
        actions={[
          {
            icon: format.icon.value,
            name: "Format",
            onClick: (e) => dropdown.open("format", e.currentTarget),
          },
          {
            icon: filter.icon.value,
            name: "Filter",
            onClick: (e) => dropdown.open("filter", e.currentTarget),
          },
        ]}
      />

      <Show when={() => dropdown.current.value === "format"}>
        <FormatModal format={format} onClose={() => dropdown.close()} />
      </Show>

      <Show when={() => dropdown.current.value === "filter"}>
        <FilterModal filter={filter} onClose={() => dropdown.close()} />
      </Show>
    </>
  );
}

interface FormatModalProps {
  format: PokedexFormat;
  onClose(): void;
}

function FormatModal({ format, onClose }: FormatModalProps) {
  return (
    <Drawer onClose={onClose}>
      <ModePicker
        modes={POKEDEX_FORMATS.options}
        activeIndex={format.index.value}
        setActiveIndex={(index) => (format.key.value = POKEDEX_FORMATS.keys[index])}
      />
    </Drawer>
  );
}

interface FilterModalProps {
  filter: PokedexFilter;
  onClose(): void;
}

function FilterModal({ filter, onClose }: FilterModalProps) {
  const metrics = useContext(MetricsContext);
  return (
    <Drawer onClose={onClose}>
      <div class="flex items-center">
        <div class="font-bold">Type:</div>
        <select
          class="text-primary mx-1 grow border-0 px-1 py-0 underline"
          value={filter.ofKind.value("type")}
          onChange={(e) => {
            e.preventDefault();
            filter.raw.value = (e.target as HTMLSelectElement).value;
          }}
        >
          <option value={undefined}>Any</option>

          {[...metrics.pokemonsAllotment.value.types.values()].map(({ type, count }) => (
            <option value={`type:${type.key}`}>
              {type.name} ({count})
            </option>
          ))}
        </select>
      </div>
    </Drawer>
  );
}
